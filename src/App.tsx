import React from 'react';
import { DropshipProvider, useDropship } from './context/DropshipContext';
import { Header } from './components/Header';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeView } = useDropship();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header />

      {/* Main View Switcher: Storefront vs Admin HQ */}
      {activeView === 'storefront' ? <Storefront /> : <AdminDashboard />}

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <NotificationCenter />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <DropshipProvider>
      <AppContent />
    </DropshipProvider>
  );
}
