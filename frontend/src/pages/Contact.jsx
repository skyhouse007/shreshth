import { useState } from 'react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO.jsx';
import { api } from '../api/client.js';
import { email as emailErr, required } from '../utils/validate.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const n = required(form.name, 'Name');
    if (n) e.name = n;
    const em = required(form.email, 'Email') || emailErr(form.email);
    if (em) e.email = em;
    const m = required(form.message, 'Message');
    if (m) e.message = m;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await api.post('/contact', form);
      toast.success('Message sent. We will respond within one business day.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Contact Shresth Properties in Bodh Gaya, Bihar — register interest in our upcoming 2 and 3 BHK project or request a private briefing."
      />
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 lg:px-8">
        <h1 className="heading-dlf font-display text-4xl font-semibold text-neutral-900 dark:text-white">Contact</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">We reply within one business day.</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <iframe
              title="Office map"
              className="h-96 w-full border-0"
              loading="lazy"
              src="https://maps.google.com/maps?q=Bodh%20Gaya%20Bihar&z=14&output=embed"
            />
          </div>
          <div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="heading-dlf font-display text-xl font-semibold text-neutral-900 dark:text-white">Company</h2>
              <address className="mt-4 not-italic text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Shresth Properties LLP
                <br />
                Experience center · Bodh Gaya
                <br />
                Bihar 824231 · India
                <br />
                <a className="text-gold hover:underline" href="tel:+919523048164">
                  +91 95230 48164
                </a>
                <br />
                <a className="text-gold hover:underline" href="mailto:support@shreshthinfratech.com">
                  support@shreshthinfratech.com
                </a>
              </address>
            </div>
            <form className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950" onSubmit={submit}>
              <div>
                <label className="text-xs font-medium text-neutral-500">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Phone</label>
                <input
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Message</label>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy hover:bg-gold-dark hover:text-navy-deep"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
