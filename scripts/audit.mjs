#!/usr/bin/env node
/**
 * SEO / GEO quality gate for the whole corpus.
 * Run it in CI before publishing: `npm run audit`.
 * Reads generated shards, so it stays O(n) and never touches Astro.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INDEXES = path.join(ROOT, 'content', 'indexes');
const SHARDS = path.join(ROOT, 'content', 'shards');

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
if (!fs.existsSync(path.join(INDEXES, 'manifest.json'))) {
  console.error('[audit] Run `npm run ingest` first.');
  process.exit(1);
}

const { articles } = read(path.join(INDEXES, 'manifest.json'));
const paths = read(path.join(INDEXES, 'paths.json'));
// Compare slash-insensitively: canonical URLs carry a trailing slash but
// authored Markdown may use either form.
const norm = (p) => String(p).split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
const pathToId = new Map(Object.entries(paths).map(([p, id]) => [norm(p), id]));
const knownPaths = new Set(pathToId.keys());
const idToPath = new Map(Object.entries(paths).map(([p, id]) => [id, norm(p)]));

const issues = [];
const add = (id, level, rule, detail) => issues.push({ id, level, rule, detail });
const words = (s) => (String(s || '').trim() ? String(s).trim().split(/\s+/).length : 0);

const seenTitles = new Map();
const inbound = new Map();

for (const entry of articles) {
  const id = entry.id;
  const file = path.join(SHARDS, entry.shard.replace(/^shards\//, ''));
  const abs = path.isAbsolute(entry.shard) ? entry.shard : path.join(ROOT, 'content', entry.shard);
  const target = fs.existsSync(abs) ? abs : file;
  if (!fs.existsSync(target)) {
    add(id, 'error', 'shard-missing', `missing ${entry.shard}`);
    continue;
  }
  const a = read(target);

  // --- classic SEO
  if (a.title.length < 25 || a.title.length > 72) add(id, 'warn', 'title-length', `${a.title.length} chars (25-72 recommended)`);
  if (a.description.length < 110 || a.description.length > 170) add(id, 'warn', 'description-length', `${a.description.length} chars (110-170 recommended)`);
  if (!a.path || !/^\/[a-z]{2}\/blog\/[a-z0-9/-]+$/.test(a.path)) add(id, 'error', 'slug', 'path must be /<lang>/blog/<kebab-slug>');
  if (!a.publishedAt || !a.updatedAt) add(id, 'error', 'dates', 'publishedAt and updatedAt required');
  if (a.updatedAt < a.publishedAt) add(id, 'error', 'dates', 'updatedAt precedes publishedAt');
  if (!a.author) add(id, 'error', 'author', 'E-E-A-T requires a named author');
  if (!a.category) add(id, 'error', 'category', 'category required for breadcrumbs');

  const titleKey = a.title.toLowerCase().trim();
  if (seenTitles.has(titleKey)) add(id, 'error', 'duplicate-title', `same title as ${seenTitles.get(titleKey)}`);
  else seenTitles.set(titleKey, id);

  // --- GEO / answer-engine extractability
  if (!a.answer) add(id, 'error', 'geo-answer', 'missing direct-answer field (first 40-60 words)');
  else if (words(a.answer) > 90) add(id, 'warn', 'geo-answer', `${words(a.answer)} words; keep the short answer under ~60`);
  if (a.keyTakeaways.length < 3) add(id, 'warn', 'geo-takeaways', 'fewer than 3 extractable takeaways');
  if (a.faq.length < 3) add(id, 'warn', 'geo-faq', 'fewer than 3 FAQ entries (FAQPage rich result / LLM quoting)');
  if (!a.sources.length) add(id, 'warn', 'geo-sources', 'no cited sources; factual claims should be attributable');
  for (const s of a.sources) {
    if (!/^https?:\/\//.test(s.url)) add(id, 'error', 'geo-sources', `invalid source URL: ${s.url}`);
  }
  if (a.howTo && a.howTo.steps.length < 2) add(id, 'warn', 'geo-howto', 'HowTo needs at least 2 steps');
  if (a.headings.length < 3) add(id, 'warn', 'structure', 'fewer than 3 H2/H3 sections; chunking suffers');
  if (/\d/.test(a.bodyHtml) === false) add(id, 'warn', 'geo-numbers', 'no numbers in body; quantified claims are cited more often');
  if (!a.reviewedAt && !a.reviewer) add(id, 'info', 'eeat', 'no fact-check date / reviewer');
  if (!a.entities.length) add(id, 'info', 'geo-entities', 'no linked entities for knowledge-graph grounding');
  if (!a.heroAlt && a.heroImage) add(id, 'error', 'a11y', 'hero image has no alt text');

  // --- internal link graph
  const links = [...a.bodyMarkdown.matchAll(/\]\((\/[^)\s]+)\)/g)].map((m) => m[1]);
  for (const href of links) {
    const key = norm(href);
    if (/^\/[a-z]{2}\/blog\//.test(href) && !knownPaths.has(key)) {
      add(id, 'error', 'broken-internal-link', href);
    }
    if (/\/blog\//.test(href)) inbound.set(key, (inbound.get(key) || 0) + 1);
  }
  if (/\{\{(article|glossary):/.test(a.bodyMarkdown)) add(id, 'error', 'unresolved-shortcode', 'unresolved {{...}} shortcode');
  if (!links.length) add(id, 'warn', 'orphan-outbound', 'no internal links in body');
  if (!a.related.length) add(id, 'warn', 'related', 'no precomputed related posts');
  for (const rid of a.related) {
    const targetPath = idToPath.get(rid);
    if (targetPath) inbound.set(targetPath, (inbound.get(targetPath) || 0) + 1);
  }
}

for (const p of knownPaths) {
  if (!inbound.has(p)) add(pathToId.get(p), 'info', 'orphan-page', `${p} has no incoming internal links`);
}

const byRule = {};
for (const i of issues) (byRule[`${i.level}:${i.rule}`] ||= []).push(i);
const counts = { error: 0, warn: 0, info: 0 };
for (const i of issues) counts[i.level]++;

console.log(`[audit] ${articles.length} articles checked → ${counts.error} errors, ${counts.warn} warnings, ${counts.info} notes\n`);
for (const [rule, list] of Object.entries(byRule).sort()) {
  console.log(`  ${rule.padEnd(34)} ${String(list.length).padStart(4)}  e.g. ${list[0].id}: ${list[0].detail}`);
}
console.log('\nRule reference: geo-* = Generative Engine Optimization, eeat = experience/expertise/authoritativeness/trust.');

// Errors fail the build; warnings are advisory so a growing site can ship.
process.exit(counts.error > 0 ? 1 : 0);
