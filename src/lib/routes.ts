/** `/guides` and `/guides/page/3` are both handled by one rest-param route. */
export function parseGroupPage(slug: string | undefined): { key: string; page: number } | null {
  if (!slug) return null;
  const parts = slug.split('/').filter(Boolean);
  if (!parts.length) return null;
  const key = parts[0];
  if (parts.length === 1) return { key, page: 1 };
  if (parts.length === 3 && parts[1] === 'page' && /^\d+$/.test(parts[2])) {
    return { key, page: Number(parts[2]) };
  }
  return null;
}

/** `base` already ends with `/` (see `localePath`), so append straight to it. */
export function groupHref(base: string) {
  return (n: number) => (n <= 1 ? base : `${base}page/${n}/`);
}
