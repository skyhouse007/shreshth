/**
 * Full-width (edge-to-edge) image strips between portfolio sections.
 */
export default function SiteProjectSectionBreak({ images }) {
  const list = (Array.isArray(images) ? images : []).filter((i) => i?.src?.trim());
  if (!list.length) return null;

  return (
    <section
      className="w-full overflow-hidden border-y border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950"
      aria-label="Project gallery"
    >
      <div className="flex w-full flex-col">
        {list.map((img, i) => (
          <figure
            key={`${img.src}-${i}`}
            className={`w-full ${i < list.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-800' : ''}`}
          >
            <img
              src={img.src.trim()}
              alt={typeof img.alt === 'string' ? img.alt : ''}
              width={1920}
              height={820}
              sizes="100vw"
              className="block aspect-video w-full object-cover object-center md:aspect-[2.35/1]"
              loading="lazy"
              decoding="async"
            />
            {img.alt?.trim() ? (
              <figcaption className="px-4 py-3 text-center text-xs text-neutral-600 dark:text-neutral-400 md:py-4">
                {img.alt.trim()}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
