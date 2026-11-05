#!/usr/bin/env node
/**
 * Content pipeline: Markdown under content/source  →  shards + indexes under content
 *
 * Why this exists
 * ---------------
 * With 100k+ articles, letting the site build parse 100k Markdown files on every
 * deploy is the bottleneck. This script runs once per content change (locally or
 * in CI) and produces:
 *   - precompiled, sanitized HTML shards (the renderer just injects HTML)
 *   - precomputed derived indexes (listings, related posts, sitemap, priority)
 * so Astro pages never call getCollection() over the whole corpus and never do
 * O(n^2) related-post work at request time.
 *
 * Shards are written incrementally: an unchanged source file is not rewritten.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

// `import.meta.dirname` needs Node 20.11+ and JSON import attributes need
// Node 22+. Cloudflare Pages build images may default to an older Node, so use
// only APIs that work from Node 18 onwards.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = path.join(ROOT, 'content', 'source');
const SHARDS = path.join(ROOT, 'content', 'shards');
const INDEXES = path.join(ROOT, 'content', 'indexes');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const categories = readJson(path.join(ROOT, 'content', 'taxonomy', 'categories.json'));
const glossary = readJson(path.join(ROOT, 'content', 'taxonomy', 'glossary.json'));
const DEFAULT_LANG = 'en';
// Hard cap on the portable search corpus; the endpoint slices this further
// using PUBLIC_SEARCH_INDEX_LIMIT at render time.
const SEARCH_DOCS_CAP = 2000;
// Bump whenever URL policy, shortcode resolution or Markdown rendering changes.
// It is part of sourceHash so incremental ingest cannot keep stale shards that
// contain old internal links or an old `path`.
const PIPELINE_VERSION = '2-static-trailing-slash';

fs.mkdirSync(SHARDS, { recursive: true });
fs.mkdirSync(INDEXES, { recursive: true });

const hash = (value) => crypto.createHash('sha1').update(value).digest('hex');
const slugify = (value) =>
  String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toIso = (value, fallback) => {
  if (!value) return fallback;
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString();
};

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.mdx?$/i.test(entry.name) ? [full] : [];
  });
}

/** Markdown → sanitized HTML + heading outline. Deliberately allows a small,
 *  content-safe tag set so the ingest step is the only place that parses HTML. */
function renderMarkdown(md) {
  const raw = marked.parse(md, { gfm: true, breaks: false, async: false });
  const clean = sanitizeHtml(raw, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody',
      'tfoot', 'tr', 'th', 'td', 'figure', 'figcaption', 'sup', 'sub', 'del',
      'hr', 'dl', 'dt', 'dd', 'span',
    ],
    allowedAttributes: {
      '*': ['id', 'class', 'title', 'aria-label', 'data-footnote'],
      a: ['href', 'name', 'target', 'rel', 'title', 'id', 'class'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding', 'title'],
      th: ['align', 'scope', 'colspan', 'rowspan'],
      td: ['align', 'colspan', 'rowspan'],
      code: ['class'],
      pre: ['class'],
      ol: ['start', 'type'],
      li: ['value'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tag, attribs) => {
        const next = { ...attribs };
        if (next.href && /^https?:\/\//i.test(next.href)) {
          next.rel = 'noopener noreferrer';
          next.target = '_blank';
        }
        return { tagName: tag, attribs: next };
      },
      img: (tag, attribs) => ({
        tagName: tag,
        attribs: { loading: 'lazy', decoding: 'async', ...attribs },
      }),
    },
  });

  const headings = [];
  const used = new Set();
  const withIds = clean.replace(/<h([234])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    let id = slugify(text) || `section-${headings.length + 1}`;
    let n = 2;
    while (used.has(id)) id = `${slugify(text)}-${n++}`;
    used.add(id);
    headings.push({ depth: Number(level), text, id });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: withIds, headings };
}

function list(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean).map(String) : [String(value)];
}

function normalizeFm(fm, file) {
  const slug = String(fm.slug || path.basename(file, path.extname(file))).replace(/^\/+|\/+$/g, '');
  const lang = String(fm.lang || DEFAULT_LANG);
  const publishedAt = toIso(fm.publishedAt, toIso(fm.date, new Date('2026-01-01T00:00:00Z')));
  const updatedAt = toIso(fm.updatedAt, publishedAt);
  const category = String(fm.category || 'guides');
  return {
    slug,
    lang,
    id: `${lang}/${slug}`,
    // Trailing slash matches Cloudflare Pages directory-index serving and the
    // canonical tags emitted by `localePath()`. Never change one without the other.
    path: `/${lang}/blog/${slug}/`,
    translationGroup: String(fm.translationGroup || slug),
    translations: fm.translations && typeof fm.translations === 'object' ? fm.translations : {},
    title: String(fm.title || slug),
    description: String(fm.description || ''),
    category,
    tags: list(fm.tags).map(slugify),
    series: fm.series ? slugify(fm.series) : undefined,
    author: String(fm.author || 'maya-chen'),
    reviewer: fm.reviewer ? String(fm.reviewer) : undefined,
    publishedAt,
    updatedAt,
    reviewedAt: toIso(fm.reviewedAt, undefined),
    status: fm.status === 'draft' ? 'draft' : 'published',
    noindex: Boolean(fm.noindex || fm.fallbackOf),
    fallbackOf: fm.fallbackOf ? String(fm.fallbackOf) : undefined,
    pillar: Boolean(fm.pillar),
    priority: Number.isFinite(Number(fm.priority)) ? Number(fm.priority) : 0,
    heroImage: fm.heroImage ? String(fm.heroImage) : undefined,
    heroAlt: fm.heroAlt ? String(fm.heroAlt) : undefined,
    ogImage: fm.ogImage ? String(fm.ogImage) : undefined,
    answer: String(fm.answer || ''),
    keyTakeaways: list(fm.keyTakeaways),
    faq: Array.isArray(fm.faq)
      ? fm.faq.map((x) => ({ q: String(x.q || ''), a: String(x.a || '') })).filter((x) => x.q && x.a)
      : [],
    howTo: fm.howTo?.steps
      ? {
          name: String(fm.howTo.name || ''),
          description: fm.howTo.description ? String(fm.howTo.description) : undefined,
          totalTime: fm.howTo.totalTime ? String(fm.howTo.totalTime) : undefined,
          steps: fm.howTo.steps.map((s) => ({ name: String(s.name || ''), text: String(s.text || ''), image: s.image ? String(s.image) : undefined })),
        }
      : undefined,
    sources: Array.isArray(fm.sources)
      ? fm.sources.map((s) => ({ title: String(s.title || s.url || ''), url: String(s.url || ''), publisher: s.publisher ? String(s.publisher) : undefined, date: s.date ? String(s.date) : undefined }))
      : [],
    entities: list(fm.entities),
    claimReviewed: fm.claimReviewed ? String(fm.claimReviewed) : undefined,
    breadcrumbLabel: fm.breadcrumbLabel ? String(fm.breadcrumbLabel) : undefined,
  };
}

// ---------------------------------------------------------------- pass 1: read
const files = walk(SOURCE).sort();
if (files.length === 0) {
  console.error('[ingest] No Markdown found under content/source/. Nothing to build.');
  process.exit(1);
}

const parsed = files.map((file) => {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { file, raw, body: content, meta: normalizeFm(data, file) };
});

const bySlug = new Map(parsed.map((p) => [`${p.meta.lang}:${p.meta.slug}`, p.meta]));

// ------------------------------------------- precomputed internal link resolution
function resolveShortcodes(md, lang) {
  let out = md.replace(/\{\{article:([a-z0-9/-]+)(?:\|([^}]+))?\}\}/gi, (match, slug, anchor) => {
    const target = bySlug.get(`${lang}:${slug}`) || bySlug.get(`${DEFAULT_LANG}:${slug}`);
    if (!target) {
      console.warn(`[ingest] unresolved article shortcode: ${slug}`);
      return match;
    }
    return `[${anchor || target.title}](${target.path})`;
  });
  out = out.replace(/\{\{glossary:([a-z0-9-]+)(?:\|([^}]+))?\}\}/gi, (match, slug, anchor) => {
    const term = glossary.find((g) => g.slug === slug);
    if (!term) return match;
    return `[${anchor || term.term}](/${lang}/glossary/${term.slug}/)`;
  });
  return out;
}

// ------------------------------------------------------------- pass 2: compile
const oldManifestPath = path.join(INDEXES, 'manifest.json');
const oldHashes = new Map();
if (fs.existsSync(oldManifestPath)) {
  try {
    for (const a of JSON.parse(fs.readFileSync(oldManifestPath, 'utf8')).articles) {
      if (a.sourceHash) oldHashes.set(a.id, a.sourceHash);
    }
  } catch { /* ignore a corrupt cache */ }
}

const articles = [];
const cards = new Map();
let written = 0;
let reused = 0;

for (const item of parsed) {
  const m = item.meta;
  const sourceHash = hash(`${PIPELINE_VERSION}\n${item.raw}`);
  const shardName = hash(m.id).slice(0, 2);
  const shardRel = `shards/${shardName}/${m.lang}__${m.slug.replace(/[^a-z0-9-]/gi, '-')}.json`;
  const shardAbs = path.join(ROOT, 'content', shardRel);
  fs.mkdirSync(path.dirname(shardAbs), { recursive: true });

  const md = resolveShortcodes(item.body, m.lang);
  const { html, headings } = renderMarkdown(md);
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plain ? plain.split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 230));

  const card = {
    id: m.id,
    lang: m.lang,
    slug: m.slug,
    path: m.path,
    title: m.title,
    description: m.description,
    category: m.category,
    tags: m.tags,
    series: m.series,
    author: m.author,
    publishedAt: m.publishedAt,
    updatedAt: m.updatedAt,
    readingMinutes,
    wordCount,
    heroImage: m.heroImage,
    heroAlt: m.heroAlt,
    pillar: m.pillar,
    priority: m.priority,
  };
  cards.set(m.id, card);

  const full = {
    ...m,
    ...card,
    sourceHash,
    bodyHtml: html,
    bodyMarkdown: md.trim(),
    headings,
    related: [],
  };

  if (oldHashes.get(m.id) === sourceHash && fs.existsSync(shardAbs)) {
    reused++;
  } else {
    fs.writeFileSync(shardAbs, JSON.stringify(full), 'utf8');
    written++;
  }
  articles.push({ ...card, shard: shardRel, status: m.status, noindex: m.noindex, translationGroup: m.translationGroup, sourceHash });
}

// ------------------------------------------------------- pass 3: derived indexes
const published = articles.filter((a) => a.status === 'published' && !a.noindex);
const byDate = [...published].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map((a) => a.id);
const byPriority = [...published].sort((a, b) => b.priority - a.priority || b.updatedAt.localeCompare(a.updatedAt)).map((a) => a.id);

function groupIndex(keyFn) {
  const out = {};
  for (const a of published) {
    for (const key of keyFn(a)) (out[key] ||= []).push(a.id);
  }
  for (const key of Object.keys(out)) {
    out[key].sort((x, y) => cards.get(y).publishedAt.localeCompare(cards.get(x).publishedAt));
  }
  return out;
}

const byCategory = groupIndex((a) => [a.category]);
const byTag = groupIndex((a) => a.tags);
const byAuthor = groupIndex((a) => [a.author]);
const bySeries = groupIndex((a) => (a.series ? [a.series] : []));

// Related posts: inverted tag index, so this is O(n * avg tags), not O(n^2).
const tagInverted = {};
for (const a of published) for (const tag of a.tags) (tagInverted[tag] ||= []).push(a.id);
const related = {};
for (const a of published) {
  const score = new Map();
  for (const tag of a.tags) {
    for (const id of tagInverted[tag] || []) {
      if (id !== a.id) score.set(id, (score.get(id) || 0) + 3);
    }
  }
  for (const id of byCategory[a.category] || []) {
    if (id !== a.id) score.set(id, (score.get(id) || 0) + 2);
  }
  if (a.series) for (const id of bySeries[a.series] || []) {
    if (id !== a.id) score.set(id, (score.get(id) || 0) + 1);
  }
  const ranked = [...score.entries()].sort((x, y) => y[1] - x[1] || byDate.indexOf(x[0]) - byDate.indexOf(y[0])).slice(0, 6).map(([id]) => id);
  for (const id of byDate) {
    if (ranked.length >= 6) break;
    if (id !== a.id && !ranked.includes(id)) ranked.push(id);
  }
  related[a.id] = ranked;
  const shard = path.join(ROOT, 'content', a.shard);
  if (fs.existsSync(shard)) {
    const doc = JSON.parse(fs.readFileSync(shard, 'utf8'));
    doc.related = ranked;
    fs.writeFileSync(shard, JSON.stringify(doc), 'utf8');
  }
}

// Sitemap rows stay domain-agnostic: the content pipeline must not need to know
// the deployment URL. `src/lib/sitemap.ts` resolves them to absolute URLs at
// render time, so staging and production can share one content snapshot.
const translationsById = new Map(parsed.map((p) => [p.meta.id, p.meta.translations || {}]));
const sitemap = published.map((a) => {
  const alternates = Object.entries(translationsById.get(a.id) || {})
    .map(([lang, slug]) => ({ hreflang: lang, href: `/${lang}/blog/${slug}/` }));
  alternates.unshift({ hreflang: a.lang, href: a.path });
  return { loc: a.path, lastmod: a.updatedAt.slice(0, 10), alternates };
});

const byUpdated = [...published].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((a) => a.id);
const paths = Object.fromEntries(published.map((a) => [a.path, a.id]));
const searchDocs = byPriority.slice(0, SEARCH_DOCS_CAP).map((id) => {
  const c = cards.get(id);
  return { t: c.title, d: c.description, u: c.path, g: c.tags, c: c.category };
});

const stats = {
  generatedAt: new Date().toISOString(),
  total: articles.length,
  published: published.length,
  drafts: articles.length - published.length,
  words: published.reduce((sum, a) => sum + a.wordCount, 0),
  languages: [...new Set(articles.map((a) => a.lang))],
  categories: Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [k, v.length])),
  shardsWritten: written,
  shardsReused: reused,
};

const write = (name, data) => fs.writeFileSync(path.join(INDEXES, name), JSON.stringify(data), 'utf8');
write('manifest.json', { generatedAt: stats.generatedAt, total: articles.length, locales: stats.languages, articles });
write('by-date.json', byDate);
write('by-updated.json', byUpdated);
write('by-category.json', byCategory);
write('by-tag.json', byTag);
write('by-author.json', byAuthor);
write('by-series.json', bySeries);
write('priority.json', byPriority);
write('related.json', related);
write('paths.json', paths);
write('sitemap.json', sitemap);
write('search.json', searchDocs);
write('stats.json', stats);

// Fail loudly on taxonomy drift rather than silently producing empty category pages.
const unknown = [...new Set(articles.map((a) => a.category))].filter((c) => !categories.some((x) => x.slug === c));
if (unknown.length) console.warn(`[ingest] categories missing from taxonomy/categories.json: ${unknown.join(', ')}`);

console.log(
  `[ingest] ${articles.length} articles (${published.length} published) · ${written} shards written, ${reused} reused · ${Object.keys(byCategory).length} categories`,
);
