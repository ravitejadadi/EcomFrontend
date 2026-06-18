import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ComingSoonPage from './pages/ComingSoonPage';

// Real Pages
import ContactPage from './pages/ContactPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import SizeGuidePage from './pages/SizeGuidePage';
import FAQsPage from './pages/FAQsPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import WishlistPage from './pages/WishlistPage';

// Admin Imports
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminOrders from './admin/pages/AdminOrders';
import AdminUsers from './admin/pages/AdminUsers';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
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
      </Router>
    </CartProvider>
  );
}

export default App;
