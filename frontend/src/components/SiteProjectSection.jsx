/**
 * Full-bleed section: full viewport width background, content in max-w-6xl.
 * `themes[sectionKey]` may include `bg` and `text` (hex / CSS colors from admin).
 */
export default function SiteProjectSection({ sectionKey, themes, children, className = '' }) {
  const t = themes?.[sectionKey];
  const bg = typeof t?.bg === 'string' ? t.bg.trim() : '';
  const fg = typeof t?.text === 'string' ? t.text.trim() : '';

  const outerStyle = bg ? { backgroundColor: bg } : undefined;
  const innerStyle = fg ?
      ({
        color: fg,
        ['--site-project-fg']: fg,
      })
    : undefined;

  return (
    <section className={`w-full ${className}`} style={outerStyle}>
      <div
        className={`mx-auto w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8 ${fg ? 'site-project-section-themed' : ''}`}
        style={innerStyle}
      >
        {children}
      </div>
    </section>
  );
}
