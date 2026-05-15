/** Keys match `sectionThemes` on SiteProject (backend). */
export const SITE_PROJECT_SECTION_THEMES = [
  { key: 'hero', label: 'Hero / image carousel' },
  { key: 'intro', label: 'Title, headline & about' },
  { key: 'projectOverview', label: 'Project overview (stats table)' },
  { key: 'residences', label: 'Available residences (table)' },
  { key: 'amenities', label: 'Amenities list' },
  { key: 'amenityImages', label: 'Amenity Gallery (grid)' },
  { key: 'location', label: 'Map & nearest places' },
  { key: 'inquiry', label: 'Book a site visit form' },
  { key: 'otherDevelopments', label: 'Other developments' },
];

export const SITE_PROJECT_SECTION_KEYS = SITE_PROJECT_SECTION_THEMES.map((s) => s.key);

export function emptySectionBreakImages() {
  return SITE_PROJECT_SECTION_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});
}

/** Load API `sectionBreakImages` into canonical form state (all keys, { src, alt } rows). */
export function sectionBreakImagesFromApi(raw) {
  const base = emptySectionBreakImages();
  if (!raw || typeof raw !== 'object') return base;
  for (const key of SITE_PROJECT_SECTION_KEYS) {
    const arr = raw[key];
    if (!Array.isArray(arr)) continue;
    base[key] = arr.map((i) => ({
      src: typeof i?.src === 'string' ? i.src : '',
      alt: typeof i?.alt === 'string' ? i.alt : '',
    }));
  }
  return base;
}
