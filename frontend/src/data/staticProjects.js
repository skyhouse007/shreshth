/** Curated developments shown on /projects — not backed by the properties API. */
export const STATIC_PROJECTS = [
  {
    slug: 'bodhgaya-upcoming',
    title: 'Upcoming — Bodh Gaya',
    shortLabel: 'Bodh Gaya, Bihar',
    headline: 'A landmark residential launch in Bodh Gaya',
    statusLabel: 'Upcoming',
    statusClass:
      'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100',
    gradientClass:
      'from-violet-950/90 via-neutral-900/80 to-amber-900/70',
    mapQuery: 'Bodh Gaya, Bihar, India',
    description: `Our Bodh Gaya chapter is in advanced planning: a calm, well-connected address minutes from the sacred Mahabodhi precinct, with architecture tuned for serenity and everyday comfort.

Register for early briefings on inventory, indicative timelines, and indicative pricing as approvals progress.`,
  },
  {
    slug: 'shreshth-hearty-homes-bangalore',
    title: 'Shreshth Hearty Homes',
    shortLabel: 'Hobli, South Bengaluru',
    headline: 'Hearty Homes in South Bengaluru’s Hobli belt',
    statusLabel: 'Launching',
    statusClass: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100',
    gradientClass: 'from-emerald-950/90 via-neutral-900/80 to-teal-900/70',
    mapQuery: 'Hobli, South Bengaluru, Karnataka, India',
    description: `Shreshth Hearty Homes brings together generous planning and Bengaluru’s garden-city rhythm — set in the Hobli micro-market in South Bangalore, with access to IT corridors, schools, and healthcare.

Explore floor plans, amenities deck, and possession roadmap with our on-site sales studio.`,
    highlights: [
      'South Bengaluru location — Hobli — with improving arterial connectivity',
      'Family-first layouts with amenity spine and active podium / landscape',
      'Transparent milestones from agreement to handover',
    ],
  },
  {
    slug: 'krishna-villas-jaipur',
    title: 'Krishna Villas',
    shortLabel: 'Siroli, Jaipur',
    headline: 'Spacious villas at Siroli, Jaipur',
    statusLabel: 'Now selling',
    statusClass: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
    gradientClass: 'from-amber-950/90 via-rose-900/80 to-orange-950/70',
    mapQuery: 'Siroli, Jaipur, Rajasthan, India',
    description: `Krishna Villas is a boutique villa community in Siroli, Jaipur — low-rise living, private greens, and room to grow for multi-generational families.

Request a site visit for available typologies, boundary walls, and club / security provisions.`,
  },
];

const bySlug = Object.fromEntries(STATIC_PROJECTS.map((p) => [p.slug, p]));

export function getStaticProjectBySlug(slug) {
  if (!slug || typeof slug !== 'string') return undefined;
  return bySlug[slug];
}

export function isStaticProjectSlug(slug) {
  return Boolean(getStaticProjectBySlug(slug));
}
