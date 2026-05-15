import { Plus, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

function emptyImg() {
  return { src: '', alt: '' };
}

/**
 * Manage one keyed slot in site project `sectionBreakImages` (shown on public page after that section).
 */
export default function SectionBreakImagesEditor({
  title,
  subtitle,
  sectionKey,
  images,
  onChange,
  uploadFile,
  isUploading,
  setUploadingKey,
}) {
  const list = Array.isArray(images) ? images : [];

  const patchList = (next) => onChange(next);

  return (
    <section className="space-y-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-4 dark:border-violet-900/40 dark:bg-violet-950/25">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-800 dark:text-violet-200">
            Images after · {title}
          </h3>
          <p className="mt-0.5 max-w-xl text-[11px] leading-snug text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          className="text-[11px] font-medium text-gold hover:underline"
          onClick={() => patchList([...list, emptyImg()])}
        >
          <span className="inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> Add image
          </span>
        </button>
      </div>
      {list.length === 0 ? (
        <p className="text-[11px] text-neutral-500">No extra images — add one to show a strip on the site.</p>
      ) : (
        <div className="space-y-3">
          {list.map((img, i) => (
            <div
              key={`${sectionKey}-${i}-${img.src || 'blank'}`}
              className="flex flex-col gap-2 rounded-xl border border-neutral-200/90 bg-white/80 p-3 dark:border-neutral-700 dark:bg-neutral-950/80 sm:flex-row sm:items-start"
            >
              <div className="flex shrink-0 gap-2">
                {img.src ? (
                  <img
                    src={img.src}
                    alt=""
                    className="h-20 w-28 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
                  />
                ) : (
                  <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-[10px] text-neutral-500 dark:border-neutral-600">
                    No file
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`break-upload-${sectionKey}-${i}`}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    const key = `break-${sectionKey}-${i}`;
                    setUploadingKey(key);
                    try {
                      const url = await uploadFile(file);
                      if (url) {
                        const next = [...list];
                        next[i] = { ...next[i], src: url };
                        patchList(next);
                      }
                      toast.success('Uploaded to Cloudinary');
                    } catch (err) {
                      toast.error(err.message);
                    } finally {
                      setUploadingKey(null);
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUploading(`break-${sectionKey}-${i}`)}
                    onClick={() => document.getElementById(`break-upload-${sectionKey}-${i}`)?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-2.5 py-1 text-[11px] dark:border-neutral-700"
                  >
                    <Upload className="h-3 w-3" />
                    {isUploading(`break-${sectionKey}-${i}`) ? 'Uploading…' : img.src ? 'Replace' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] text-red-600"
                    onClick={() => patchList(list.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
                <label className="block text-[10px] text-neutral-500">
                  Caption / alt (optional)
                  <input
                    className="mt-0.5 w-full rounded border border-neutral-200 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                    value={img.alt}
                    onChange={(e) => {
                      const next = [...list];
                      next[i] = { ...img, alt: e.target.value };
                      patchList(next);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
