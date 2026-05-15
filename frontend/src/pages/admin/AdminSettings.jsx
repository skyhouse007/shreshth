import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO.jsx';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { required, minLength } from '../../utils/validate.js';

export default function AdminSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    const eMap = {};
    const n = required(name, 'Name');
    if (n) eMap.name = n;
    if (password && minLength(password, 4, 'Password')) eMap.password = minLength(password, 4, 'Password');
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    setSaving(true);
    try {
      const payload = { name, phone };
      if (password.length >= 4) payload.password = password;
      await api.patch('/admin/me', payload);
      toast.success('Profile updated');
      setPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="Admin settings" />
      <h1 className="heading-dlf font-display text-2xl font-semibold">Settings</h1>
      <form className="mt-8 max-w-md space-y-4" onSubmit={submit}>
        <div>
          <label className="text-xs font-medium text-neutral-500">Name</label>
          <input className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Email</label>
          <input disabled className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900" value={user?.email || ''} />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Phone</label>
          <input className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">New password (optional)</label>
          <input
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>
        <button type="submit" disabled={saving} className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-dark hover:text-navy-deep disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </>
  );
}
