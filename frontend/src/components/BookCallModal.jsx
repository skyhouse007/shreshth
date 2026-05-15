import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/client.js';
import { email as emailErr, phone as phoneErr, required } from '../utils/validate.js';

const SOURCE_NAVBAR_BOOK = 'navbar-book-call';

export default function BookCallModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ name: '', email: '', phone: '', notes: '' });
    setErrors({});
    setSending(false);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => {
      document.getElementById('book-call-name')?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const validate = () => {
    const e = {};
    const nErr = required(form.name.trim(), 'Name');
    if (nErr) e.name = nErr;
    const em = required(form.email.trim(), 'Email') || emailErr(form.email.trim());
    if (em) e.email = em;
    const ph = required(form.phone.trim(), 'Phone') || phoneErr(form.phone.trim());
    if (ph) e.phone = ph;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await api.post('/leads', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.notes.trim() || 'Requested a callback via Book a call.',
        source: SOURCE_NAVBAR_BOOK,
      });
      toast.success('Thank you — our team will reach out shortly.');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-call-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="book-call-title" className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white">
                  Book a call
                </h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Share your details — we&apos;ll arrange a convenient time.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                className="rounded-full p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400" htmlFor="book-call-name">
                  Name
                </label>
                <input
                  id="book-call-name"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={form.name}
                  autoComplete="name"
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400" htmlFor="book-call-email">
                    Email
                  </label>
                  <input
                    id="book-call-email"
                    type="email"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    value={form.email}
                    autoComplete="email"
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400" htmlFor="book-call-phone">
                    Phone
                  </label>
                  <input
                    id="book-call-phone"
                    type="tel"
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    value={form.phone}
                    autoComplete="tel"
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400" htmlFor="book-call-notes">
                  Preferred time or notes{' '}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <textarea
                  id="book-call-notes"
                  rows={3}
                  placeholder="e.g. Weekday afternoons"
                  className="mt-1 w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-1">
                <button
                  type="button"
                  className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium dark:border-neutral-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-dark hover:text-navy-deep disabled:opacity-60"
                >
                  {sending ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
