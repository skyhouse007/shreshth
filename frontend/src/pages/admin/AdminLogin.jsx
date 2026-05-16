import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ADMIN_AUTH_DISABLED } from '../../utils/constants.js';
import { email as emailErr, required } from '../../utils/validate.js';

export default function AdminLogin() {
  const { login, isAuthenticated, bootstrapping } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const authOffUnavailable = ADMIN_AUTH_DISABLED && !bootstrapping && !isAuthenticated;

  useEffect(() => {
    if (bootstrapping) return;
    if (isAuthenticated) navigate(ADMIN_AUTH_DISABLED ? '/admin/dashboard' : from, { replace: true });
  }, [bootstrapping, isAuthenticated, from, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const eMap = {};
    const em = required(email, 'Email') || emailErr(email);
    if (em) eMap.email = em;
    if (required(password, 'Password')) eMap.password = required(password, 'Password');
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin login" />
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-neutral-50 px-4 py-16 dark:bg-neutral-950">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h1 className="heading-dlf font-display text-2xl font-semibold text-neutral-900 dark:text-white">Admin login</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Shresth Properties internal dashboard.
          </p>
          {ADMIN_AUTH_DISABLED && bootstrapping ? (
            <p className="mt-8 text-center text-sm text-neutral-500">Opening admin…</p>
          ) : null}
          {authOffUnavailable ? (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              Login is turned off, but the admin API did not respond or no admin exists in the database. Start the backend, set
              <code className="mx-1 rounded bg-amber-100 px-1 dark:bg-amber-900/60">ADMIN_AUTH_DISABLED=true</code> there, and ensure at least one admin (run the seed script).
            </p>
          ) : null}
          {!ADMIN_AUTH_DISABLED || (!bootstrapping && !authOffUnavailable) ? (
            <form className="mt-8 space-y-4" onSubmit={submit}>
              <div>
                <label className="text-xs font-medium text-neutral-500">Email</label>
                <input
                  type="email"
                  autoComplete="username"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>
              <button
                type="submit"
                disabled={loading || ADMIN_AUTH_DISABLED}
                className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-navy hover:bg-gold-dark hover:text-navy-deep disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          ) : null}
          <p className="mt-6 text-center text-xs text-neutral-500">
            <Link to="/" className="text-gold hover:underline">
              Back to website
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
