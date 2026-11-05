/** Shared shapes. `scripts/ingest.mjs` writes JSON that conforms to these. */

export interface Heading {
  depth: 2 | 3 | 4;
  text: string;
  id: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToBlock {
  name: string;
  description?: string;
  totalTime?: string;
  steps: HowToStep[];
}

export interface SourceItem {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
}

export interface ArticleCard {
  id: string;
  lang: string;
  slug: string;
  path: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  series?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  wordCount: number;
  heroImage?: string;
  heroAlt?: string;
  pillar: boolean;
  priority: number;
}

export interface ManifestEntry extends ArticleCard {
  shard: string;
  status: 'published' | 'draft';
  noindex: boolean;
  translationGroup: string;
}

export interface Manifest {
  generatedAt: string;
  total: number;
  locales: string[];
  articles: ManifestEntry[];
}

export interface Article extends ArticleCard {
  status: 'published' | 'draft';
  noindex: boolean;
  /** Set when this page only mirrors another locale's body (untranslated fallback). */
  fallbackOf?: string;
  translationGroup: string;
  translations: Record<string, string>;
  answer: string;
  keyTakeaways: string[];
  faq: FaqItem[];
  howTo?: HowToBlock;
  sources: SourceItem[];
  entities: string[];
  bodyHtml: string;
  bodyMarkdown: string;
  headings: Heading[];
  ogImage?: string;
  reviewedAt?: string;
  reviewer?: string;
  related: string[];
  breadcrumbLabel?: string;
  claimReviewed?: string;
}

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  index: string;
  accent: string;
}

export interface Series {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  articleCount: number;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  credentials: string;
  avatar?: string;
  sameAs?: string[];
}

export interface Tag {
  slug: string;
  name: string;
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  alsoKnownAs?: string[];
  relatedTerms?: string[];
  sources?: string[];
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  alternates?: Array<{ hreflang: string; href: string }>;
}

export type IndexName = 'by-date' | 'by-category' | 'by-tag' | 'by-author' | 'by-series' | 'priority';
