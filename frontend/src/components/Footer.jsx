import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import SiteLogoMark from './SiteLogoMark.jsx';
import { ADMIN_AUTH_DISABLED } from '../utils/constants.js';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface dark:border-white/10 dark:bg-navy/25">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <SiteLogoMark className="h-24 w-auto max-h-24 max-w-[520px] shrink-0 object-contain" />
            <span className="heading-dlf font-display text-xl font-semibold">Shresth Properties</span>
          </div>
          <p className="max-w-xs text-sm text-neutral-600 dark:text-neutral-400">
            Calm residential advisory in Bodh Gaya — an upcoming 2 and 3 BHK project, discreet previews, and transparent
            counsel from first conversation to registration.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold heading-dlf text-gold">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/projects" className="text-neutral-700 hover:text-gold dark:text-neutral-300">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-neutral-700 hover:text-gold dark:text-neutral-300">
                About us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-neutral-700 hover:text-gold dark:text-neutral-300">
                Blog · calculator guides
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-neutral-700 hover:text-gold dark:text-neutral-300">
                Contact
              </Link>
            </li>
            <li>
              <Link
                to={ADMIN_AUTH_DISABLED ? '/admin/dashboard' : '/admin/login'}
                className="text-neutral-700 hover:text-gold dark:text-neutral-300"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold heading-dlf text-gold">Visit</h3>
          <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>Experience center · Bodh Gaya 824231, Bihar</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="tel:+919523048164" className="hover:text-gold">
                +91 95230 48164
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href="mailto:support@shreshthinfratech.com" className="hover:text-gold">
                support@shreshthinfratech.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
        © {new Date().getFullYear()} Shresth Properties. All rights reserved.
      </div>
    </footer>
  );
}
