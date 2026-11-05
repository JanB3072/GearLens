import type { APIRoute } from 'astro';
import { buildLlmsFullPart, llmsPartCount } from '../lib/geo';

export function getStaticPaths() {
  return Array.from({ length: llmsPartCount() }, (_, part) => ({ params: { part: String(part) } }));
}

/** A 100k-article corpus cannot fit in one llms-full.txt; emit N cacheable parts. */
export const GET: APIRoute = ({ params }) => {
  const part = Number(params.part);
  if (!Number.isInteger(part) || part < 0 || part >= llmsPartCount()) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(buildLlmsFullPart(part), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
