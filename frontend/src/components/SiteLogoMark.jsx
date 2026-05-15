/** Brand mark served from `public/logo-shresth.png`. */
const LOGO_SRC = '/logo-shresth.png';

export default function SiteLogoMark({ className = 'h-[5.5rem] w-auto shrink-0 object-contain' }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Shreshth Infratech & Enterprises LLP"
      className={className}
      decoding="async"
    />
  );
}
