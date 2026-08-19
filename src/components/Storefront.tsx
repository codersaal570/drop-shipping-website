import React, { useState } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  Layers,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { useDropship } from '../context/DropshipContext';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { SeasonalPromoBanner } from './SeasonalPromoBanner';

export const Storefront: React.FC = () => {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedSupplier,
    selectedCategory,
    setSelectedCategory,
    resetFilters,
  } = useDropship();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const quickCategories = [
    'All Categories',
    'Smart Home',
    'Audio & Desk Gear',
    'Health & Fitness',
    'Travel & Comfort',
    'Kitchen & Coffee',
    'Lighting & Decor',
  ];

  return (
    <div id="storefront-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Seasonal Promo Notification Banner */}
        <SeasonalPromoBanner />

        {/* Hero Section & Sourcing Metrics */}
        <section className="border-b border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Automated Multi-Supplier Sourcing Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Curated Electronics & Gadgets, Dropshipped Direct
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                Verified listings from AliExpress, Amazon FBA, and eBay with real-time stock sync, auto-fulfillment, and seamless multi-region checkout via Credit Card and Mobile Money.
              </p>
            </div>

            {/* Sourcing Metrics Grid (Geometric Stat Cards) */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center shrink-0">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm min-w-[100px]">
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                  Live
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">100%</h3>
                <span className="text-[11px] text-slate-500 font-medium block">Synced Stock</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm min-w-[100px]">
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block">
                  Express
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">2-4 Days</h3>
                <span className="text-[11px] text-slate-500 font-medium block">Fulfillment</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm min-w-[100px]">
                <p className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded inline-block">
                  Global
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">6+ Gateways</h3>
                <span className="text-[11px] text-slate-500 font-medium block">Cards & MoMo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Category Chips bar */}
        <section className="border-b border-slate-200 bg-white/80 sticky top-20 z-20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 text-xs">
              {quickCategories.map((cat) => {
                const isSelected =
                  (cat === 'All Categories' && selectedCategory === 'All') || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`quick-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat === 'All Categories' ? 'All' : cat)}
                    className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Toggle button */}
            <button
              id="mobile-filter-drawer-btn"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filters</span>
            </button>
          </div>
        </section>

        {/* Main Content Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-36">
                <FilterSidebar />
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center">
                <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 relative shadow-2xl">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 font-bold"
                  >
                    ✕
                  </button>
                  <FilterSidebar />
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Product Catalog Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Active Search & Filter Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-600">
                  Showing <strong className="text-slate-900 font-mono font-bold">{filteredProducts.length}</strong>{' '}
                  products
                  {selectedSupplier !== 'all' && (
                    <span>
                      {' '}
                      from <strong className="capitalize text-indigo-600 font-bold">{selectedSupplier}</strong>
                    </span>
                  )}
                  {searchQuery && (
                    <span>
                      {' '}
                      matching &ldquo;<span className="text-indigo-600 font-semibold">{searchQuery}</span>&rdquo;
                    </span>
                  )}
                </div>

                {(searchQuery || selectedSupplier !== 'all' || selectedCategory !== 'All') && (
                  <button
                    id="catalog-clear-all-filters-btn"
                    onClick={resetFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <Search className="w-12 h-12 mx-auto opacity-30 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-800">No products found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your keyword, supplier filters, or price range parameters to discover live synced items.
                  </p>
                  <button
                    id="catalog-empty-reset-btn"
                    onClick={resetFilters}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Trust & Payment Gateways Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Automated Order Fulfillment</h4>
                <p className="text-slate-500 text-[11px]">Instant dispatch to AliExpress, Amazon FBA, & eBay</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Real-Time Inventory & Price Sync</h4>
                <p className="text-slate-500 text-[11px]">Zero stockout errors with automated margin guard</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Global Payment Coverage</h4>
                <p className="text-slate-500 text-[11px]">Cards, M-Pesa, MTN MoMo, Airtel, Apple Pay & PayPal</p>
              </div>
            </div>
          </div>

          {/* Payment Badges & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider">Payment Gateways:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                💳 Visa / Mastercard
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                📱 M-Pesa Express
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800">
                🟡 MTN MoMo
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
                🅿️ PayPal
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                🍎 Apple Pay
              </span>
            </div>

            <p className="text-slate-400 text-[11px]">
              © {new Date().getFullYear()} SHIPSTREAM Dropship Hub. All supplier APIs synchronized.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
