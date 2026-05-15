import { siteProjectBadgeClass, siteProjectGradientClass } from './siteProjectUi.js';

/** Map API site-project to props expected by StaticProjectCard. */
export function mapSiteProjectForCard(api) {
  if (!api) return null;
  return {
    ...api,
    title: api.name,
    statusClass: siteProjectBadgeClass(api.statusVariant),
    gradientClass: siteProjectGradientClass(api.statusVariant),
  };
}

/** Only projects from the admin portfolio (GET /site-projects — published entries). */
export function mergePortfolioProjects(siteItems = []) {
  return siteItems.map(mapSiteProjectForCard).filter(Boolean);
}
