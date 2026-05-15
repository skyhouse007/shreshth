import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { siteProjectBadgeClass, siteProjectGradientClass } from '../utils/siteProjectUi.js';

export default function StaticProjectCard({ project, index = 0 }) {
  const title = project.title ?? project.name ?? 'Project';
  const statusClass =
    project.statusClass ?? siteProjectBadgeClass(project.statusVariant);
  const gradientClass =
    project.gradientClass ?? siteProjectGradientClass(project.statusVariant);
  const cover = typeof project.coverImage === 'string' ? project.coverImage.trim() : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
            aria-hidden
          />
        )}
        {cover ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" aria-hidden />
        ) : null}
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold heading-dlf ${statusClass}`}
            >
              {project.statusLabel}
            </span>
            <h3 className="mt-3 heading-dlf font-display text-2xl font-semibold text-white drop-shadow-md">
              {title}
            </h3>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
          <MapPin className="h-4 w-4 shrink-0 text-gold" />
          {project.shortLabel}
        </p>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{project.headline}</p>
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold/10 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-gold hover:text-navy dark:text-white dark:hover:text-navy-deep"
        >
          View project
        </Link>
      </div>
    </motion.article>
  );
}
