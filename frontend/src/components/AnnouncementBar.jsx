import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function AnnouncementBar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/announcements');
        const list = Array.isArray(data?.announcements) ? data.announcements : [];
        if (!cancelled) setItems(list.filter((t) => typeof t === 'string' && t.trim().length > 0));
      } catch (err) {
        if (import.meta.env.DEV) console.warn('[AnnouncementBar] Could not load announcements:', err.message);
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items.length) return null;

  const segment = items.join('          •          ');

  return (
    <div
      className="relative border-b border-navy/15 bg-gold/95 text-navy dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--color-navy-deep)_88%,var(--color-gold)_12%)] dark:text-[#ebe6dc]"
      role="region"
      aria-label="Site announcements"
    >
      <div className="overflow-hidden py-2">
        <div className="announcement-marquee-static flex justify-center px-4 text-center md:hidden">
          <p className="text-xs font-medium leading-snug">{segment}</p>
        </div>
        <div className="announcement-marquee-wrap hidden md:block">
          <div className="announcement-marquee-track flex w-max">
            <span className="shrink-0 px-8 text-sm font-medium">{segment}</span>
            <span className="shrink-0 px-8 text-sm font-medium" aria-hidden="true">
              {segment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
