import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  RefreshCw, 
  Download, 
  Sliders, 
  ArrowLeft
} from 'lucide-react';
import { useDropship } from '../../context/DropshipContext';
import { AnalyticsTab } from './AnalyticsTab';
import { OrderFulfillmentTab } from './OrderFulfillmentTab';
import { InventorySyncTab } from './InventorySyncTab';
import { ProductImporterTab } from './ProductImporterTab';
import { PricingRulesTab } from './PricingRulesTab';

export const AdminDashboard: React.FC = () => {
  const { setActiveView, orders, products } = useDropship();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'orders' | 'inventory' | 'importer' | 'rules'>('analytics');

  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'pending').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Admin Sub-Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="back-to-storefront-btn"
              onClick={() => setActiveView('storefront')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Dropship HQ & Fulfillment Console</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                  v2.4 Live
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">
                Multi-Supplier Automated Operations • AliExpress, Amazon FBA, eBay
              </p>
            </div>
          </div>

          {/* Supplier Connectivity Status Pills */}
          <div className="flex items-center gap-2 text-[11px] overflow-x-auto w-full md:w-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              AliExpress: <strong className="text-emerald-700 font-bold">Online</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Amazon SP-API: <strong className="text-emerald-700 font-bold">Online</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              eBay API: <strong className="text-emerald-700 font-bold">Online</strong>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1.5 overflow-x-auto scrollbar-none pb-2.5">
          {[
            { id: 'analytics', label: 'Analytics & Margins', icon: BarChart3 },
            { id: 'orders', label: 'Order Fulfillment', icon: Package, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined },
            { id: 'inventory', label: 'Inventory & Price Sync', icon: RefreshCw, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
            { id: 'importer', label: '1-Click Importer & AI', icon: Download },
            { id: 'rules', label: 'Pricing & Automation Rules', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-nav-${tab.id}`}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-extrabold font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeAdminTab === 'analytics' && <AnalyticsTab />}
        {activeAdminTab === 'orders' && <OrderFulfillmentTab />}
        {activeAdminTab === 'inventory' && <InventorySyncTab />}
        {activeAdminTab === 'importer' && <ProductImporterTab />}
        {activeAdminTab === 'rules' && <PricingRulesTab />}
      </main>
    </div>
  );
};
