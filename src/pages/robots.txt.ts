import type { APIRoute } from 'astro';
import { AI_CRAWLERS, SITE } from '../config/site';
import { ENABLED_LOCALES } from '../i18n';
import { sitemapPartCount } from '../lib/sitemap';

export const GET: APIRoute = () => {
  const lines: string[] = [
    `# ${SITE.name} — crawl policy`,
    '# AI / answer-engine crawlers are explicitly welcome. We publish dated,',
    '# sourced, machine-readable content (see /llms.txt and the Markdown mirrors).',
    '',
    'User-agent: *',
    'Allow: /',
    ...ENABLED_LOCALES.map((l) => `Disallow: /${l.code}/search`),
    'Disallow: /*?q=',
    'Disallow: /*?page=',
    'Disallow: /404',
    '',
  ];

  for (const bot of AI_CRAWLERS) lines.push(`# ${bot.note}`, `User-agent: ${bot.name}`);
  lines.push('Allow: /', '');

  lines.push('# Sitemap index (one shard per 45,000 URLs)');
  for (let i = 0; i < sitemapPartCount(); i++) lines.push(`Sitemap: ${SITE.url}/sitemap-${i}.xml`);
  lines.push(`Sitemap: ${SITE.url}/sitemap.xml`, '');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
