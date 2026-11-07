import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// astro.config.mjs is evaluated BEFORE Vite loads .env files, so read them
// explicitly. Canonical / sitemap / JSON-LD then follow .env in every mode.
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const SITE_URL = env.PUBLIC_SITE_URL || 'https://soundandroom.example.com';

/**
 * Deploy mode: `static` (default) targets git -> Cloudflare Pages.
 *
 * No adapter, no server bundle, no runtime filesystem access: every page and
 * endpoint is emitted into `dist/`, which is exactly what CF Pages uploads.
 * `scripts/check-static-budget.mjs` enforces the Free-plan 20,000-file ceiling
 * before `astro build` runs.
 *
 * All URLs carry a trailing slash and HTML is written as `<path>/index.html`,
 * so Cloudflare's directory-index behaviour and our canonical tags agree.
 */
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'viewport' },
  scopedStyleStrategy: 'where',
  vite: {
    build: { chunkSizeWarningLimit: 1500 },
  },
});
