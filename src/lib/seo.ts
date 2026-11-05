import { SITE, absoluteUrl } from '../config/site';

export function fullTitle(title: string, opts: { appendSiteName?: boolean } = {}): string {
  if (opts.appendSiteName === false) return title;
  if (title.includes(SITE.name)) return title;
  return `${title} | ${SITE.name}`;
}

export function clampDescription(description: string, max = 165): string {
  const clean = description.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export function ogImage(path?: string): string {
  return absoluteUrl(path || SITE.defaultOgImage);
}

export const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
