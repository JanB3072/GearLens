#!/usr/bin/env node
/**
 * Cloudflare Pages file-count guard.
 *
 * The Free plan allows 20,000 files per deployment (paid: 100,000 with
 * PAGES_WRANGLER_MAJOR_VERSION=4). Full SSG emits two files per article
 * (HTML + Markdown mirror) plus archive/pagination/llms shards, so the real
 * ceiling is far below "one file per article". This runs BEFORE `astro build`
 * so a corpus that would fail at upload time fails locally instead, with an
 * accurate breakdown and a migration hint.
 *
 * Formulas mirror `src/lib/static-paths.ts` exactly.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INDEXES = path.join(ROOT, 'content', 'indexes');
const TAXONOMY = path.join(ROOT, 'content', 'taxonomy');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const idx = (name) => read(path.join(INDEXES, `${name}.json`));
const tax = (name) => read(path.join(TAXONOMY, `${name}.json`));

if (!fs.existsSync(path.join(INDEXES, 'manifest.json'))) {
  console.error('[budget] Run `npm run ingest` first.');
  process.exit(1);
}

const PER_PAGE = 12;                                    // config/site.ts PAGINATION
const LLMS_CHUNK = Number(process.env.PUBLIC_LLMS_CHUNK_SIZE || 100);
const SITEMAP_LIMIT = Number(process.env.PUBLIC_SITEMAP_URL_LIMIT || 45_000);
const BUDGET = Number(process.env.PUBLIC_STATIC_FILE_BUDGET || 18_000);
const PLAN_LIMIT = Number(process.env.PUBLIC_PAGES_FILE_LIMIT || 20_000);
const LOCALES = 1;                                      // enabled locale count (v1)
const SAFETY_MARGIN = 40;                               // _astro chunks, assets, _headers

const N = idx('manifest').articles.filter((a) => a.status === 'published' && !a.noindex).length;
const sitemapUrls = idx('sitemap').length;
const groupCounts = {
  categories: idx('by-category'),
  tags: idx('by-tag'),
  authors: idx('by-author'),
  series: idx('by-series'),
};
const groupPages = (map) => Object.values(map).reduce(
  (sum, ids) => sum + Math.max(1, Math.ceil(ids.length / PER_PAGE)), 0,
);
const groupFiles = Object.values(groupCounts).reduce((sum, m) => sum + groupPages(m), 0) * LOCALES;

const staticPerLocale =
  1 +                                   // locale home
  1 +                                   // blog index
  1 +                                   // categories index
  1 +                                   // glossary index
  1 +                                   // search
  6 +                                   // systems/about/editorial-policy/privacy/terms/accessibility
  tax('glossary').length;               // DefinedTerm entity pages

const breakdown = [
  ['article HTML', N],
  ['Markdown mirrors (.md)', N],
  ['blog pagination', Math.max(0, Math.ceil(N / PER_PAGE) - 1) * LOCALES],
  ['taxonomy archive pages', groupFiles],
  ['fixed locale/static pages', staticPerLocale * LOCALES],
  ['root index + 404', 2],
  ['llms.txt + llms-full parts', 2 + Math.max(1, Math.ceil(N / LLMS_CHUNK))],
  ['sitemap index + parts', 1 + Math.max(1, Math.ceil((sitemapUrls + 30) / SITEMAP_LIMIT))],
  ['feed / robots / search-index', 3],
  ['public assets + _headers', 3],
  ['safety margin (_astro chunks)', SAFETY_MARGIN],
];

const total = breakdown.reduce((sum, [, n]) => sum + n, 0);

/** Same formulas, projected onto a corpus of `n` articles. */
function estimateFor(n) {
  const scale = N > 0 ? n / N : 0;
  const scaledGroups = Object.values(groupCounts).reduce(
    (sum, map) => sum + Object.values(map).reduce(
      (s, ids) => s + Math.max(1, Math.ceil((ids.length * scale) / PER_PAGE)), 0,
    ), 0,
  ) * LOCALES;
  return (
    2 * n +
    Math.max(0, Math.ceil(n / PER_PAGE) - 1) * LOCALES +
    scaledGroups +
    staticPerLocale * LOCALES +
    2 +
    2 + Math.max(1, Math.ceil(n / LLMS_CHUNK)) +
    1 + Math.max(1, Math.ceil((n + 30) / SITEMAP_LIMIT)) +
    3 + 3 + SAFETY_MARGIN
  );
}

let lo = 0;
let hi = 400_000;
while (lo < hi) {
  const mid = Math.ceil((lo + hi) / 2);
  if (estimateFor(mid) <= BUDGET) lo = mid;
  else hi = mid - 1;
}
const capacity = lo;

console.log(`[budget] Cloudflare Pages static-file estimate (v1: ${LOCALES} locale)`);
for (const [label, count] of breakdown) {
  console.log(`  ${label.padEnd(34)} ${String(count).padStart(7)}`);
}
console.log(`  ${'TOTAL'.padEnd(34)} ${String(total).padStart(7)}  / budget ${BUDGET} (plan ${PLAN_LIMIT})`);
console.log(`[budget] ${N} published articles · estimated capacity ~${capacity} articles`);

if (BUDGET > PLAN_LIMIT) {
  console.error(`[budget] PUBLIC_STATIC_FILE_BUDGET=${BUDGET} exceeds the plan limit ${PLAN_LIMIT}.`);
  console.error('[budget] On the Free plan keep it <= 20000. On a paid plan set');
  console.error('[budget] PAGES_WRANGLER_MAJOR_VERSION=4 in CF project settings first.');
  process.exit(1);
}

if (total > BUDGET) {
  console.error(`\n[budget] OVER BUDGET by ${total - BUDGET} files. Cloudflare will reject the upload.`);
  console.error('[budget] Options, cheapest first:');
  console.error('  1. Remove the Markdown mirrors: delete src/pages/[lang]/raw/[slug].md.ts');
  console.error('     and set the mirror link to empty. Halves the per-article cost.');
  console.error('  2. Raise PER_PAGE (src/config/site.ts) to cut pagination pages.');
  console.error('  3. Raise PUBLIC_LLMS_CHUNK_SIZE to cut llms-full parts.');
  console.error('  4. Upgrade the plan and raise PUBLIC_STATIC_FILE_BUDGET + PUBLIC_PAGES_FILE_LIMIT.');
  console.error('  5. Migrate to route A (Workers + R2): see README "到量后的迁移".');
  console.error('\n[budget] Build intentionally aborted before `astro build`.');
  process.exit(1);
}

if (total > BUDGET * 0.85) {
  console.warn(`[budget] WARNING: ${Math.round((total / BUDGET) * 100)}% of the budget used. Plan the R2 migration now.`);
}
