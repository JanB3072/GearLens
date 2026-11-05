import { defineCollection, z } from 'astro:content';
import type { Loader } from 'astro/loaders';
import fs from 'node:fs/promises';

/**
 * Astro 5 Content Layer is used for the SMALL, bounded datasets only.
 * Articles intentionally live in `content/shards` behind `src/lib/repository.ts`:
 * putting 100k+ documents into a Content Layer store would load the whole corpus
 * on every build. Taxonomies are a few dozen rows, so they are a perfect fit.
 */
function taxonomyLoader(fileName: string): Loader {
  return {
    name: `gearlens:taxonomy:${fileName}`,
    load: async ({ store, parseData, generateDigest }) => {
      const url = new URL(`../content/taxonomy/${fileName}`, import.meta.url);
      const rows = JSON.parse(await fs.readFile(url, 'utf8')) as Array<Record<string, unknown>>;
      store.clear();
      for (const row of rows) {
        const id = String(row.slug);
        const data = await parseData({ id, data: row });
        store.set({ id, data, digest: generateDigest(row) });
      }
    },
  };
}

const base = z.object({ slug: z.string() }).passthrough();

const categories = defineCollection({ loader: taxonomyLoader('categories.json'), schema: base });
const series = defineCollection({ loader: taxonomyLoader('series.json'), schema: base });
const authors = defineCollection({ loader: taxonomyLoader('authors.json'), schema: base });
const tags = defineCollection({ loader: taxonomyLoader('tags.json'), schema: base });
const glossary = defineCollection({ loader: taxonomyLoader('glossary.json'), schema: base });

export const collections = { categories, series, authors, tags, glossary };
