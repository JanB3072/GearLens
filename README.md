# GearLens — 面向 Cloudflare Pages 的 Astro SEO / GEO 博客框架

英文优先、多语言就绪的内容站框架，部署链路是 **git push → Cloudflare Pages 自动构建 → 纯静态托管**。视觉与信息架构参考 [Definitive Technology](https://www.definitivetechnology.com)：双列 Mega Menu（Categories + Series）、超大全大写标题、分类瓦片、价值点矩阵、编辑引言、系列卡片、多列页脚、`Global | EN` 区域选择器。产品语言被翻译成博客语言：分类替换品类，系列替换产品线，文章替换产品。

## 快速开始

```powershell
npm install
cp .env.example .env      # 至少改 PUBLIC_SITE_URL
npm run dev
npm run preview           # 预览纯静态产物
```

| 命令 | 作用 |
| --- | --- |
| `npm run ingest` | Markdown → 预编译 HTML 分片 + 预计算索引（增量） |
| `npm run budget` | Cloudflare Pages 文件数预算守卫 |
| `npm run audit` | SEO / GEO 质量门禁，有 error 则退出码 1 |
| `npm run build` | `ingest → budget → astro build`，CF Pages 的构建命令 |
| `npm run new -- <slug> [lang]` | 生成带全部 SEO/GEO 字段的文章骨架 |
| `npm run check` | `astro check` |

`.env` 由 `astro.config.mjs` 用 Vite `loadEnv()` 在配置期读取，所以 `PUBLIC_SITE_URL` 会同时作用于 `site`、canonical、hreflang、sitemap、RSS、llms.txt 和 JSON-LD `@id`。内容流水线不依赖域名：`indexes/sitemap.json` 存相对路径，渲染时才解析成绝对 URL，预发和生产可共用同一份内容快照。

## 部署到 Cloudflare Pages

在 CF Dashboard → Workers & Pages → Create → Connect to Git，然后填：

| 设置 | 值 |
| --- | --- |
| Build command | `npm run build`（**必须**包含 ingest 和 budget，不能写 `npx astro build`） |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `22`：仓库已提交 `.node-version`，如 CF 忽略该文件再加环境变量 `NODE_VERSION=22` |
| Environment variables | `PUBLIC_SITE_URL`，以及 `.env.example` 里要覆盖的 `PUBLIC_*` |

**必须注意：**

- `.env` 不进 git，环境变量要在 dashboard 配；漏配 `PUBLIC_SITE_URL` 会让全站 canonical 指向占位域名。
- `content/shards/`、`content/indexes/` 被 gitignore，由构建期 ingest 生成。仓库里只需提交 `content/source/`（Markdown）和 `content/taxonomy/`（分类体系）。
- `public/_headers` 会被 Astro 原样复制到 `dist/_headers`，提供缓存、安全头，以及 Markdown 镜像的 `Content-Type: text/markdown`。
- 所有页面 URL **统一以 `/` 结尾**，HTML 输出为 `<path>/index.html`，与 CF Pages 的目录索引行为和 canonical 完全一致。`robots.txt`、`sitemap*.xml`、`feed.xml`、`*.md` 等端点保持扩展名，不走尾斜杠。
- 每篇文章对应一个真实 `.md` 文件（`/en/raw/<slug>.md`），不是 `index.html`，否则 CF 会以 `text/html` 返回，Markdown 镜像对 LLM 爬虫就失去意义。
- 不需要 `_redirects`：canonical 与 sitemap 都使用带尾斜杠的 URL，CF 对无斜杠请求的重定向不会和 canonical 冲突。

## 架构：纯静态，以及它的天花板

这版**没有任何 adapter、没有 server bundle、没有运行时文件系统访问**。所有页面和端点都在构建期写入 `dist/`，CF Pages 只负责上传和分发。上一版的 `@astrojs/node` + `prerender = false` 已全部移除。

| 机制 | 做法 |
| --- | --- |
| 构建期不解析全量 Markdown | `scripts/ingest.mjs` 预编译成 HTML 分片，按 `sourceHash` 增量写入；`PIPELINE_VERSION` 变更时强制失效，避免旧内链残留 |
| 列表 / 归档 O(pageSize) | 预计算倒排索引 `by-date / by-updated / by-category / by-tag / by-author / by-series` |
| 相关文章 O(n²) | ingest 期用标签倒排表一次算好 `related.json` |
| 路由全量静态 | `src/lib/static-paths.ts` 是唯一路径来源，7 类动态路由全部用 `getStaticPaths()` 生成 |
| Sitemap / 全文语料超限 | sitemap index + 45,000 条/片；`llms-full-N.txt` 100 篇/片 |
| 内容与域名解耦 | 索引存相对路径，渲染期才解析绝对 URL |

### 文件数预算（这是路线 B 的硬上限）

CF Pages **免费版 20,000 文件/部署**，付费版 100,000（2026-01 起，需在项目设置加 `PAGES_WRANGLER_MAJOR_VERSION=4`），单文件 25 MiB。全静态下每篇文章要 **2 个文件**（HTML + Markdown 镜像），再加分页页、分类/标签/作者/系列归档页、`llms-full` 分片，`npm run budget` 会按 `static-paths.ts` 的同一套公式精确计算并在超限前中止构建。

以当前 5 分类 / 10 标签 / 2 作者 / 3 系列配置、每页 12 篇、`llms` 每片 100 篇估算：

```
[budget] 7 published articles · estimated capacity ~6787 articles
```

也就是说免费版大约 **6,800 篇**就会触顶，而不是「1.5 万篇」。想延长静态模式的寿命，按成本从低到高：

1. 提高 `src/config/site.ts` 的 `PAGINATION.articlesPerPage`（例如 24），减少分页页；
2. 提高 `PUBLIC_LLMS_CHUNK_SIZE`（例如 500），减少 `llms-full` 分片；
3. 关闭 Markdown 镜像（删除 `src/pages/[lang]/raw/[slug].md.ts` 并去掉 `ArticleLayout` 的镜像链接），每篇从 2 个文件降到 1 个，容量接近翻倍，但会削弱 GEO；
4. 升级付费套餐，同时调高 `PUBLIC_STATIC_FILE_BUDGET` 与 `PUBLIC_PAGES_FILE_LIMIT`；
5. 迁移到 Workers + R2（见下节）。

`budget` 在用量达到 85% 时会提前告警，方便你安排迁移。

### 到量后的迁移（不是一键开关）

路线 B 到顶后**必须改架构**，框架没有也不会假装提供一键切换。迁移清单：

1. 安装 `@astrojs/cloudflare`，在 `astro.config.mjs` 配置 `adapter: cloudflare()` 与 `output: 'server'`（或 Astro 5 混合渲染），创建 `wrangler.toml` 并绑定 R2 bucket。
2. **`src/lib/repository.ts` 是唯一的替换点**：把 `readShard()` 的 `fs.readFileSync` 换成 `env.CONTENT.get(key)`（R2），把 `getManifest()` / `getIndex()` 换成少量 KV 或分片静态索引。Workers(workerd) 没有真实文件系统，即使开 `nodejs_compat` 也读不到仓库文件，这一步无法省略。
3. CI 里在 `ingest` 之后把 `content/shards/` 增量上传到 R2（只传 `sourceHash` 变化的键）。
4. 文章详情、深分页、归档路由改回 `prerender = false`，静态首页/端点保留预渲染。
5. 索引不要整体加载：十万篇时 `manifest.json` 约 30 MB，Worker 免费版 CPU 10ms / 内存 128MB 无法在冷启动里 `JSON.parse`，必须分片或放 KV。

数据访问已收敛在 `repository.ts` 的少数函数里，其余页面代码不需要改。

## 目录结构

```
content/
  source/<lang>/*.md        作者写作区（进 git）
  shards/<xx>/*.json        预编译正文（gitignore，ingest 生成）
  indexes/*.json            清单、倒排索引、related、sitemap、search（同上）
  taxonomy/*.json           分类 / 系列 / 作者 / 标签 / 术语表（进 git，注册进 Content Layer）
scripts/
  ingest.mjs                内容流水线
  check-static-budget.mjs   CF Pages 文件数守卫
  audit.mjs                 SEO/GEO 质量门禁
  new-article.mjs           文章脚手架
src/
  config/                   站点常量、Mega Menu、静态页内容
  i18n/                     语言注册表、字典回退、URL 生成（localePath / rawPath）
  lib/                      repository / links / schema / seo / geo / sitemap / routes / static-paths
  components/               layout / seo / geo / cards / article / ui
  layouts/                  BaseLayout / ArticleLayout / ListingLayout
  pages/                    页面与端点（全部静态）
  styles/                   tokens / global / prose（含明暗主题）
public/
  _headers                  CF 响应头（缓存、安全、Markdown MIME）
```

## 内容工作流

1. `npm run new -- my-topic en`，填写 frontmatter：`answer`（40–60 词直接答案）、`keyTakeaways`、`faq`（≥3）、`howTo`、`sources`、`entities`、`updatedAt`、`reviewedAt`、`author`。
2. 正文用 `{{article:slug|锚文本}}` 和 `{{glossary:slug}}` 做内链，ingest 阶段解析成真实 URL；slug 变更不会留下死链。
3. `npm run ingest && npm run audit && npm run budget`。
4. 提交 `content/source/` 与 `content/taxonomy/`，push 后 CF 自动构建。

`audit` 检查标题/描述长度、短答案、要点数、FAQ、引用 URL、内链有效性（尾斜杠不敏感）、未解析短代码、孤儿页、重复标题、日期逻辑、图片 alt。error 阻断发布。

## 多语言扩展（v1 只有英文）

`src/i18n/locales.ts` 把目标语言 `enabled` 改为 `true`，补 `src/i18n/ui/<lang>.ts` 字典（可只翻译部分键，缺失自动回退英文）。框架已处理 `/[lang]/...` 路由、x-default、hreflang、sitemap alternates、`inLanguage`、`og:locale`、`<html lang dir>`；只给真正翻译过的页面发 hreflang；未翻译占位页用 `fallbackOf` 自动 `noindex, follow` 且 canonical 指向原文。

**注意文件数**：每开一个语言，页面数几乎翻倍。开语言前先跑 `npm run budget` 重新评估容量，或提前迁到 R2。

## SEO / GEO 清单（已内置）

canonical（带尾斜杠）、hreflang + x-default、robots 精确指令、OG/Twitter/citation 元标签、单一 `@graph`（BlogPosting / FAQPage / HowTo / BreadcrumbList / Person / Organization / WebSite+SearchAction / ItemList / DefinedTerm）、分片 sitemap、RSS、面包屑、分页 `rel=prev/next`、预计算相关文章与实体内链、语义化 HTML、`compressHTML`、零 Web 字体、无 JS 也能读完全文。

GEO：`llms.txt` + 分片全文、每篇独立 `.md` 镜像（`<link rel="alternate" type="text/markdown">`）、首屏 Short answer + Key takeaways、短段落与自包含小标题、数字带单位与条件、失败案例、真实 `dateModified` 与复核人、术语实体页、`robots.txt` 显式放行 12 类 AI 爬虫。

## 主要端点

| 路径 | 说明 |
| --- | --- |
| `/robots.txt` | 爬行策略 + sitemap 分片 |
| `/sitemap.xml`, `/sitemap-N.xml` | sitemap 索引与分片（含 hreflang） |
| `/llms.txt`, `/llms-full.txt`, `/llms-full-N.txt` | 生成式引擎语料 |
| `/feed.xml` | 最近 50 篇更新 |
| `/search-index.json` | 前端搜索轻量索引（Top N） |
| `/<lang>/raw/<slug>.md` | 文章 Markdown 镜像 |

## 上线前必改

1. `PUBLIC_SITE_URL` 改成真实域名；`src/config/site.ts` 里的组织名、邮箱、社交账号。
2. `content/taxonomy/*.json` 换成真实分类、系列、作者、术语。
3. 删除 `content/source/en/` 的示例文章。
4. 把 `SiteFooter.astro` 订阅表单接到邮件服务商；接入 Cookie 同意（若启用分析/广告）。
5. OG 图目前是 SVG 占位，社交平台多数只认 PNG/JPEG，生产环境用 satori/sharp 生成 1200×630 PNG。
6. 文章超过约 5,000 篇时把 `search-index.json` 换成 Algolia / Typesense / Orama Cloud / Pagefind 分片。
7. 部署后用 `curl -I` 抽查 `/en/`、`/en/blog/<slug>/`、`/en/raw/<slug>.md`，确认状态码与 `Content-Type`。
