import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useCompare } from '../context/CompareContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import SiteLogoMark from './SiteLogoMark.jsx';
import BookCallModal from './BookCallModal.jsx';

const iconBtn =
  'rounded-full p-2 text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-navy-deep';

const subNavLinkClass = ({ isActive }) =>
  `-mb-px inline-flex items-center border-b-2 pb-2 text-xs font-bold uppercase tracking-[0.14em] heading-dlf transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-deep ${
    isActive
      ? 'border-wine text-neutral-900 dark:border-gold dark:text-white'
      : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-white'
  }`;

const bookCallBtnMd =
  'rounded-none bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-navy dark:text-white dark:hover:bg-navy-deep dark:focus-visible:ring-offset-navy-deep';

const bookCallBtnSm =
  'max-w-[5.75rem] shrink-0 truncate rounded-none bg-navy px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-navy dark:text-white dark:hover:bg-navy-deep dark:focus-visible:ring-offset-navy-deep sm:max-w-none sm:px-3';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const { ids: compareIds } = useCompare();
  const { ids: favIds } = useFavorites();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/calculators', label: 'Calculators' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  const openBookFromMenu = () => {
    setOpen(false);
    setBookOpen(true);
  };

  return (
    <>
      <header className="relative z-40 border-b border-border bg-white text-neutral-900 dark:border-white/10 dark:bg-navy-deep dark:text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-0 md:px-6 lg:px-8">
          <NavLink
            to="/"
            className="flex min-w-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-deep"
          >
            <SiteLogoMark className="h-28 w-auto max-h-28 max-w-[min(680px,94vw)] shrink-0 object-contain md:h-32 md:max-h-32 md:max-w-[min(760px,90vw)]" />
          </NavLink>

          <div className="hidden items-center gap-3 md:flex">
            <button type="button" className={bookCallBtnMd} onClick={() => setBookOpen(true)}>
              Book a call
            </button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button type="button" className={bookCallBtnSm} onClick={() => setBookOpen(true)}>
              Book a call
            </button>
            <button type="button" className={iconBtn} aria-label="Open menu" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="hidden border-t border-border dark:border-white/10 md:block">
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
            <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 py-2.5" aria-label="Primary">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={subNavLinkClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {open && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 w-[min(100%,320px)] border-l border-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-navy-deep md:hidden"
            >
              <div className="mb-6 flex items-center justify-between text-neutral-900 dark:text-neutral-100">
                <span className="heading-dlf font-display text-lg font-semibold">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="rounded-sm p-1 text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-navy-deep"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-lg font-bold heading-dlf text-neutral-800 dark:text-neutral-100"
                  >
                    {l.label}
                  </NavLink>
                ))}
                <button type="button" className="text-left text-lg font-medium text-gold" onClick={openBookFromMenu}>
                  Book a call
                </button>
                <button
                  type="button"
                  className="text-left text-lg font-medium text-neutral-800 dark:text-neutral-100"
                  onClick={() => {
                    setOpen(false);
                    navigate('/compare');
                  }}
                >
                  Compare {compareIds.length ? `(${compareIds.length})` : ''}
                </button>
                <button
                  type="button"
                  className="text-left text-lg font-medium text-neutral-800 dark:text-neutral-100"
                  onClick={() => {
                    setOpen(false);
                    navigate('/favorites');
                  }}
                >
                  Favorites {favIds.length ? `(${favIds.length})` : ''}
                </button>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>
      </header>

      <BookCallModal open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
