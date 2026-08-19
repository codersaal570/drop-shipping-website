import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useDropship } from '../context/DropshipContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    formatPrice,
    activePromoCode,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
  } = useDropship();

  const [couponInput, setCouponInput] = useState('');

  const freeShippingThreshold = 50.0;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput);
    setCouponInput('');
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col shadow-2xl text-slate-800"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-900">Your Shopping Cart</h2>
                    <p className="text-xs text-slate-500">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for auto-fulfillment
                    </p>
                  </div>
                </div>

                <button
                  id="close-cart-drawer-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-4 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    {amountToFreeShipping > 0
                      ? `Add ${formatPrice(amountToFreeShipping)} more for FREE Express Shipping`
                      : '🎉 You unlocked FREE Express Global Shipping!'}
                  </span>
                  <span className="font-mono text-indigo-600 font-bold">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 space-y-3">
                    <ShoppingCart className="w-12 h-12 mx-auto opacity-30 text-indigo-600" />
                    <p className="text-base font-bold text-slate-800">Your cart is empty</p>
                    <p className="text-xs max-w-xs mx-auto text-slate-500">
                      Browse top-selling dropship electronics, gadgets, and ambient lighting directly from AliExpress, Amazon & eBay.
                    </p>
                    <button
                      id="browse-catalog-btn"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const variantText = Object.entries(item.selectedVariants || {})
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ');

                    return (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3.5 items-center"
                      >
                        {/* Image */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          {variantText && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {variantText}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-bold text-indigo-600">
                              {formatPrice(item.product.sellingPrice)}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 uppercase font-mono font-bold">
                              {item.product.supplier}
                            </span>
                          </div>

                          {/* Quantity and Remove */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.product.id, item.quantity - 1)
                                }
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded text-xs font-bold"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartQuantity(item.product.id, item.quantity + 1)
                                }
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded text-xs font-bold"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4 shadow-lg">
                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        id="cart-coupon-input"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo code (e.g. FLASH20)"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      id="apply-coupon-btn"
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Active Discount badge if any */}
                  {activePromoCode && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Code <strong>{activePromoCode}</strong> applied (-20%)
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Summary Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-800 font-semibold">{formatPrice(cartSubtotal)}</span>
                    </div>
                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount Applied</span>
                        <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-mono text-emerald-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Total Amount</span>
                      <span className="font-mono text-lg text-indigo-600">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Trigger */}
                  <button
                    id="proceed-to-checkout-btn"
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Multi-Gateway Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit Encrypted Multi-Supplier Auto-Fulfillment</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
