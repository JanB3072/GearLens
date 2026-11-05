import categoriesData from '../../content/taxonomy/categories.json';
import seriesData from '../../content/taxonomy/series.json';
import type { Category, Series } from '../lib/types';
import { blogPath, categoryPath, glossaryPath, localePath, t } from '../i18n';

export const CATEGORIES = categoriesData as Category[];
export const SERIES = seriesData as Series[];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSeries(slug: string): Series | undefined {
  return SERIES.find((s) => s.slug === slug);
}

export interface NavLink {
  label: string;
  href: string;
  hint?: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  columns?: NavColumn[];
  feature?: { eyebrow: string; title: string; body: string; href: string };
}

/** Reference-site pattern: fat two-column mega menu (Categories + Series). */
export function getNavigation(lang: string): NavItem[] {
  return [
    {
      label: t(lang, 'nav.guides'),
      href: categoryPath(lang, 'guides'),
      columns: [
        {
          title: t(lang, 'nav.categories'),
          links: CATEGORIES.map((c) => ({
            label: c.shortName,
            href: categoryPath(lang, c.slug),
            hint: c.eyebrow,
          })),
        },
        {
          title: t(lang, 'nav.series'),
          links: SERIES.map((s) => ({
            label: s.name,
            href: localePath(lang, 'series', s.slug),
            hint: s.eyebrow,
          })),
        },
      ],
      feature: {
        eyebrow: 'Start here',
        title: 'The complete setup path',
        body: 'One hub guide that links every step, measurement and buying decision.',
        href: blogPath(lang, 'home-theater-speaker-placement'),
      },
    },
    {
      label: t(lang, 'nav.comparisons'),
      href: categoryPath(lang, 'comparisons'),
      columns: [
        {
          title: t(lang, 'nav.categories'),
          links: CATEGORIES.slice(0, 3).map((c) => ({ label: c.name, href: categoryPath(lang, c.slug) })),
        },
        {
          title: 'Popular head-to-heads',
          links: [
            { label: 'Bookshelf vs tower', href: blogPath(lang, 'bookshelf-vs-tower-speakers') },
            { label: 'Soundbar vs separates', href: blogPath(lang, 'center-channel-dialogue-clarity') },
            { label: 'All comparisons', href: categoryPath(lang, 'comparisons') },
          ],
        },
      ],
    },
    { label: t(lang, 'nav.explainers'), href: categoryPath(lang, 'explainers') },
    { label: t(lang, 'nav.buyingGuides'), href: categoryPath(lang, 'buying-guides') },
    { label: t(lang, 'nav.glossary'), href: localePath(lang, 'glossary') },
  ];
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export function getFooterColumns(lang: string): FooterColumn[] {
  return [
    {
      title: t(lang, 'footer.productHelp'),
      links: [
        ...CATEGORIES.map((c) => ({ label: c.shortName, href: categoryPath(lang, c.slug) })),
        { label: t(lang, 'listing.latest'), href: localePath(lang, 'blog') },
      ],
    },
    {
      title: t(lang, 'nav.series'),
      links: [
        ...SERIES.map((s) => ({ label: s.name, href: localePath(lang, 'series', s.slug) })),
        { label: t(lang, 'nav.glossary'), href: glossaryPath(lang, 'dolby-atmos') },
      ],
    },
    {
      title: t(lang, 'footer.aboutUs'),
      links: [
        { label: t(lang, 'nav.about'), href: localePath(lang, 'about') },
        { label: 'Editorial policy', href: localePath(lang, 'editorial-policy') },
        { label: 'Privacy policy', href: localePath(lang, 'privacy') },
        { label: 'Terms of use', href: localePath(lang, 'terms') },
        { label: 'Accessibility', href: localePath(lang, 'accessibility') },
      ],
    },
    {
      title: t(lang, 'footer.resources'),
      links: [
        { label: 'llms.txt', href: '/llms.txt' },
        { label: 'Sitemap index', href: '/sitemap.xml' },
        { label: 'RSS feed', href: '/feed.xml' },
        { label: t(lang, 'nav.search'), href: localePath(lang, 'search') },
      ],
    },
  ];
}
