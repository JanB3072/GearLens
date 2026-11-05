import type { APIRoute } from 'astro';
import { LIMITS, SITE, absoluteUrl } from '../config/site';
import { escapeXml } from '../lib/sitemap';
import { getCards, getIndex } from '../lib/repository';

export const GET: APIRoute = () => {
  // Precomputed `by-updated` index: O(rssItems), not an O(n log n) sort of the
  // entire corpus on every build.
  const recent = getCards(getIndex<string[]>('by-updated').slice(0, LIMITS.rssItems));

  const items = recent.map((card) => [
    '    <item>',
    `      <title>${escapeXml(card.title)}</title>`,
    `      <link>${escapeXml(absoluteUrl(card.path))}</link>`,
    `      <guid isPermaLink="true">${escapeXml(absoluteUrl(card.path))}</guid>`,
    `      <description>${escapeXml(card.description)}</description>`,
    `      <pubDate>${new Date(card.publishedAt).toUTCString()}</pubDate>`,
    `      <category>${escapeXml(card.category)}</category>`,
    '    </item>',
  ].join('\n')).join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE.name)}</title>`,
    `    <link>${SITE.url}</link>`,
    `    <description>${escapeXml(SITE.description)}</description>`,
    '    <language>en-US</language>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
