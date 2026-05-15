import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import WhatsAppFloat from './WhatsAppFloat.jsx';
import AnnouncementBar from './AnnouncementBar.jsx';

function hidePublicHeader(pathname) {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return normalized === '/projects' || normalized.startsWith('/projects/');
}

export default function PublicLayout() {
  const { pathname } = useLocation();
  const noHeader = hidePublicHeader(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-navy-deep">
      {!noHeader ? (
        <div className="sticky top-0 z-40 bg-white dark:bg-navy-deep">
          <AnnouncementBar />
          <Navbar />
        </div>
      ) : null}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
