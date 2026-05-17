import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      className="group overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-lg shadow-black/25"
    >
      <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
        {cover ? (
          <img
            src={cover}
            alt={title}
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
        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-6">
          <div>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold heading-dlf ${statusClass}`}
            >
              {project.statusLabel}
            </span>
            <h3
              data-theme-preserve
              className="mt-3 heading-dlf font-display text-2xl font-semibold text-white drop-shadow-md"
            >
              {title}
            </h3>
          </div>
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex w-full items-center justify-center rounded-none border border-white/85 bg-black/35 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-gold hover:bg-black/50 hover:text-gold"
          >
            View project
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
