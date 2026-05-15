import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bath, Bed, Heart, Maximize2, MapPin, Scale } from 'lucide-react';
import { formatPrice, statusBadgeClass, statusLabel } from '../utils/constants.js';
import { useCompare } from '../context/CompareContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function PropertyCard({ property, index = 0 }) {
  const img = property.images?.[0];
  const { ids, toggleCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();
  const id = property._id;
  const inCompare = ids.includes(id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {img ? (
          <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">No image</div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold heading-dlf text-white">
            {property.purpose === 'rent' ? 'Rent' : 'Sale'}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusBadgeClass(property.status)}`}>
            {statusLabel(property.status)}
          </span>
          {property.featured ? (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-navy">Featured</span>
          ) : null}
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(id)}
            className="rounded-full bg-white/90 p-2 text-neutral-800 shadow backdrop-blur hover:bg-white dark:bg-black/70 dark:text-white"
            aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-4 w-4 ${isFavorite(id) ? 'fill-gold text-gold' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(id)}
            className="rounded-full bg-white/90 p-2 text-neutral-800 shadow backdrop-blur hover:bg-white dark:bg-black/70 dark:text-white"
            aria-label="Add to compare"
            title={inCompare ? 'Remove from compare' : 'Add to compare (keeps last 3)'}
          >
            <Scale className={`h-4 w-4 ${inCompare ? 'text-gold' : ''}`} />
          </button>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="heading-dlf font-display text-xl font-semibold leading-snug text-neutral-900 dark:text-white">{property.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin className="h-4 w-4 text-gold" />
            {property.city}, {property.state}
          </p>
        </div>
        <p className="font-sans text-2xl font-bold tabular-nums text-gold-dark dark:text-gold">{formatPrice(property.price, property.purpose)}</p>
        <div className="flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          {property.type !== 'plot' ? (
            <>
              <span className="inline-flex items-center gap-1">
                <Bed className="h-4 w-4 text-gold" />
                {property.bedrooms} beds
              </span>
              <span className="inline-flex items-center gap-1">
                <Bath className="h-4 w-4 text-gold" />
                {property.bathrooms} baths
              </span>
            </>
          ) : (
            <span className="text-neutral-500">Plot</span>
          )}
          <span className="inline-flex items-center gap-1">
            <Maximize2 className="h-4 w-4 text-gold" />
            {property.area?.toLocaleString('en-IN')} sqft
          </span>
          <span className="capitalize">{property.type}</span>
        </div>
        <Link
          to={`/projects/${property.slug}`}
          className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold/10 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-gold hover:text-navy dark:text-white dark:hover:text-navy-deep"
        >
          View details
        </Link>
      </div>
    </motion.article>
  );
}
