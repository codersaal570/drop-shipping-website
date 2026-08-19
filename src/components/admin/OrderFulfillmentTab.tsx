import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  Truck, 
  RefreshCw, 
  User, 
  DollarSign,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useDropship } from '../../context/DropshipContext';
import { Order, OrderFulfillmentStatus } from '../../types';

export const OrderFulfillmentTab: React.FC = () => {
  const {
    orders,
    autoFulfillOrder,
    batchAutoFulfillOrders,
    updateOrderStatus,
    formatPrice,
  } = useDropship();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFulfillingId, setIsFulfillingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.fulfillmentStatus === filterStatus;
  });

  const pendingCount = orders.filter((o) => o.fulfillmentStatus === 'pending').length;

  const handleSingleFulfill = async (orderId: string) => {
    setIsFulfillingId(orderId);
    await autoFulfillOrder(orderId);
    setIsFulfillingId(null);
  };

  const getStatusBadge = (status: OrderFulfillmentStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Supplier Dispatch',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'syncing_supplier':
        return {
          label: 'Syncing with Supplier API',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500 animate-spin',
        };
      case 'auto_fulfilled':
        return {
          label: '⚡ Auto-Fulfilled',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'shipped':
        return {
          label: 'In Transit / Shipped',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'delivered':
        return {
          label: 'Delivered to Customer',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  return (
    <div id="admin-order-fulfillment-tab" className="space-y-6">
      {/* Action Header & Quick Batch Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <span>Automated Multi-Supplier Order Fulfillment</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-routes customer orders to AliExpress, Amazon FBA, and eBay suppliers with live tracking code generation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {pendingCount > 0 && (
            <button
              id="batch-fulfill-all-btn"
              onClick={batchAutoFulfillOrders}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Batch Fulfill ({pendingCount} Pending)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'pending', label: `Pending Routing (${orders.filter((o) => o.fulfillmentStatus === 'pending').length})` },
          { id: 'auto_fulfilled', label: `Auto-Fulfilled (${orders.filter((o) => o.fulfillmentStatus === 'auto_fulfilled').length})` },
          { id: 'shipped', label: `In Transit (${orders.filter((o) => o.fulfillmentStatus === 'shipped').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-order-${tab.id}`}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
              filterStatus === tab.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid / Table */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto opacity-30 text-indigo-600" />
            <p className="text-sm font-bold text-slate-700">No orders found in this status</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.fulfillmentStatus);
            const isFulfilling = isFulfillingId === ord.id;

            return (
              <div
                key={ord.id}
                id={`admin-order-row-${ord.id}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                {/* Top Row: Number, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-slate-900 text-base">
                      #{ord.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="text-slate-800 font-bold">{ord.paymentProviderName}</span>
                  </div>
                </div>

                {/* Middle Grid: Customer, Financials, Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      Recipient & Destination
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{ord.customer.fullName}</p>
                    <p className="text-slate-600 truncate">{ord.customer.address}, {ord.customer.city}</p>
                    <p className="text-slate-600 font-mono">{ord.customer.phone}</p>
                  </div>

                  {/* Profit & Financial Breakdown */}
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Financial Margins
                    </span>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-600">Customer Paid:</span>
                      <span className="font-mono font-bold text-slate-900">{formatPrice(ord.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Supplier Base Cost:</span>
                      <span className="font-mono text-slate-600">${ord.supplierTotalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-emerald-600">
                      <span>Net Profit:</span>
                      <span className="font-mono">+{formatPrice(ord.grossProfit)} ({ord.profitMarginPercent}%)</span>
                    </div>
                  </div>

                  {/* Supplier Tracking & Carrier info */}
                  <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 uppercase font-bold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      Supplier Routing & Logistics
                    </span>
                    {ord.carrierTrackingCode ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Carrier:</span>
                          <span className="font-semibold text-slate-900">{ord.carrierName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Tracking Code:</span>
                          <span className="font-mono font-bold text-indigo-600">{ord.carrierTrackingCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Supplier PO:</span>
                          <span className="font-mono text-slate-800 font-bold">{ord.supplierOrderId}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-amber-700 font-medium pt-1">
                        Ready for automatic dispatch to supplier API.
                      </p>
                    )}
                  </div>
                </div>

                {/* Items & Fulfillment Actions Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  {/* Items summary */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {ord.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs border border-slate-200"
                      >
                        <span className="font-bold text-indigo-600">{it.quantity}x</span>
                        <span className="truncate max-w-[150px] font-medium">{it.product.title}</span>
                        <span className="text-[10px] px-1 rounded bg-white text-slate-500 uppercase font-mono border border-slate-200">
                          {it.product.supplier}
                        </span>
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {ord.fulfillmentStatus === 'pending' && (
                      <button
                        id={`fulfill-single-btn-${ord.id}`}
                        onClick={() => handleSingleFulfill(ord.id)}
                        disabled={isFulfilling}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isFulfilling ? 'animate-spin' : ''}`} />
                        <span>{isFulfilling ? 'Dispatching...' : 'Auto-Fulfill with Supplier'}</span>
                      </button>
                    )}

                    {ord.fulfillmentStatus === 'auto_fulfilled' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'shipped', 'Carrier package scanned into international hub')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
                      >
                        Mark as In-Transit
                      </button>
                    )}

                    <button
                      id={`inspect-timeline-btn-${ord.id}`}
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <span>Timeline & Logs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Audit Timeline: #{selectedOrder.orderNumber}</span>
              </h4>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-2">
              {selectedOrder.statusTimeline.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 shrink-0 mt-0.5" />
                    {idx < selectedOrder.statusTimeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{step.status}</span>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">{step.note}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
