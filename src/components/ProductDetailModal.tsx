import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Sparkles, 
  Check, 
  TrendingUp, 
  MapPin, 
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Product } from '../types';
import { useDropship } from '../context/DropshipContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    formatPrice,
    setIsCheckoutOpen,
  } = useDropship();

  const product = selectedProductDetail;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'price_tracking' | 'supplier_logistics'>('overview');

  // Initialize variants when product changes
  React.useEffect(() => {
    if (product && product.variants) {
      const initial: Record<string, string> = {};
      product.variants.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
      setSelectedVariants(initial);
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  const handleInstantBuy = () => {
    addToCart(product, quantity, selectedVariants);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const priceHistoryChartData = product.priceHistory.map((item) => ({
    date: item.date,
    'Store Retail Price': item.sellingPrice,
    'Supplier Cost': item.costPrice,
    margin: +(item.sellingPrice - item.costPrice).toFixed(2),
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
        <motion.div
          id="product-detail-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-800"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {product.category}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                SKU: {product.supplierSku}
              </span>
            </div>

            <button
              id="close-product-modal-btn"
              onClick={() => setSelectedProductDetail(null)}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 relative">
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Verified Dropship Source
                  </div>
                </div>

                {/* Image Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        id={`product-thumbnail-${idx}`}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          selectedImage === idx
                            ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Urgency Counter */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong className="text-amber-800 font-bold">High Demand:</strong> Order within the next 2h 15m for guaranteed same-day supplier routing!
                  </span>
                </div>
              </div>

              {/* Right Column: Title, Pricing & Interactive Options */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mb-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} verified reviews)</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {product.title}
                  </h1>

                  {product.headline && (
                    <p className="text-xs text-indigo-600 font-semibold mt-1">
                      {product.headline}
                    </p>
                  )}
                </div>

                {/* Price Display & Margin Bar */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        {formatPrice(product.sellingPrice)}
                      </span>
                      {product.compareAtPrice > product.sellingPrice && (
                        <span className="text-sm text-slate-400 line-through font-mono">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      Save {formatPrice(product.compareAtPrice - product.sellingPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      Free Worldwide Tracked Shipping
                    </span>
                    <span className="font-semibold text-emerald-600">
                      +{product.marginPercent}% Store Margin
                    </span>
                  </div>
                </div>

                {/* Variants Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3.5">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          {variant.name}:{' '}
                          <span className="text-indigo-600">
                            {selectedVariants[variant.name] || variant.options[0]}
                          </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map((opt) => {
                            const isSelected = (selectedVariants[variant.name] || variant.options[0]) === opt;
                            return (
                              <button
                                key={opt}
                                id={`variant-option-${variant.id}-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                                onClick={() => handleVariantSelect(variant.name, opt)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity & Buy Controls */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Quantity counter */}
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                      <button
                        id="modal-qty-decrease-btn"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                        {quantity}
                      </span>
                      <button
                        id="modal-qty-increase-btn"
                        onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      id="modal-add-to-cart-btn"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Direct Buy Now Button */}
                  <button
                    id="modal-direct-checkout-btn"
                    onClick={handleInstantBuy}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Instant Checkout (Card / Mobile Money)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-500">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">30-Day Money Back</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">Real-Time Tracking</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold">Instant Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tabs */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                <button
                  id="tab-detail-overview"
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Product Details & Specs
                </button>
                <button
                  id="tab-detail-price-tracking"
                  onClick={() => setActiveTab('price_tracking')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'price_tracking'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Price Tracking History</span>
                </button>
                <button
                  id="tab-detail-supplier"
                  onClick={() => setActiveTab('supplier_logistics')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'supplier_logistics'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supplier Transparency</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <p>{product.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">Key Features & Highlights:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'price_tracking' && (
                <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Real-Time Price & Margin Tracker</h4>
                      <p className="text-xs text-slate-500">
                        Synchronized live against source supplier inventory
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1 text-indigo-600 font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                        Retail: {formatPrice(product.sellingPrice)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                        Supplier Cost: ${product.costPrice}
                      </span>
                    </div>
                  </div>

                  <div className="h-48 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceHistoryChartData}>
                        <defs>
                          <linearGradient id="colorRetail" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e2e8f0',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
                            color: '#1e293b',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Store Retail Price"
                          stroke="#4f46e5"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRetail)"
                        />
                        <Area
                          type="monotone"
                          dataKey="Supplier Cost"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCost)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'supplier_logistics' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-bold">Source Channel</span>
                    <p className="font-extrabold text-slate-900 text-sm capitalize flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      {product.supplier} Verified Hub
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">SKU: {product.supplierSku}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-bold">Warehouse Origin</span>
                    <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {product.supplierLocation}
                    </p>
                    <p className="text-[11px] text-slate-500">Fast international customs lane</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 uppercase font-bold">Supplier Rating</span>
                    <p className="font-extrabold text-amber-700 text-sm flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      {product.supplierRating} / 5.0 (Top 1%)
                    </p>
                    <p className="text-[11px] text-slate-500">99.4% On-time dispatch rate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
