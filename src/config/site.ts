/**
 * Single source of truth for site-level constants.
 * `import.meta.env.SITE` is injected by Astro from `site` in astro.config.mjs,
 * so canonical / sitemap / JSON-LD can never drift apart.
 */
const RAW_SITE_URL = (import.meta.env.SITE as string | undefined) ?? 'https://soundandroom.example.com';

export const SITE = {
  url: RAW_SITE_URL.replace(/\/$/, ''),
  name: 'SoundAndRoom',
  shortName: 'SoundAndRoom',
  tagline: 'High-end audio, home theater and Hi-Fi, planned as a system',
  description:
    'Independent, measurement-led guides to high-end home audio, home theater, Hi-Fi loudspeakers and complete AV system building.',
  // Replace with the real legal entity before launch.
  organization: 'SoundAndRoom Media',
  foundedYear: 2026,
  email: 'editorial@soundandroom.example.com',
  logo: '/logo.png',
  defaultOgImage: '/assets/og-default.svg',
  twitter: '@soundandroom',
  language: 'en',
} as const;

export const PAGINATION = {
  articlesPerPage: 12,
  // Only the first N listing pages are ever emitted as static HTML.
  // Everything deeper is rendered on demand: no 10_000-page build.
  prerenderedPages: 0,
  maxPage: 100_000,
} as const;

export const LIMITS = {
  sitemapUrlsPerFile: Number(import.meta.env.PUBLIC_SITEMAP_URL_LIMIT ?? 45_000),
  searchIndexDocs: Number(import.meta.env.PUBLIC_SEARCH_INDEX_LIMIT ?? 500),
  llmsFullArticles: 100,
  rssItems: 50,
} as const;

/** AI / answer-engine crawlers we explicitly allow and want to serve. */
export const AI_CRAWLERS = [
  { name: 'GPTBot', note: 'OpenAI training crawler' },
  { name: 'OAI-SearchBot', note: 'ChatGPT search' },
  { name: 'ChatGPT-User', note: 'ChatGPT browsing' },
  { name: 'ClaudeBot', note: 'Anthropic crawler' },
  { name: 'Claude-Web', note: 'Claude browsing' },
  { name: 'PerplexityBot', note: 'Perplexity index' },
  { name: 'Google-Extended', note: 'Gemini / AI Overviews grounding' },
  { name: 'Bingbot', note: 'Copilot grounding' },
  { name: 'Applebot-Extended', note: 'Apple Intelligence' },
  { name: 'CCBot', note: 'Common Crawl (feeds many LLMs)' },
  { name: 'cohere-ai', note: 'Cohere' },
  { name: 'Bytespider', note: 'Doubao / ByteDance' },
] as const;

export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  return `${SITE.url}/${String(pathname).replace(/^\/+/, '')}`;
}
