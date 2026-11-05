import { PAGINATION } from '../config/site';
import { isEnabledLocale, localeStaticParams } from '../i18n';
import { getAllPublishedEntries, getGroupCounts, getIndex } from './repository';

/**
 * Single source of truth for every `getStaticPaths()` in the site.
 * `scripts/check-static-budget.mjs` mirrors these formulas so the Free-plan
 * file-count guard cannot drift from what Astro actually emits.
 *
 * IMPORTANT: `getStaticPaths()` runs in an isolated module scope in Astro, so
 * everything it needs must come from imports — never from page frontmatter.
 */

export function articleStaticPaths() {
  return getAllPublishedEntries()
    .filter((entry) => isEnabledLocale(entry.lang))
    .map((entry) => ({
      params: { lang: entry.lang, slug: entry.slug },
      props: { id: entry.id },
    }));
}

export function markdownStaticPaths() {
  return getAllPublishedEntries()
    .filter((entry) => isEnabledLocale(entry.lang))
    .map((entry) => ({
      params: { lang: entry.lang, slug: entry.slug },
    }));
}

/** Page 1 lives at `/<lang>/blog/`; only pages 2..N are emitted here. */
export function blogPaginationStaticPaths() {
  const total = getIndex<string[]>('by-date').length;
  const totalPages = Math.max(1, Math.ceil(total / PAGINATION.articlesPerPage));
  const pages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2);
  return localeStaticParams().flatMap(({ params }) =>
    pages.map((page) => ({ params: { ...params, page: String(page) } })),
  );
}

export function groupPageCount(count: number): number {
  return Math.max(1, Math.ceil(count / PAGINATION.articlesPerPage));
}

/** One path per taxonomy key and per page: `key` and `key/page/2`. */
export function groupStaticPaths(group: 'by-category' | 'by-tag' | 'by-author' | 'by-series') {
  const counts = getGroupCounts(group);
  return localeStaticParams().flatMap(({ params }) =>
    Object.entries(counts).flatMap(([key, count]) =>
      Array.from({ length: groupPageCount(count) }, (_, i) => ({
        params: { ...params, slug: i === 0 ? key : `${key}/page/${i + 1}` },
      })),
    ),
  );
}

/** How many HTML files the group routes emit across all locales. */
export function groupFileCount(group: 'by-category' | 'by-tag' | 'by-author' | 'by-series'): number {
  const counts = getGroupCounts(group);
  return Object.values(counts).reduce((sum, count) => sum + groupPageCount(count), 0);
}
