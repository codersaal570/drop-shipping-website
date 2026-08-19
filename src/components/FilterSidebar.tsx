import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Zap 
} from 'lucide-react';
import { useDropship } from '../context/DropshipContext';
import { SupplierType } from '../types';

export const FilterSidebar: React.FC = () => {
  const {
    products,
    selectedSupplier,
    setSelectedSupplier,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    deliveryFilter,
    setDeliveryFilter,
    sortBy,
    setSortBy,
    resetFilters,
    formatPrice,
  } = useDropship();

  // Extract unique categories
  const categories: string[] = ['All', ...Array.from(new Set<string>(products.map((p) => p.category)))];

  const supplierTabs: { id: 'all' | SupplierType; label: string; icon: string; badge: string; color: string }[] = [
    { id: 'all', label: 'All Suppliers', icon: '🌐', badge: `${products.length}`, color: 'border-slate-200' },
    { id: 'aliexpress', label: 'AliExpress Direct', icon: '📦', badge: 'High Margin', color: 'border-red-200' },
    { id: 'amazon', label: 'Amazon Prime Hub', icon: '⚡', badge: '2-3d Ship', color: 'border-orange-200' },
    { id: 'ebay', label: 'eBay Verified', icon: '🏷️', badge: 'Rare Tech', color: 'border-blue-200' },
  ];

  return (
    <aside
      id="filter-sidebar"
      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 text-slate-800 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">Filter & Sourcing</h3>
        </div>
        <button
          id="reset-filters-btn"
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Supplier Source Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Source Platform
        </label>
        <div className="space-y-1.5">
          {supplierTabs.map((tab) => {
            const isSelected = selectedSupplier === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-supplier-${tab.id}`}
                onClick={() => setSelectedSupplier(tab.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Product Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? products.length : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[11px] font-mono ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Price Range
          </label>
          <span className="text-xs font-bold font-mono text-indigo-600">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={0}
          max={150}
          step={5}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(75)}</span>
          <span>{formatPrice(150)}+</span>
        </div>
      </div>

      {/* Delivery & Stock Filters */}
      <div className="space-y-3 pt-3.5 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Delivery & Availability
        </label>
        
        {/* Fast Delivery toggle */}
        <button
          id="toggle-fast-delivery-filter"
          onClick={() => setDeliveryFilter(deliveryFilter === 'fast' ? 'all' : 'fast')}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
            deliveryFilter === 'fast'
              ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Express (2-4 Days)</span>
          </div>
          {deliveryFilter === 'fast' && <Check className="w-3.5 h-3.5 text-amber-600" />}
        </button>

        {/* In Stock only toggle */}
        <label
          htmlFor="in-stock-only-checkbox"
          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs transition-colors"
        >
          <span className="text-slate-700 font-medium">In Stock Only</span>
          <input
            id="in-stock-only-checkbox"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500"
          />
        </label>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2 pt-3.5 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Sort Catalog
        </label>
        <select
          id="catalog-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="popular">🔥 Most Popular & Best Selling</option>
          <option value="margin">📈 Highest Profit Margin %</option>
          <option value="price_asc">💵 Price: Low to High</option>
          <option value="price_desc">💎 Price: High to Low</option>
          <option value="rating">⭐ Highest Customer Rating</option>
        </select>
      </div>
    </aside>
  );
};
