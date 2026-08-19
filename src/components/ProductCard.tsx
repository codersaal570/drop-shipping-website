import React from 'react';
import { 
  Star, 
  ShoppingCart, 
  Eye, 
  Truck, 
  TrendingUp
} from 'lucide-react';
import { Product, SupplierType } from '../types';
import { useDropship } from '../context/DropshipContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    setSelectedProductDetail
  } = useDropship();

  const getSupplierBadge = (supplier: SupplierType) => {
    switch (supplier) {
      case 'aliexpress':
        return {
          name: 'ALIEXPRESS',
          className: 'bg-red-100 text-red-700',
        };
      case 'amazon':
        return {
          name: 'AMAZON',
          className: 'bg-orange-100 text-orange-700',
        };
      case 'ebay':
        return {
          name: 'EBAY',
          className: 'bg-blue-100 text-blue-700',
        };
    }
  };

  const supplierMeta = getSupplierBadge(product.supplier);
  const discountPercent = Math.round(
    ((product.compareAtPrice - product.sellingPrice) / product.compareAtPrice) * 100
  );

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between"
    >
      {/* Image Container & Floating Tags */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Supplier Badge Matching Theme Spec */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-xs ${supplierMeta.className}`}
          >
            {supplierMeta.name}
          </span>

          {/* Discount Tag */}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] tracking-tight shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Live sync indicator */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] text-slate-700 font-mono font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Synced
          </span>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => setSelectedProductDetail(product)}
            className="p-3 rounded-xl bg-white text-slate-800 hover:text-indigo-600 shadow-lg transition-all hover:scale-105 font-bold"
            title="Quick View & Sourcing Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            id={`instant-add-cart-btn-${product.id}`}
            onClick={() => addToCart(product, 1)}
            className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg transition-all hover:scale-105"
            title="Instant Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 truncate max-w-[60%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProductDetail(product)}
            className="font-bold text-sm text-slate-800 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
          >
            {product.title}
          </h3>

          {/* Shipping & Delivery ETA */}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 font-medium">
            <Truck className="w-3.5 h-3.5 text-indigo-500" />
            <span>{product.supplierShippingDays}</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 font-mono">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.compareAtPrice > product.sellingPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {/* Margin Indicator Pill */}
            <div className="mt-1">
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block font-mono">
                +{product.marginPercent}% Net Margin
              </span>
            </div>
          </div>

          <button
            id={`buy-now-btn-${product.id}`}
            onClick={() => addToCart(product, 1)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
