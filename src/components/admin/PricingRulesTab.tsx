import React, { useState } from 'react';
import { 
  Sliders, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Globe
} from 'lucide-react';
import { useDropship } from '../../context/DropshipContext';
import { SupplierSyncRule } from '../../types';

export const PricingRulesTab: React.FC = () => {
  const { syncRules, updateSyncRules, currency, setCurrencyCode } = useDropship();

  const [rules, setRules] = useState<SupplierSyncRule>(syncRules);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSyncRules(rules);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="admin-pricing-rules-tab" className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <span>Automation, Pricing Rules & Currency Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated retail markup formulas, price shift synchronizers, stockout protection, and global currency formats.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rules Saved & Active</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Pricing Markup Strategy */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-indigo-600">
            <DollarSign className="w-4 h-4" />
            <span>Retail Pricing Strategy</span>
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Target Gross Profit Margin %
              </label>
              <input
                type="number"
                min="20"
                max="90"
                value={rules.minProfitMarginPercent}
                onChange={(e) => setRules({ ...rules, minProfitMarginPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Target Markup Percent % (e.g. 60% over wholesale)
              </label>
              <input
                type="number"
                min="10"
                max="250"
                value={rules.targetMarkupPercent}
                onChange={(e) => setRules({ ...rules, targetMarkupPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Auto Adjust Retail on Supplier Fluctuations</span>
                  <span className="text-[11px] text-slate-500">
                    Instantly updates your store price whenever AliExpress/Amazon changes base cost
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.autoPriceAdjustment}
                  onChange={(e) => setRules({ ...rules, autoPriceAdjustment: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Fulfillment & Stockout Protection */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-indigo-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Fulfillment & Stockout Guard</span>
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Auto Sync Frequency (Minutes)
              </label>
              <select
                value={rules.autoSyncIntervalMinutes}
                onChange={(e) => setRules({ ...rules, autoSyncIntervalMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value={15}>Every 15 Minutes (High Priority)</option>
                <option value={30}>Every 30 Minutes</option>
                <option value={60}>Every 1 Hour (Standard)</option>
                <option value={360}>Every 6 Hours</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Automated Instant Fulfillment</span>
                  <span className="text-[11px] text-slate-500">
                    Immediately routes verified payments to supplier API without manual admin clicks
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.autoFulfillOrders}
                  onChange={(e) => setRules({ ...rules, autoFulfillOrders: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Stockout Auto-Pause</span>
                  <span className="text-[11px] text-slate-500">
                    Pauses checkout automatically when supplier runs completely out of stock
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={rules.pauseOnSupplierStockout}
                  onChange={(e) => setRules({ ...rules, pauseOnSupplierStockout: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Currency & International Display */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Store Currency Selector</h4>
              <p className="text-xs text-slate-500">
                Supports USD, EUR, GBP, KES (M-Pesa), NGN (Nigeria Naira), and GHS (Ghana).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['USD', 'EUR', 'GBP', 'KES', 'NGN'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                id={`set-currency-${curr.toLowerCase()}`}
                onClick={() => setCurrencyCode(curr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  currency.code === curr
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            id="save-pricing-rules-btn"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Automation Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
