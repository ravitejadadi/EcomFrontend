import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';

// Lazy-loaded page routes for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const WomensPage = lazy(() => import('./pages/WomensPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));

// Support Pages
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'));
const FAQsPage = lazy(() => import('./pages/FAQsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

// Admin Imports (lazy)
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'));
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'));
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'));

// Minimal loading fallback — avoids layout shift
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handler = (e) => navigate(e.detail.isAdmin ? '/admin/login' : '/auth');
    window.addEventListener('auth:session-expired', handler);
    return () => window.removeEventListener('auth:session-expired', handler);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/women" element={<WomensPage />} />
            <Route path="/collections/:category" element={<CollectionPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Support Pages */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Coming Soon Routes */}
            <Route path="/company" element={<ComingSoonPage title="Company" />} />
            <Route path="/news" element={<ComingSoonPage title="Corporate News" />} />
            <Route path="/investors" element={<ComingSoonPage title="Investors" />} />
            <Route path="/sustainability" element={<ComingSoonPage title="Sustainability" />} />
            <Route path="/careers" element={<ComingSoonPage title="Careers" />} />
            <Route path="/app" element={<ComingSoonPage title="THE ELEGANT App" />} />
            <Route path="/stores" element={<ComingSoonPage title="THE ELEGANT Stores" />} />
            <Route path="/student" element={<ComingSoonPage title="Student Discount" />} />
            <Route path="/gift-cards" element={<ComingSoonPage title="Gift Cards" />} />
            <Route path="/promotions" element={<ComingSoonPage title="Promotions" />} />
            <Route path="/cookies" element={<ComingSoonPage title="Cookie Settings" />} />
            <Route path="/imprint" element={<ComingSoonPage title="Imprint" />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={
              <div className="container-custom py-20 text-center animate-fade-in">
                <h1 className="text-4xl font-display font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-neutral-600 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CartDrawer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          }}
        />
      </Router>
    </CartProvider>
  );
}

export default App;
