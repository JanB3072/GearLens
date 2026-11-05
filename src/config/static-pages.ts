import { SITE } from './site';

export interface StaticPage {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
}

/**
 * Kept in a separate module on purpose: Astro evaluates `getStaticPaths()` in
 * an isolated module scope, so top-level frontmatter constants are not visible
 * inside it.
 */
export const STATIC_PAGES: Record<string, StaticPage> = {
  about: {
    title: 'About GearLens',
    description: 'Who writes GearLens, how we measure, and how we correct mistakes. Authorship, methodology and update cadence in one place.',
    eyebrow: 'About us',
    intro: `${SITE.name} is an independent editorial library. We publish measurement-led guides about loudspeakers, room setup and home theater, with the method attached to every recommendation.`,
    sections: [
      { heading: 'Who is behind it', paragraphs: ['Every guide carries a named author and, where a claim needs verification, a named reviewer. Author pages list credentials and link to all of their work.'] },
      { heading: 'How we test', paragraphs: ['Measurements are taken in-room at a stated microphone position, with a stated sweep level and smoothing. A frequency-range claim always ships with its tolerance. When a result depends on the room, we say so instead of presenting it as a product property.', 'We keep the failure cases. A guide that only reports success is a brochure, not a test.'] },
      { heading: 'Correction policy', paragraphs: ['If a measurement or a sourced claim is wrong, we correct the article, change the last-updated date and add a note describing what changed. Corrections are never silent.'] },
    ],
  },
  'editorial-policy': {
    title: 'Editorial policy',
    description: 'Sourcing standards, affiliate disclosure, update cadence and the rules behind every recommendation published on GearLens.',
    eyebrow: 'Editorial standards',
    intro: 'This page exists so readers and answer engines can check how the content is produced before they cite it.',
    sections: [
      { heading: 'Sourcing', paragraphs: ['Prefer primary sources: manufacturer measurement notes, standards documents and peer-reviewed acoustics literature. Every factual claim with a number should be traceable to a source listed at the end of the article.'] },
      { heading: 'Structure of an article', paragraphs: ['A short answer first, then three or more extractable key takeaways, then the mechanism, then a named failure case, then FAQ and cited sources. This is deliberate: it makes the content quotable without stripping the context.'] },
      { heading: 'Update cadence', paragraphs: ['Evergreen guides are rechecked every 90 days. The last-updated and fact-checked dates are real editorial dates, not automatically regenerated timestamps.'] },
      { heading: 'Commercial relationships', paragraphs: ['Some outbound links are affiliate links. A commission never changes a test result, a ranking or the decision to publish a negative finding.'] },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    description: 'What data this site collects, what it does not collect, and how to request removal.',
    eyebrow: 'Legal',
    intro: 'This is a template policy. Replace it with a reviewed policy that matches your analytics, newsletter and advertising setup before launch.',
    sections: [
      { heading: 'Data we collect', paragraphs: ['Server logs may include IP address, user agent and requested URL for security and diagnostics. If you subscribe, we store the email address you provide.'] },
      { heading: 'Cookies', paragraphs: ['The site stores a theme preference in localStorage. It does not set advertising cookies by default. Add a consent banner before enabling any analytics or ad partner.'] },
      { heading: 'Contact', paragraphs: [`Questions about this policy: ${SITE.email}.`] },
    ],
  },
  terms: {
    title: 'Terms of use',
    description: 'Terms governing the use of GearLens content, including citation and reuse.',
    eyebrow: 'Legal',
    intro: 'Template terms. Have them reviewed for your jurisdiction before launch.',
    sections: [
      { heading: 'Permitted use', paragraphs: ['You may quote short passages with a link to the original article and attribution to the named author. Automated full-text reproduction of the library requires written permission.'] },
      { heading: 'No warranty', paragraphs: ['Measurements describe specific units under specific conditions. Results in your room may differ. Content is informational, not professional installation advice.'] },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    description: 'Accessibility commitments and known limitations of this site.',
    eyebrow: 'Legal',
    intro: 'We aim for WCAG 2.2 AA. This page documents the concrete choices made in the framework.',
    sections: [
      { heading: 'Implemented', paragraphs: ['Skip links, visible focus states, semantic landmarks, heading order, keyboard-operable disclosure widgets, reduced-motion support, text alternatives for decorative art, and a light/dark theme that respects the operating-system preference.'], bullets: ['Never convey meaning by colour alone.', 'Maintain a minimum 4.5:1 body-text contrast in both themes.', 'Keep every article readable without JavaScript.'] },
      { heading: 'Feedback', paragraphs: [`Report a barrier to ${SITE.email} and we will respond with a fix or a timeline.`] },
    ],
  },
};
