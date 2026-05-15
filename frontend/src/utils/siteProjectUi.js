/** Badge styles for CMS portfolio projects — matches Tailwind variants stored in DB. */
const VARIANT_CLASSES = {
  violet:
    'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100',
  emerald:
    'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100',
  amber:
    'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
  rose: 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100',
  neutral:
    'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
};

const VARIANT_GRADIENTS = {
  violet: 'from-violet-950/90 via-neutral-900/80 to-amber-900/70',
  emerald: 'from-emerald-950/90 via-neutral-900/80 to-teal-900/70',
  amber: 'from-amber-950/90 via-rose-900/80 to-orange-950/70',
  rose: 'from-rose-950/90 via-neutral-900/80 to-orange-950/70',
  neutral: 'from-neutral-950/95 via-neutral-900/85 to-neutral-800/75',
};

export const SITE_PROJECT_STATUS_VARIANTS = Object.keys(VARIANT_CLASSES);

export function siteProjectBadgeClass(statusVariant) {
  return VARIANT_CLASSES[statusVariant] || VARIANT_CLASSES.violet;
}

export function siteProjectGradientClass(statusVariant) {
  return VARIANT_GRADIENTS[statusVariant] || VARIANT_GRADIENTS.violet;
}
