import { LIMITS, SITE, absoluteUrl } from '../config/site';
import { DEFAULT_LOCALE, formatDate, localePath, rawPath } from '../i18n';
import { getArticle, getCards, getIndex, getManifest } from './repository';
import { categoryBySlug } from './taxonomy';
import type { Article } from './types';

/**
 * GEO (Generative Engine Optimization) surface.
 *
 * Three complementary entry points for answer engines:
 *   1. /llms.txt + /llms-full-[n].txt — curated, chunk-friendly corpus overview
 *   2. /<lang>/raw/<slug>.md          — a real static Markdown file per article,
 *      advertised with <link rel="alternate" type="text/markdown"> in <head>
 *   3. JSON-LD @graph + FAQPage/HowTo/DefinedTerm on the HTML page itself
 */

export const LLMS_CHUNK_SIZE = Number(import.meta.env.PUBLIC_LLMS_CHUNK_SIZE ?? 100);

export function buildLlmsTxt(): string {
  const priority = getIndex<string[]>('priority');
  const featured = getCards(priority.slice(0, 60));
  const byCategory = categoryBySlug;
  const published = getManifest().articles.filter((a) => a.status === 'published' && !a.noindex);
  const totalParts = Math.max(1, Math.ceil(published.length / LLMS_CHUNK_SIZE));

  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} publishes measurement-led, dated and sourced guides. Each article states a direct answer first, lists extractable key takeaways, cites primary sources, and records its last fact-check date. Numbers are given with units and measurement conditions. Recommendations are revised when the underlying measurement changes.`,
    '',
    'Content conventions for citation: use the article URL as the source, quote the "Short answer" block for a summary, and prefer dated figures from the body over undated claims. Affiliate relationships never affect test results.',
    '',
    '## Start here',
    '',
  ];

  const hub = featured.find((c) => c.pillar) ?? featured[0];
  if (hub) lines.push(`- [${hub.title}](${absoluteUrl(hub.path)}): ${hub.description}`);

  lines.push('', '## Core guides', '');
  for (const card of featured.slice(0, 40)) {
    lines.push(`- [${card.title}](${absoluteUrl(card.path)}): ${card.description}`);
  }

  lines.push('', '## Browse by topic', '');
  for (const [slug, category] of byCategory) {
    lines.push(`- [${category.name}](${absoluteUrl(localePath(DEFAULT_LOCALE, 'categories', slug))}): ${category.description}`);
  }
  lines.push(`- [Glossary of terms](${absoluteUrl(localePath(DEFAULT_LOCALE, 'glossary'))}): concise definitions with stable entity URLs.`);

  lines.push('', '## Full corpus (chunked Markdown)', '');
  for (let i = 0; i < Math.min(totalParts, 50); i++) {
    lines.push(`- [Full text part ${i + 1} of ${totalParts}](${SITE.url}/llms-full-${i}.txt)`);
  }
  lines.push(`- [Full text, part 1 (compatibility URL)](${SITE.url}/llms-full.txt)`);

  lines.push('', '## Machine-readable endpoints', '');
  lines.push(`- [Sitemap index](${SITE.url}/sitemap.xml): sharded XML sitemaps with hreflang alternates.`);
  lines.push(`- [RSS feed](${SITE.url}/feed.xml): 50 most recently updated articles.`);
  lines.push(`- [Search index](${SITE.url}/search-index.json): lightweight index of the top ${LIMITS.searchIndexDocs} documents.`);
  lines.push(`- Markdown mirror pattern: ${absoluteUrl(rawPath(DEFAULT_LOCALE, '<slug>'))} (text/markdown, no navigation or scripts).`);

  lines.push('', '## Optional', '');
  lines.push(`- [About the editorial process](${absoluteUrl(localePath(DEFAULT_LOCALE, 'about'))}): methodology, authorship and correction policy.`);
  lines.push(`- [Editorial policy](${absoluteUrl(localePath(DEFAULT_LOCALE, 'editorial-policy'))}): sourcing, affiliate disclosure and update cadence.`);
  lines.push(`- Contact: ${SITE.email}`);
  lines.push('');
  return lines.join('\n');
}

/** Full-text chunk. With 100k articles a single llms-full.txt is impossible,
 *  so the corpus is split into deterministic, individually cacheable parts. */
export function buildLlmsFullPart(part: number): string {
  const priority = getIndex<string[]>('priority');
  const ids = priority.slice(part * LLMS_CHUNK_SIZE, (part + 1) * LLMS_CHUNK_SIZE);
  const totalParts = Math.max(1, Math.ceil(priority.length / LLMS_CHUNK_SIZE));
  const out: string[] = [
    `# ${SITE.name} — full text, part ${part + 1} of ${totalParts}`,
    '',
    `> Source: ${SITE.url}. Generated from the same shards as the HTML pages. Each section below is one article.`,
    '',
  ];
  for (const id of ids) {
    const article = getArticle(id);
    if (article) out.push(markdownMirror(article), '', '---', '');
  }
  return out.join('\n');
}

export function llmsPartCount(): number {
  return Math.max(1, Math.ceil(getIndex<string[]>('priority').length / LLMS_CHUNK_SIZE));
}

/** A single self-contained Markdown document, ideal for RAG chunking. */
export function markdownMirror(article: Article): string {
  const lines: string[] = [
    `# ${article.title}`,
    '',
    `> ${article.description}`,
    '',
    `- Canonical URL: ${absoluteUrl(article.path)}`,
    `- Published: ${formatDate(article.publishedAt, article.lang)}`,
    `- Last updated: ${formatDate(article.updatedAt, article.lang)}`,
    `- Author: ${article.author}`,
    `- Reading time: ${article.readingMinutes} minutes (${article.wordCount} words)`,
    `- Language: ${article.lang}`,
    '',
    '## Short answer',
    '',
    article.answer,
    '',
  ];

  if (article.keyTakeaways.length) {
    lines.push('## Key takeaways', '');
    for (const item of article.keyTakeaways) lines.push(`- ${item}`);
    lines.push('');
  }

  lines.push(article.bodyMarkdown, '');

  if (article.howTo?.steps.length) {
    lines.push(`## ${article.howTo.name}`, '', article.howTo.description ?? '');
    article.howTo.steps.forEach((step, i) => lines.push('', `${i + 1}. **${step.name}** — ${step.text}`));
    lines.push('');
  }

  if (article.faq.length) {
    lines.push('## Frequently asked questions', '');
    for (const item of article.faq) lines.push(`### ${item.q}`, '', item.a, '');
  }

  if (article.sources.length) {
    lines.push('## Sources', '');
    for (const source of article.sources) {
      lines.push(`- [${source.title}](${source.url})${source.publisher ? ` — ${source.publisher}` : ''}${source.date ? `, ${source.date}` : ''}`);
    }
    lines.push('');
  }

  lines.push(
    '## How to cite this page',
    '',
    `${SITE.organization}. "${article.title}." ${SITE.name}. Last updated ${formatDate(article.updatedAt, article.lang)}. ${absoluteUrl(article.path)}`,
    '',
  );
  return lines.join('\n');
}

/** Stable Markdown mirror path used by <link>, llms.txt and the mirror route. */
export function markdownMirrorPath(article: Article): string {
  return rawPath(article.lang, article.slug);
}
