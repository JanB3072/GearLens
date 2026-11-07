import { SITE } from './site';

export interface StaticCard {
  index: string;
  label: string;
  title: string;
  body: string;
  /** Locale-relative path, e.g. `blog/my-article/`. */
  href: string;
  points: string[];
}

export interface StaticPage {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  cards?: StaticCard[];
  links?: Array<{ label: string; href: string }>;
}

/**
 * Kept in a separate module on purpose: Astro evaluates `getStaticPaths()` in
 * an isolated module scope, so top-level frontmatter constants are not visible
 * inside it.
 *
 * `systems` is the vertical-site entry point: it describes complete systems,
 * not products. Every other page here states the editorial terms under which
 * the library is built.
 */
export const STATIC_PAGES: Record<string, StaticPage> = {
  systems: {
    title: 'System blueprints',
    description: 'Three complete AV system plans for a small living room, a two-channel Hi-Fi chain and a dedicated cinema room, with budgets, wiring and measurement checkpoints.',
    eyebrow: 'Build from a plan',
    intro: `${SITE.name} is organised around systems, not product lines. Choose the room and the goal first, then follow the guides through channel layout, the signal chain, room treatment and calibration in the order that avoids rework.`,
    cards: [
      {
        index: '01',
        label: 'Living room / 5.1.2',
        title: 'Film in 16 to 20 m2',
        body: 'A shared room where the sofa cannot move far and the ceiling stays near 2.4 m. Budget goes to the front three, two subwoofers and the cable runs you can only bury once.',
        href: 'blog/small-room-5-1-2-system-plan/',
        points: ['3,000 EUR reference budget', 'Seat at 38 to 45 percent of room length', 'Target: under 6 dB bass variance'],
      },
      {
        index: '02',
        label: 'Two-channel / Hi-Fi',
        title: 'Music without a processor',
        body: 'Source, amplification, loudspeakers and the seat treated as one chain. Most of the audible change comes from geometry and the room, not from the most expensive box.',
        href: 'blog/two-channel-hifi-system-chain/',
        points: ['86 to 91 dB sensitivity band', '2.6 m listening triangle', 'Target: clean 102 dB peaks'],
      },
      {
        index: '03',
        label: 'Dedicated room / 7.1.4',
        title: 'A room you can treat',
        body: 'When the ceiling, walls and seat are yours to move, height channels, acoustic treatment and multi-subwoofer integration become predictable instead of hopeful.',
        href: 'blog/dolby-atmos-height-channels-explained/',
        points: ['2.3 to 3.0 m ceiling for up-firing', '30 to 55 degree height elevation', 'Target: stable object pans'],
      },
    ],
    links: [
      { label: 'Building a System', href: 'categories/system-building/' },
      { label: 'Home Theater', href: 'categories/home-theater/' },
      { label: 'Hi-Fi & Stereo', href: 'categories/hi-fi-stereo/' },
      { label: 'Room Acoustics', href: 'categories/room-acoustics/' },
      { label: 'Speakers & Components', href: 'categories/speakers-components/' },
      { label: 'Buying & Comparisons', href: 'categories/buying-comparisons/' },
      { label: 'Measurements & Method', href: 'categories/measurements-method/' },
    ],
    sections: [
      {
        heading: 'How to use these plans',
        paragraphs: ['Each plan is a reading order, not a shopping list. Start with the room measurement, then decide the channel layout, then choose hardware. Buying the receiver first is the most common way to end up with the wrong number of height channels and no cable to feed them.'],
        bullets: ['Measure the room and fix the seat before comparing any equipment.', 'Budget a quarter of the total for bass management and measurement.', 'Verify each stage with a sweep before moving to the next one.'],
      },
      {
        heading: 'Brand-neutral by design',
        paragraphs: ['These plans name categories, layouts and measurable targets. They do not rank models or recommend a manufacturer. Where a product appears in a test, it is one sample measured under stated conditions, and the failure cases are published with the results.'],
      },
    ],
  },
  about: {
    title: 'About SoundAndRoom',
    description: 'Who writes SoundAndRoom, how we measure, and how we correct mistakes. Authorship, methodology and update cadence in one place.',
    eyebrow: 'About us',
    intro: `${SITE.name} is an independent editorial library about high-end home audio, home theater, Hi-Fi loudspeakers and building complete AV systems. We are not a brand blog, a product catalogue or a dealer. Recommendations are derived from in-room measurements, with the method attached.`,
    sections: [
      { heading: 'Who is behind it', paragraphs: ['Every guide carries the SoundAndRoom Editors byline. Where a claim needs verification, a second editor checks the measurement and the method. The editorial desk, not a single personality, stands behind each published number.'] },
      { heading: 'How we test', paragraphs: ['Measurements are taken in-room at a stated microphone position, with a stated sweep level and smoothing. A frequency-range claim always ships with its tolerance. When a result depends on the room, we say so instead of presenting it as a product property.', 'We keep the failure cases. A guide that only reports success is a brochure, not a test.'] },
      { heading: 'What this site is not', paragraphs: ['It is not a single-brand product blog and there is no model database to maintain. Comparisons are between technical approaches, layouts and system decisions. A brand name may appear as a test sample, never as the organising principle of the library.'], bullets: ['No sponsored verdicts or paid placements in a ranking.', 'No "best speaker" list built from specification sheets alone.', 'No product line as a navigation category.'] },
      { heading: 'Correction policy', paragraphs: ['If a measurement or a sourced claim is wrong, we correct the article, change the last-updated date and add a note describing what changed. Corrections are never silent.'] },
    ],
  },
  'editorial-policy': {
    title: 'Editorial policy',
    description: 'Sourcing standards, brand-neutrality rules, affiliate disclosure, update cadence and the method behind every recommendation published on SoundAndRoom.',
    eyebrow: 'Editorial standards',
    intro: 'This page exists so readers and answer engines can check how the content is produced before they cite it.',
    sections: [
      { heading: 'Scope and independence', paragraphs: ['The library covers high-end home audio, home theater, two-channel Hi-Fi and system integration. It is not affiliated with a loudspeaker manufacturer, distributor or retailer. Topics are chosen from measurement questions and system-planning decisions, not from a product release calendar.'] },
      { heading: 'Brand-neutral comparisons', paragraphs: ['Comparisons contrast categories, layouts, technologies and measured behaviours. When a specific model is tested, we state the sample, the room, the microphone position and the conditions under which the result would change. A model name is never used as a section heading, a URL slug or a navigation item.'], bullets: ['At least two technical approaches are described for every buying decision.', 'Conditions that reverse the verdict are published with the verdict.', 'Failures and negative findings are not removed after publication.'] },
      { heading: 'Sourcing', paragraphs: ['Prefer primary sources: standards documents, manufacturer measurement notes and peer-reviewed acoustics literature. Every factual claim with a number should be traceable to a source listed at the end of the article.'] },
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
    description: 'Terms governing the use of SoundAndRoom content, including citation and reuse.',
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
