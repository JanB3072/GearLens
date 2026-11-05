/**
 * Locale registry. v1 ships English only, but every layer (routing, hreflang,
 * sitemap alternates, JSON-LD inLanguage, dictionaries, locale switcher) is
 * already locale-aware. Flipping `enabled` on a locale is enough to start
 * generating `/de/...` etc. once translated content exists.
 */
export interface LocaleConfig {
  code: string;
  /** BCP-47 tag used in hreflang, OpenGraph and Intl APIs. */
  hreflang: string;
  ogLocale: string;
  label: string;
  nativeName: string;
  region: string;
  dir: 'ltr' | 'rtl';
  enabled: boolean;
}

export const LOCALES: LocaleConfig[] = [
  { code: 'en', hreflang: 'en-US', ogLocale: 'en_US', label: 'English', nativeName: 'English', region: 'Global', dir: 'ltr', enabled: true },
  { code: 'de', hreflang: 'de-DE', ogLocale: 'de_DE', label: 'German', nativeName: 'Deutsch', region: 'Europe', dir: 'ltr', enabled: false },
  { code: 'fr', hreflang: 'fr-FR', ogLocale: 'fr_FR', label: 'French', nativeName: 'Français', region: 'Europe', dir: 'ltr', enabled: false },
  { code: 'es', hreflang: 'es-ES', ogLocale: 'es_ES', label: 'Spanish', nativeName: 'Español', region: 'Americas / Europe', dir: 'ltr', enabled: false },
  { code: 'ja', hreflang: 'ja-JP', ogLocale: 'ja_JP', label: 'Japanese', nativeName: '日本語', region: 'Asia Pacific', dir: 'ltr', enabled: false },
  { code: 'zh', hreflang: 'zh-CN', ogLocale: 'zh_CN', label: 'Chinese', nativeName: '简体中文', region: 'Asia Pacific', dir: 'ltr', enabled: false },
  { code: 'ar', hreflang: 'ar-AE', ogLocale: 'ar_AE', label: 'Arabic', nativeName: 'العربية', region: 'MENA', dir: 'rtl', enabled: false },
];

export const DEFAULT_LOCALE = 'en';
export const ENABLED_LOCALES = LOCALES.filter((l) => l.enabled);
export const ENABLED_LOCALE_CODES = ENABLED_LOCALES.map((l) => l.code);
export const ALL_LOCALE_CODES = LOCALES.map((l) => l.code);

export function getLocaleConfig(code: string): LocaleConfig {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function isEnabledLocale(code: string | undefined): boolean {
  return !!code && ENABLED_LOCALE_CODES.includes(code);
}

/** Locales Astro should build `[lang]` routes for. */
export function localeStaticParams() {
  return ENABLED_LOCALES.map((l) => ({ params: { lang: l.code } }));
}
