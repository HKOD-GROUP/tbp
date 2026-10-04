/** Génère un slug URL à partir d'un titre : minuscules, sans accents, tirets. */
export function generateSlug(title: string): string {
  const COMBINING_DIACRITICS = new RegExp('[̀-ͯ]', 'g');
  return title
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
