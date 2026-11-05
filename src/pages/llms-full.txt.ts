import type { APIRoute } from 'astro';
import { buildLlmsFullPart } from '../lib/geo';

/** Compatibility URL: part 1 of the chunked full-text corpus. */
export const GET: APIRoute = () => new Response(buildLlmsFullPart(0), {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  },
});
