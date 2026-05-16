import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Home as HomeIcon,
  PanelLeft,
  Settings,
  Building2,
  Bell,
  Megaphone,
  ImagePlus,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { ADMIN_AUTH_DISABLED } from '../utils/constants.js';
import SiteLogoMark from './SiteLogoMark.jsx';
import WhatsAppFloat from './WhatsAppFloat.jsx';
import { api } from '../api/client.js';

const nav = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/site-projects', label: 'Portfolio', icon: Layers },
  { to: '/admin/projects', label: 'Listings', icon: Building2 },
  { to: '/admin/leads', label: 'Leads', icon: Inbox },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/hero', label: 'Hero images', icon: ImagePlus },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notif, setNotif] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        if (!cancelled) setNotif(data.notificationCount || 0);
      } catch {
        if (!cancelled) setNotif(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 shrink-0 border-r border-neutral-200 bg-white transition-transform dark:border-neutral-800 dark:bg-neutral-900 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex min-h-[7rem] items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <button
              type="button"
              className="flex min-w-0 items-center gap-2"
              onClick={() => navigate('/')}
            >
              <SiteLogoMark className="h-[5.5rem] w-auto max-h-[5.5rem] max-w-full shrink-0 object-contain" />
              <span className="heading-dlf font-display text-lg font-semibold">Admin</span>
            </button>
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 p-3">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold/15 text-gold'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <HomeIcon className="h-4 w-4" />
              View site
            </button>
            {!ADMIN_AUTH_DISABLED ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            ) : null}
          </nav>
        </aside>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-20 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-20 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2"
              onClick={() => navigate('/admin/leads')}
              aria-label="Notifications"
              title="Inbox"
            >
              <span className="relative inline-flex">
                <Bell className="h-5 w-5" />
                {notif > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">
                    {notif > 9 ? '9+' : notif}
                  </span>
                ) : null}
              </span>
            </button>
            <div className="flex items-center gap-2">
              <SiteLogoMark className="h-20 w-auto max-h-20 max-w-[440px] shrink-0 object-contain" />
              <h1 className="heading-dlf font-display text-lg font-semibold">Shresth Properties</h1>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
      <WhatsAppFloat message="Hello from Shresth Properties admin." />
    </div>
  );
}
