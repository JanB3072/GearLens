import { SITE } from '../config/site';
import { DEFAULT_LOCALE, ENABLED_LOCALE_CODES, getLocaleConfig } from './locales';
import { en, type UiKey } from './ui/en';
import { de } from './ui/de';

const dictionaries: Record<string, Partial<Record<UiKey, string>>> = { en, de };

export type { UiKey } from './ui/en';
export { DEFAULT_LOCALE, ENABLED_LOCALES, ENABLED_LOCALE_CODES, LOCALES, getLocaleConfig, localeStaticParams, isEnabledLocale } from './locales';

/** Translation with automatic fallback to the default locale. */
export function t(lang: string, key: UiKey): string {
  return dictionaries[lang]?.[key] ?? dictionaries[DEFAULT_LOCALE]?.[key] ?? en[key] ?? key;
}

export function normalizeLocale(value: string | undefined): string {
  if (!value) return DEFAULT_LOCALE;
  const code = value.toLowerCase().split('-')[0];
  return ENABLED_LOCALE_CODES.includes(code) ? code : DEFAULT_LOCALE;
}

/**
 * Every page URL ends with `/`. Cloudflare Pages serves directory-format
 * output (`<path>/index.html`) at the slash URL, so canonical, sitemap,
 * hreflang and internal links all agree with what the host actually returns.
 * Root-level endpoints (`/robots.txt`, `/sitemap.xml`, `/llms.txt`) are not
 * built with this helper and keep their extensions.
 */
export function localePath(lang: string, ...segments: Array<string | number | undefined | null>): string {
  const clean = segments
    .filter((s): s is string | number => s !== undefined && s !== null && s !== '')
    .map((s) => String(s).replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

export function blogPath(lang: string, slug: string): string {
  return localePath(lang, 'blog', slug);
}

export function categoryPath(lang: string, slug: string): string {
  return localePath(lang, 'categories', slug);
}

export function tagPath(lang: string, slug: string): string {
  return localePath(lang, 'tags', slug);
}

export function authorPath(lang: string, slug: string): string {
  return localePath(lang, 'authors', slug);
}

export function glossaryPath(lang: string, slug: string): string {
  return localePath(lang, 'glossary', slug);
}

/**
 * Markdown mirror. A real `.md` static asset (not `/slug/index.html`) so
 * Cloudflare serves it with a Markdown MIME type and LLM crawlers get plain
 * text instead of an HTML wrapper.
 */
export function rawPath(lang: string, slug: string): string {
  return `/${lang}/raw/${slug}.md`;
}

export function absoluteLocaleUrl(lang: string, ...segments: Array<string | number | undefined | null>): string {
  const p = localePath(lang, ...segments);
  return p === `/${lang}` ? `${SITE.url}${p}` : `${SITE.url}${p}`;
}

export function formatDate(iso: string | undefined, lang = DEFAULT_LOCALE): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(getLocaleConfig(lang).hreflang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
