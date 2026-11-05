import { SITE, absoluteUrl } from '../config/site';
import { DEFAULT_LOCALE, ENABLED_LOCALES, blogPath, getLocaleConfig, localePath } from '../i18n';
import type { Article, ArticleCard } from './types';

export interface AlternateLink {
  hreflang: string;
  href: string;
}

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * hreflang only for REAL translations. A locale page that merely falls back to
 * English content must not be advertised as a translated URL: that is a classic
 * international-SEO duplicate-content bug. `x-default` always points at the
 * default-locale version (or the original article when none exists).
 */
export function articleAlternates(article: Article): AlternateLink[] {
  if (article.fallbackOf) return [];

  const map = new Map<string, string>();
  map.set(getLocaleConfig(article.lang).hreflang, absoluteUrl(article.path));
  for (const [lang, slug] of Object.entries(article.translations ?? {})) {
    if (!slug || lang === article.lang) continue;
    map.set(getLocaleConfig(lang).hreflang, absoluteUrl(blogPath(lang, slug)));
  }

  const englishSlug = article.lang === DEFAULT_LOCALE ? article.slug : article.translations?.[DEFAULT_LOCALE];
  const xDefault = englishSlug
    ? absoluteUrl(blogPath(DEFAULT_LOCALE, englishSlug))
    : absoluteUrl(article.path);

  return [
    ...[...map].map(([hreflang, href]) => ({ hreflang, href })),
    { hreflang: 'x-default', href: xDefault },
  ];
}

/** Same-path alternates for non-article pages (UI is localized, body may not be). */
export function pageAlternates(_lang: string, ...segments: Array<string | number | undefined>): AlternateLink[] {
  const links: AlternateLink[] = ENABLED_LOCALES.map((l) => ({
    hreflang: l.hreflang,
    href: absoluteUrl(localePath(l.code, ...segments)),
  }));
  links.push({ hreflang: 'x-default', href: absoluteUrl(localePath(DEFAULT_LOCALE, ...segments)) });
  return links;
}

export function canonical(pathname: string): string {
  return absoluteUrl(pathname);
}

/**
 * A fallback translation is indexable only if it has genuine translated content.
 * Otherwise: canonical → source article, robots → noindex,follow, no hreflang.
 */
export function articleSeoUrls(article: Article) {
  const fallbackSource = article.fallbackOf;
  return {
    canonical: fallbackSource ? absoluteUrl(fallbackSource) : canonical(article.path),
    alternates: articleAlternates(article),
    robots: article.noindex
      ? 'noindex, follow, max-image-preview:large'
      : fallbackSource
        ? 'noindex, follow, max-image-preview:large'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    isFallback: Boolean(fallbackSource),
  };
}

export function articleBreadcrumbs(lang: string, article: Article, categoryName: string): Crumb[] {
  return [
    { label: 'Home', href: localePath(lang) },
    { label: 'Blog', href: localePath(lang, 'blog') },
    { label: categoryName, href: localePath(lang, 'categories', article.category) },
    { label: article.breadcrumbLabel ?? article.title },
  ];
}

export function cardUrl(card: ArticleCard): string {
  return card.path;
}

export function siteOrigin(): string {
  return SITE.url;
}
