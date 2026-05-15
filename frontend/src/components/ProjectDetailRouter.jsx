import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { isStaticProjectSlug } from '../data/staticProjects.js';
import PropertyDetail from '../pages/PropertyDetail.jsx';
import StaticProjectPage from '../pages/StaticProjectPage.jsx';
import SiteProjectDetailPage from '../pages/SiteProjectDetailPage.jsx';

export default function ProjectDetailRouter() {
  const { slug } = useParams();
  const [mode, setMode] = useState({ kind: 'loading', project: null });

  useEffect(() => {
    let cancelled = false;
    setMode({ kind: 'loading', project: null });
    (async () => {
      try {
        const { data } = await api.get(`/site-projects/${encodeURIComponent(slug)}`);
        const p = data?.project;
        if (!cancelled && p?.slug === slug) {
          setMode({ kind: 'site', project: p });
          return;
        }
      } catch {
        /* fall through */
      }
      if (cancelled) return;
      if (isStaticProjectSlug(slug)) setMode({ kind: 'static', project: null });
      else setMode({ kind: 'property', project: null });
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (mode.kind === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-neutral-500">Loading…</div>
    );
  }
  if (mode.kind === 'site') {
    return <SiteProjectDetailPage initialProject={mode.project} />;
  }
  if (mode.kind === 'static') return <StaticProjectPage />;
  return <PropertyDetail />;
}
