import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  Article,
  ArticleCard,
  Manifest,
  ManifestEntry,
  SitemapEntry,
} from './types';

/**
 * Lazy article repository.
 *
 * Design rule for 100k+ articles: NEVER load the corpus into memory to render a
 * single page. Only the compact manifest (card-sized rows) is held in memory;
 * the full article is read from one shard on demand and kept in a small LRU.
 * Listings read precomputed inverted indexes from `scripts/ingest.mjs`.
 *
 * To move content into a CMS/DB, replace `readShard()` with a fetch and keep
 * every other function's signature unchanged.
 */

function resolveContentRoot(): string {
  const candidates: Array<string | undefined> = [
    process.env.GEARLENS_CONTENT_DIR,
    path.resolve(process.cwd(), 'content'),
    path.resolve(process.cwd(), 'dist', 'server', 'content'),
  ];
  try {
    candidates.push(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'content'));
    candidates.push(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'content'));
  } catch {
    // Non-file URLs (some bundlers) — the cwd candidates still apply.
  }
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(path.join(candidate, 'indexes', 'manifest.json'))) return candidate;
  }
  return path.resolve(process.cwd(), 'content');
}

const CONTENT_ROOT = resolveContentRoot();
const indexCache = new Map<string, unknown>();
const ARTICLE_CACHE_LIMIT = 256;
const articleCache = new Map<string, Article>();

function readJson<T>(relative: string): T {
  const cached = indexCache.get(relative);
  if (cached !== undefined) return cached as T;
  const file = path.join(CONTENT_ROOT, 'indexes', relative);
  const value = JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  indexCache.set(relative, value);
  return value;
}

function readShard(entry: ManifestEntry): Article | null {
  const cached = articleCache.get(entry.id);
  if (cached) {
    articleCache.delete(entry.id);
    articleCache.set(entry.id, cached);
    return cached;
  }
  const file = path.join(CONTENT_ROOT, entry.shard);
  if (!fs.existsSync(file)) return null;
  const article = JSON.parse(fs.readFileSync(file, 'utf8')) as Article;
  articleCache.set(entry.id, article);
  if (articleCache.size > ARTICLE_CACHE_LIMIT) {
    const oldest = articleCache.keys().next().value;
    if (oldest) articleCache.delete(oldest);
  }
  return article;
}

let manifestCache: Manifest | undefined;
let cardMapCache: Map<string, ManifestEntry> | undefined;
let pathMapCache: Record<string, string> | undefined;

export function getManifest(): Manifest {
  if (!manifestCache) manifestCache = readJson<Manifest>('manifest.json');
  return manifestCache;
}

export function getCardMap(): Map<string, ManifestEntry> {
  if (!cardMapCache) cardMapCache = new Map(getManifest().articles.map((a) => [a.id, a]));
  return cardMapCache;
}

export function getPathMap(): Record<string, string> {
  if (!pathMapCache) {
    const raw = readJson<Record<string, string>>('paths.json');
    // Public URLs carry a trailing slash; lookups are normalized to the
    // slash-free form so both `/en/blog/foo` and `/en/blog/foo/` resolve.
    pathMapCache = Object.fromEntries(
      Object.entries(raw).map(([p, id]) => [normalizeArticlePath(p), id]),
    );
  }
  return pathMapCache;
}

export function getStats() {
  return readJson<Record<string, unknown>>('stats.json');
}

export function getIndex<T = string[]>(name: string): T {
  return readJson<T>(`${name}.json`);
}

export function getCards(ids: string[]): ArticleCard[] {
  const map = getCardMap();
  return ids.map((id) => map.get(id)).filter((c): c is ManifestEntry => Boolean(c));
}

export function getCard(id: string): ArticleCard | undefined {
  return getCardMap().get(id);
}

export function getEntry(id: string): ManifestEntry | undefined {
  return getCardMap().get(id);
}

export function getArticle(id: string): Article | null {
  const entry = getCardMap().get(id);
  return entry ? readShard(entry) : null;
}

/** Normalizes `/en/blog/foo/`, `/en/blog/foo.md`, and stray query strings. */
export function normalizeArticlePath(pathname: string): string {
  return decodeURIComponent(pathname)
    .split('?')[0]
    .split('#')[0]
    .replace(/\.html$/i, '')
    .replace(/\.md$/i, '')
    .replace(/\/+$/, '') || '/';
}

export function getArticleByPath(pathname: string): Article | null {
  const clean = normalizeArticlePath(pathname);
  const id = getPathMap()[clean];
  if (id) return getArticle(id);
  // Drafts / noindex articles are not in paths.json but may be previewed directly.
  const fallback = getManifest().articles.find((a) => normalizeArticlePath(a.path) === clean);
  return fallback ? readShard(fallback) : null;
}

export function getSitemapEntries(): SitemapEntry[] {
  return readJson<SitemapEntry[]>('sitemap.json');
}

export function getSearchDocs(): Array<{ t: string; d: string; u: string; g: string[]; c: string }> {
  return readJson<Array<{ t: string; d: string; u: string; g: string[]; c: string }>>('search.json');
}

export interface ListingResult {
  ids: string[];
  cards: ArticleCard[];
  total: number;
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/** O(pageSize) listing, even with a 100k-entry index. */
export function paginateIds(ids: string[], page: number, perPage: number): ListingResult {
  const total = ids.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const slice = ids.slice((safePage - 1) * perPage, safePage * perPage);
  return {
    ids: slice,
    cards: getCards(slice),
    total,
    page: safePage,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

export function listByDate(page: number, perPage: number): ListingResult {
  return paginateIds(getIndex<string[]>('by-date'), page, perPage);
}

export function listByGroup(
  group: 'by-category' | 'by-tag' | 'by-author' | 'by-series' | 'priority',
  key: string,
  page: number,
  perPage: number,
): ListingResult {
  const data = getIndex<Record<string, string[]>>(group);
  const ids = key ? data[key] ?? [] : Object.values(data).flat();
  return paginateIds(ids, page, perPage);
}

export function getRelatedCards(article: Article): ArticleCard[] {
  const related = article.related ?? getIndex<Record<string, string[]>>('related')[article.id] ?? [];
  return getCards(related);
}

export function getGroupCounts(group: 'by-category' | 'by-tag' | 'by-author' | 'by-series'): Record<string, number> {
  const data = getIndex<Record<string, string[]>>(group);
  return Object.fromEntries(Object.entries(data).map(([key, ids]) => [key, ids.length]));
}

/** All published paths, used only by sitemap/llms endpoints (never by a page). */
export function getAllPublishedEntries(): ManifestEntry[] {
  return getManifest().articles.filter((a) => a.status === 'published' && !a.noindex);
}
