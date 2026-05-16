import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CompareProvider } from './context/CompareContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Properties from './pages/Properties.jsx';
import ProjectDetailRouter from './components/ProjectDetailRouter.jsx';
import Contact from './pages/Contact.jsx';
import CalculatorsPage from './pages/Calculators.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import ComparePage from './pages/ComparePage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProperties from './pages/admin/AdminProperties.jsx';
import AdminPropertyForm from './pages/admin/AdminPropertyForm.jsx';
import AdminLeads from './pages/admin/AdminLeads.jsx';
import AdminMessages from './pages/admin/AdminMessages.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminAnnouncements from './pages/admin/AdminAnnouncements.jsx';
import AdminHero from './pages/admin/AdminHero.jsx';
import AdminSiteProjects from './pages/admin/AdminSiteProjects.jsx';
import AdminSiteProjectForm from './pages/admin/AdminSiteProjectForm.jsx';

function LegacyListingSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/projects/${slug}`} replace />;
}

function LegacyAdminProjectEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/admin/projects/${id}/edit`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CompareProvider>
          <FavoritesProvider>
            <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Properties />} />
                  <Route path="/projects/:slug" element={<ProjectDetailRouter />} />
                  <Route path="/properties" element={<Navigate to="/projects" replace />} />
                  <Route path="/properties/:slug" element={<LegacyListingSlugRedirect />} />
                  <Route path="/calculators" element={<CalculatorsPage />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="site-projects" element={<AdminSiteProjects />} />
                  <Route path="site-projects/new" element={<AdminSiteProjectForm />} />
                  <Route path="site-projects/:id/edit" element={<AdminSiteProjectForm />} />
                  <Route path="projects" element={<AdminProperties />} />
                  <Route path="projects/new" element={<AdminPropertyForm />} />
                  <Route path="projects/:id/edit" element={<AdminPropertyForm />} />
                  <Route path="properties" element={<Navigate to="/admin/projects" replace />} />
                  <Route path="properties/new" element={<Navigate to="/admin/projects/new" replace />} />
                  <Route path="properties/:id/edit" element={<LegacyAdminProjectEditRedirect />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="announcements" element={<AdminAnnouncements />} />
                  <Route path="hero" element={<AdminHero />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" />
          </FavoritesProvider>
        </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
