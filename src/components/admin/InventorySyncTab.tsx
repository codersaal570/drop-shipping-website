import React, { useState } from 'react';
import { 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  Edit3
} from 'lucide-react';
import { useDropship } from '../../context/DropshipContext';
import { Product } from '../../types';

export const InventorySyncTab: React.FC = () => {
  const {
    products,
    syncAllProducts,
    syncSingleProduct,
    isSyncingAll,
    lastGlobalSync,
    updateProduct,
    formatPrice,
  } = useDropship();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setEditPrice(p.sellingPrice);
    setEditStock(p.stockQuantity);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const newMargin = +(((editPrice - editingProduct.costPrice) / editPrice) * 100).toFixed(1);
    updateProduct({
      ...editingProduct,
      sellingPrice: editPrice,
      stockQuantity: editStock,
      inStock: editStock > 0,
      marginPercent: newMargin,
    });
    setEditingProduct(null);
  };

  const getSyncStatusBadge = (status: Product['syncStatus']) => {
    switch (status) {
      case 'synced':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synchronized
          </span>
        );
      case 'updating':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Cost Adjusted
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Supplier Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="admin-inventory-sync-tab" className="space-y-6">
      {/* Control Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" />
            <span>Multi-Supplier Live Inventory & Price Tracking</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitors real-time wholesale cost variations & warehouse stock across eBay, Amazon, and AliExpress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-[11px] text-slate-400 block font-semibold">Last Full Sync:</span>
            <span className="text-xs font-mono text-indigo-600 font-bold">
              {new Date(lastGlobalSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            id="force-sync-all-btn"
            onClick={syncAllProducts}
            disabled={isSyncingAll}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Querying APIs...' : 'Force Full Supplier Sync'}</span>
          </button>
        </div>
      </div>

      {/* Inventory & Price Tracking Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Supplier Source</th>
                <th className="py-3.5 px-4">Supplier Cost</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Gross Margin</th>
                <th className="py-3.5 px-4">Warehouse Stock</th>
                <th className="py-3.5 px-4">Sync Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => {
                const isLowStock = p.stockQuantity <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    {/* Title & SKU */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{p.title}</p>
                          <p className="text-[10px] font-mono text-slate-400">SKU: {p.supplierSku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 capitalize font-bold text-slate-800">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        {p.supplier}
                      </span>
                    </td>

                    {/* Supplier Cost */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                      ${p.costPrice.toFixed(2)}
                    </td>

                    {/* Retail Selling Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {formatPrice(p.sellingPrice)}
                    </td>

                    {/* Margin */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold font-mono">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {p.marginPercent}%
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>
                          {p.stockQuantity} units
                        </span>
                        {isLowStock && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" title="Low Stock Threshold" />
                        )}
                      </div>
                    </td>

                    {/* Sync Status */}
                    <td className="py-3.5 px-4">
                      {getSyncStatusBadge(p.syncStatus)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`sync-prod-${p.id}`}
                          onClick={() => syncSingleProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Sync from Supplier API"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`edit-prod-${p.id}`}
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Override Price & Stock"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base">Adjust Listing & Overrides</h4>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Product Title</label>
                <p className="font-bold text-slate-900 truncate">{editingProduct.title}</p>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Supplier Base Cost</label>
                <p className="font-mono text-slate-700 font-bold">${editingProduct.costPrice.toFixed(2)} (Locked by API)</p>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Retail Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-semibold">Warehouse Stock Allocation</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between font-bold">
                <span className="text-slate-600">New Resulting Margin:</span>
                <span className="text-emerald-600 font-mono">
                  {+(((editPrice - editingProduct.costPrice) / editPrice) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
