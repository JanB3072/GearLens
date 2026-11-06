import { LIMITS, SITE, absoluteUrl } from '../config/site';
import { ENABLED_LOCALES, LOCALES, localePath } from '../i18n';
import { pageAlternates } from './links';
import { getAllPublishedEntries, getSitemapEntries, getStats } from './repository';
import { authors, categories, glossary, series } from './taxonomy';
import { STATIC_PAGES } from '../config/static-pages';
import type { SitemapEntry } from './types';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * One flat, deterministic URL list. Search engines allow up to 50,000 URLs per
 * sitemap file, so a 100k-article site needs a sitemap index + N shards.
 * `sitemap.xml.ts` and `sitemap-[part].xml.ts` both consume this function so
 * the index and the shards can never disagree.
 */
export function sitemapUrls(): SitemapEntry[] {
  const date = today();
  const staticUrls: SitemapEntry[] = [
    { loc: `${SITE.url}/`, lastmod: date, alternates: [{ hreflang: 'x-default', href: `${SITE.url}/` }] },
  ];

  for (const locale of ENABLED_LOCALES) {
    const L = locale.code;
    const add = (...segments: Array<string | number | undefined>) => staticUrls.push({
      loc: absoluteUrl(localePath(L, ...segments)),
      lastmod: date,
      alternates: pageAlternates(L, ...segments),
    });

    add();
    add('blog');
    add('categories');
    add('glossary');
    for (const c of categories) add('categories', c.slug);
    for (const s of series) add('series', s.slug);
    for (const a of authors) add('authors', a.slug);
    for (const g of glossary) add('glossary', g.slug);
    for (const page of Object.keys(STATIC_PAGES)) add(page);
  }

  // `sitemap.json` holds domain-agnostic relative paths so one content snapshot
  // can be deployed to staging and production without re-ingesting.
  const articles = getSitemapEntries().map((entry) => ({
    loc: absoluteUrl(entry.loc),
    lastmod: entry.lastmod,
    alternates: (entry.alternates ?? []).map((a) => ({
      hreflang: a.hreflang,
      href: absoluteUrl(a.href),
    })),
  }));
  return [...staticUrls, ...articles];
}

export function sitemapParts(): SitemapEntry[][] {
  const urls = sitemapUrls();
  const size = Math.max(1, Math.min(50_000, LIMITS.sitemapUrlsPerFile || 45_000));
  const parts: SitemapEntry[][] = [];
  for (let i = 0; i < urls.length; i += size) parts.push(urls.slice(i, i + size));
  return parts.length ? parts : [[]];
}

export function sitemapPartCount(): number {
  return sitemapParts().length;
}

export function sitemapIndexXml(): string {
  const stats = getStats() as { generatedAt?: string };
  const lastmod = (stats.generatedAt ?? new Date().toISOString()).slice(0, 10);
  const body = sitemapParts()
    .map((_, i) => `  <sitemap><loc>${escapeXml(`${SITE.url}/sitemap-${i}.xml`)}</loc><lastmod>${lastmod}</lastmod></sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export function sitemapPartXml(part: number): string {
  const parts = sitemapParts();
  const urls = parts[part];
  if (!urls) return '';
  const body = urls.map((entry) => {
    const alternates = (entry.alternates ?? [])
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}" />`)
      .join('\n');
    return [
      '  <url>',
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : '',
      `    <changefreq>${entry.loc.includes('/blog/') ? 'monthly' : 'weekly'}</changefreq>`,
      alternates,
      '  </url>',
    ].filter(Boolean).join('\n');
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;
}

/** Used by `sitemap.xml.ts` only for logging / diagnostics. */
export function sitemapSummary() {
  return {
    shards: sitemapPartCount(),
    urls: sitemapUrls().length,
    articles: getAllPublishedEntries().length,
    enabledLocales: LOCALES.filter((l) => l.enabled).map((l) => l.code),
  };
}
