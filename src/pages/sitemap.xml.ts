import type { APIRoute } from 'astro';
import { sitemapIndexXml } from '../lib/sitemap';

/** Sitemap index. With 100k+ URLs the actual URLs live in `/sitemap-N.xml`. */
export const GET: APIRoute = () => new Response(sitemapIndexXml(), {
  headers: {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  },
});
