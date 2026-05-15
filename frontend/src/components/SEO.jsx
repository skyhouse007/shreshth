import { useEffect } from 'react';

const DEFAULT_DESC =
  'Shresth Properties — Bodh Gaya, Bihar: upcoming 2 and 3 BHK homes plus curated residential and land advisory across India.';

export default function SEO({ title, description, path = '' }) {
  useEffect(() => {
    const site = 'Shresth Properties';
    const fullTitle = title ? `${title} | ${site}` : site;
    document.title = fullTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description || DEFAULT_DESC);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description || DEFAULT_DESC);

    if (typeof window !== 'undefined' && path) {
      const url = `${window.location.origin}${path}`;
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', url);
    }
  }, [title, description, path]);

  return null;
}
