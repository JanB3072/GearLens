import { SITE, absoluteUrl } from '../config/site';
import { authorPath, getLocaleConfig, glossaryPath, localePath } from '../i18n';
import type { Crumb } from './links';
import { authorBySlug, categoryBySlug, glossaryBySlug } from './taxonomy';
import type { Article, ArticleCard, Author, FaqItem, GlossaryTerm, HowToBlock } from './types';

/**
 * Structured-data builders. Every page emits ONE <script type="application/ld+json">
 * containing a single @graph, which avoids duplicate @context declarations and
 * lets nodes reference each other by stable @id.
 */
export const ORG_ID = `${SITE.url}/#organization`;

export function websiteId(lang: string): string {
  return `${absoluteUrl(localePath(lang))}#website`;
}

export function personId(lang: string, slug: string): string {
  return `${absoluteUrl(authorPath(lang, slug))}#person`;
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.organization,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) },
    foundingDate: String(SITE.foundedYear),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: SITE.email,
      availableLanguage: ['English'],
    },
  };
}

export function websiteSchema(lang: string) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(lang),
    url: absoluteUrl(localePath(lang)),
    name: `${SITE.name} ${getLocaleConfig(lang).label}`,
    inLanguage: getLocaleConfig(lang).hreflang,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(localePath(lang, 'search'))}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function personSchema(author: Author, lang: string) {
  return {
    '@type': 'Person',
    '@id': personId(lang, author.slug),
    name: author.name,
    url: absoluteUrl(authorPath(lang, author.slug)),
    jobTitle: author.role,
    description: author.bio,
    knowsAbout: ['Loudspeakers', 'Room acoustics', 'Home theater'],
    hasCredential: author.credentials
      ? { '@type': 'EducationalOccupationalCredential', credentialCategory: 'professional experience', name: author.credentials }
      : undefined,
    sameAs: author.sameAs?.filter(Boolean) ?? [],
    worksFor: { '@id': ORG_ID },
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE.url}/#breadcrumb`,
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absoluteUrl(crumb.href) } : {}),
    })),
  };
}

export function faqSchema(faq: FaqItem[]) {
  if (!faq.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${SITE.url}/#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function howToSchema(howTo: HowToBlock, articleUrl: string) {
  if (!howTo?.steps?.length) return null;
  return {
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description ?? '',
    totalTime: howTo.totalTime,
    step: howTo.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      url: `${articleUrl}#${slugForStep(step.name, i)}`,
      ...(step.image ? { image: absoluteUrl(step.image) } : {}),
    })),
  };
}

export function slugForStep(name: string, index: number): string {
  return `step-${index + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function articleSchema(article: Article, lang: string) {
  const canonicalUrl = absoluteUrl(article.path);
  const author = authorBySlug.get(article.author);
  const entities = article.entities.map((name) => {
    const term = glossaryBySlug.get(name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    return term
      ? { '@type': 'Thing', '@id': `${absoluteUrl(glossaryPath(lang, term.slug))}#term`, name: term.term }
      : { '@type': 'Thing', name };
  });

  return {
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    url: canonicalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    headline: article.title.slice(0, 110),
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: getLocaleConfig(lang).hreflang,
    isAccessibleForFree: true,
    author: author ? { '@id': personId(lang, author.slug) } : { '@type': 'Person', name: article.author },
    ...(article.reviewer && authorBySlug.has(article.reviewer)
      ? { reviewedBy: { '@id': personId(lang, article.reviewer) } }
      : {}),
    publisher: { '@id': ORG_ID },
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(article.ogImage || article.heroImage || SITE.defaultOgImage),
    },
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingMinutes}M`,
    articleSection: categoryBySlug.get(article.category)?.name ?? article.category,
    keywords: article.tags.join(', '),
    about: entities,
    citation: article.sources.map((s) => ({
      '@type': 'CreativeWork',
      name: s.title,
      url: s.url,
      ...(s.publisher ? { publisher: { '@type': 'Organization', name: s.publisher } } : {}),
      ...(s.date ? { datePublished: s.date } : {}),
    })),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.c-answer', '.c-takeaways'] },
    ...(article.claimReviewed ? { claimReviewed: article.claimReviewed } : {}),
  };
}

export function itemListSchema(cards: ArticleCard[], name: string) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: cards.length,
    itemListElement: cards.map((card, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(card.path),
      name: card.title,
    })),
  };
}

export function collectionPageSchema(name: string, description: string, url: string, lang = 'en') {
  return {
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(url),
    inLanguage: getLocaleConfig(lang).hreflang,
    isPartOf: { '@id': websiteId(lang) },
  };
}

export function definedTermSchema(term: GlossaryTerm, lang: string) {
  return {
    '@type': 'DefinedTerm',
    '@id': `${absoluteUrl(glossaryPath(lang, term.slug))}#term`,
    name: term.term,
    description: term.definition,
    url: absoluteUrl(glossaryPath(lang, term.slug)),
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: `${SITE.name} Glossary`, url: absoluteUrl(localePath(lang, 'glossary')) },
    alternateName: term.alsoKnownAs ?? [],
    ...(term.sources?.length ? { citation: term.sources.map((url) => ({ '@type': 'CreativeWork', url })) } : {}),
  };
}

export function graph(nodes: Array<unknown>): string {
  const clean = nodes.filter(Boolean);
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': clean }).replace(/</g, '\\u003c');
}
