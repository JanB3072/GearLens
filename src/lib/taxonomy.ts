import categoriesData from '../../content/taxonomy/categories.json';
import seriesData from '../../content/taxonomy/series.json';
import authorsData from '../../content/taxonomy/authors.json';
import tagsData from '../../content/taxonomy/tags.json';
import glossaryData from '../../content/taxonomy/glossary.json';
import type { Author, Category, GlossaryTerm, Series, Tag } from './types';

/**
 * Small, finite taxonomies belong in the Astro Content Layer / bundled JSON.
 * Articles deliberately do NOT: 100k rows in a collection would be loaded on
 * every build. See `src/content.config.ts`.
 */
export const categories = categoriesData as Category[];
export const series = seriesData as Series[];
export const authors = authorsData as Author[];
export const tags = tagsData as Tag[];
export const glossary = glossaryData as GlossaryTerm[];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
export const seriesBySlug = new Map(series.map((s) => [s.slug, s]));
export const authorBySlug = new Map(authors.map((a) => [a.slug, a]));
export const tagBySlug = new Map(tags.map((t) => [t.slug, t]));
export const glossaryBySlug = new Map(glossary.map((g) => [g.slug, g]));

export function categoryName(slug: string): string {
  return categoryBySlug.get(slug)?.name ?? slug;
}

export function tagName(slug: string): string {
  return tagBySlug.get(slug)?.name ?? slug;
}

export function authorName(slug: string): string {
  return authorBySlug.get(slug)?.name ?? slug;
}

export function seriesName(slug: string): string {
  return seriesBySlug.get(slug)?.name ?? slug;
}
