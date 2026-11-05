import type { APIRoute } from 'astro';
import { LIMITS } from '../config/site';
import { getSearchDocs } from '../lib/repository';

/**
 * Deliberately capped. For 100k+ articles replace this endpoint with a hosted
 * search service (Algolia / Typesense / Orama Cloud / Pagefind shards) — see README.
 */
export const GET: APIRoute = () => {
  const items = getSearchDocs().slice(0, LIMITS.searchIndexDocs);
  return new Response(JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
