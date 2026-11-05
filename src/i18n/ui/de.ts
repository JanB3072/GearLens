import type { UiKey } from './en';

/**
 * Partial dictionary: any missing key falls back to English in `t()`.
 * Add one file per locale; you do not need to translate every key to launch.
 */
export const de: Partial<Record<UiKey, string>> = {
  'nav.guides': 'Ratgeber',
  'nav.comparisons': 'Vergleiche',
  'nav.explainers': 'Erklärungen',
  'nav.buyingGuides': 'Kaufberatung',
  'nav.glossary': 'Glossar',
  'nav.about': 'Über uns',
  'nav.search': 'Suche',
  'nav.categories': 'Kategorien',
  'nav.series': 'Serien',
  'nav.discoverAll': 'Alle Artikel entdecken',
  'home.heroTitle': 'Höre den Unterschied. Verstehe den Grund.',
  'home.heroPrimary': 'Zum Hauptratgeber',
  'home.heroSecondary': 'Alle Ratgeber',
  'home.categoriesTitle': 'Finde die Antwort, die du suchst',
  'home.latestTitle': 'Neue Ratgeber',
  'article.answerLabel': 'Kurze Antwort',
  'article.takeawaysLabel': 'Wichtigste Erkenntnisse',
  'article.tocLabel': 'Auf dieser Seite',
  'article.faqLabel': 'Häufige Fragen',
  'article.sourcesLabel': 'Quellen',
  'article.relatedLabel': 'Weiterlesen',
  'listing.latest': 'Alle Artikel',
  'common.readMore': 'Ratgeber lesen',
  'footer.productHelp': 'Entdecken',
  'footer.aboutUs': 'Über uns',
};
