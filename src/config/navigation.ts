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

/**
 * Vertical-site information architecture. The menu is organised around system
 * goals and topic clusters, not around product lines or a single manufacturer.
 * "Series" are build paths: an ordered route from a plan to a working system.
 */
export function getNavigation(lang: string): NavItem[] {
  return [
    {
      label: t(lang, 'nav.systems'),
      href: localePath(lang, 'systems'),
      columns: [
        {
          title: 'Start with a plan',
          links: [
            { label: 'Living room 5.1.2', href: blogPath(lang, 'small-room-5-1-2-system-plan'), hint: '16 to 20 m2' },
            { label: 'Two-channel Hi-Fi', href: blogPath(lang, 'two-channel-hifi-system-chain'), hint: 'Signal chain' },
            { label: 'Dedicated cinema room', href: blogPath(lang, 'dolby-atmos-height-channels-explained'), hint: 'Height channels' },
            { label: 'All system plans', href: localePath(lang, 'systems') },
          ],
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
        title: 'Where the 60 Hz dip came from',
        body: 'One guide on moving a speaker 18 cm, remeasuring, and getting a worse result.',
        href: blogPath(lang, 'home-theater-speaker-placement'),
      },
    },
    {
      label: t(lang, 'nav.topics'),
      href: localePath(lang, 'categories'),
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
          title: 'Decisions and method',
          links: [
            { label: 'Buying & comparisons', href: categoryPath(lang, 'buying-comparisons') },
            { label: 'Measurements & method', href: categoryPath(lang, 'measurements-method') },
            { label: t(lang, 'nav.glossary'), href: localePath(lang, 'glossary') },
            { label: t(lang, 'listing.latest'), href: localePath(lang, 'blog') },
          ],
        },
      ],
    },
    { label: t(lang, 'nav.homeTheater'), href: categoryPath(lang, 'home-theater') },
    { label: t(lang, 'nav.hiFi'), href: categoryPath(lang, 'hi-fi-stereo') },
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
      title: t(lang, 'footer.explore'),
      links: [
        { label: t(lang, 'nav.systems'), href: localePath(lang, 'systems') },
        ...CATEGORIES.map((c) => ({ label: c.shortName, href: categoryPath(lang, c.slug) })),
        { label: t(lang, 'listing.latest'), href: localePath(lang, 'blog') },
      ],
    },
    {
      title: t(lang, 'nav.series'),
      links: [
        ...SERIES.map((s) => ({ label: s.name, href: localePath(lang, 'series', s.slug) })),
        { label: t(lang, 'nav.topics'), href: localePath(lang, 'categories') },
        { label: t(lang, 'nav.glossary'), href: glossaryPath(lang, 'dolby-atmos') },
      ],
    },
    {
      title: t(lang, 'footer.publication'),
      links: [
        { label: t(lang, 'nav.about'), href: localePath(lang, 'about') },
        { label: 'Editorial policy', href: localePath(lang, 'editorial-policy') },
        { label: 'Privacy policy', href: localePath(lang, 'privacy') },
        { label: 'Terms of use', href: localePath(lang, 'terms') },
        { label: 'Accessibility', href: localePath(lang, 'accessibility') },
      ],
    },
    {
      title: t(lang, 'footer.details'),
      links: [
        { label: 'llms.txt', href: '/llms.txt' },
        { label: 'Sitemap index', href: '/sitemap.xml' },
        { label: 'RSS feed', href: '/feed.xml' },
        { label: t(lang, 'nav.search'), href: localePath(lang, 'search') },
      ],
    },
  ];
}
