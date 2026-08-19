import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Bell, 
  LayoutDashboard, 
  Store, 
  RefreshCw, 
  Layers, 
  ChevronDown,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { useDropship, CURRENCIES } from '../context/DropshipContext';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    currency,
    setCurrencyCode,
    formatPrice,
    isSyncingAll,
    syncAllProducts,
    orders,
  } = useDropship();

  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'pending').length;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Geometric Identity */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveView('storefront')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    SHIP<span className="text-indigo-600">STREAM</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-200/60">
                    Auto-Sync
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                  Amazon • AliExpress • eBay Dropship
                </p>
              </div>
            </button>
          </div>

          {/* Center: Search Bar with Geometric Rounded-Full */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search products, SKUs, suppliers..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  id="header-clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Geometric Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Multi-Supplier Sync Button */}
            <button
              id="header-quick-sync-btn"
              onClick={syncAllProducts}
              disabled={isSyncingAll}
              title="Force Real-Time Multi-Supplier Inventory & Cost Sync"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Syncing...' : 'Sync Inventory'}</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200/80 transition-all"
              >
                <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{currency.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div
                  id="currency-dropdown-menu"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Currency
                  </div>
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      id={`currency-opt-${curr.code}`}
                      onClick={() => {
                        setCurrencyCode(curr.code);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currency.code === curr.code ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-bold">{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </span>
                      {currency.code === curr.code && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell Button */}
            <button
              id="header-notification-bell-btn"
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              aria-label="Push notifications & seasonal deals"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all group"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartCount === 0 ? 'Cart' : formatPrice(cartSubtotal)}
              </span>
            </button>

            {/* View Mode Switcher: Storefront vs Admin */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 ml-1">
              <button
                id="toggle-view-storefront-btn"
                onClick={() => setActiveView('storefront')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'storefront'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <button
                id="toggle-view-admin-btn"
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                  activeView === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin HQ</span>
                {pendingOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1 right-1" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="py-2.5 md:hidden border-t border-slate-200">
          <div className="relative">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers, SKUs..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </header>
  );
};
