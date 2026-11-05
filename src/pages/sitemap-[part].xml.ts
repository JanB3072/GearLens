import type { APIRoute } from 'astro';
import { sitemapPartXml, sitemapParts } from '../lib/sitemap';

export function getStaticPaths() {
  return sitemapParts().map((_, part) => ({ params: { part: String(part) } }));
}

export const GET: APIRoute = ({ params }) => {
  const part = Number(params.part);
  const xml = sitemapPartXml(part);
  if (!xml) return new Response('Not found', { status: 404 });
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
