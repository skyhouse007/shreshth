import { useEffect, useState } from 'react';
import SEO from '../components/SEO.jsx';
import StaticProjectCard from '../components/StaticProjectCard.jsx';
import { api } from '../api/client.js';
import { mergePortfolioProjects } from '../utils/mergePortfolioProjects.js';

export default function Properties() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/site-projects');
        if (!cancelled) setItems(mergePortfolioProjects(data.items || []));
      } catch {
        if (!cancelled) setItems(mergePortfolioProjects([]));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SEO
        title="Projects"
        description="Shreshth Properties developments across India — upcoming and active projects with maps and inquiry."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <h1 className="heading-dlf font-display text-4xl font-semibold text-neutral-900 dark:text-white">Projects</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Explore the portfolio — developments with location context, an amenity gallery, and a short inquiry path.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <StaticProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
