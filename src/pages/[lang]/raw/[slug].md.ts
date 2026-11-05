import type { APIRoute } from 'astro';
import { markdownMirror } from '../../../lib/geo';
import { getArticleByPath } from '../../../lib/repository';
import { markdownStaticPaths } from '../../../lib/static-paths';

/**
 * A real `.md` file per article, e.g. `/en/raw/my-guide.md`.
 * As a static asset Cloudflare serves it with a Markdown MIME type (also
 * pinned in `public/_headers`) — unlike an `index.html` in a directory,
 * which would be sent as text/html and defeat the GEO mirror.
 */
export function getStaticPaths() {
  return markdownStaticPaths();
}

export const GET: APIRoute = ({ params }) => {
  const L = params.lang ?? 'en';
  const article = getArticleByPath(`/${L}/blog/${params.slug}`);
  if (!article || article.status !== 'published' || article.noindex) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return new Response(markdownMirror(article), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
