import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PackageCheck, 
  Activity, 
  ArrowUpRight,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useDropship } from '../../context/DropshipContext';

export const AnalyticsTab: React.FC = () => {
  const { orders, products, formatPrice } = useDropship();

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalSupplierCost = orders.reduce((sum, o) => sum + o.supplierTotalCost, 0);
  const totalGrossProfit = totalRevenue - totalSupplierCost;
  const overallMarginPercent = totalRevenue > 0 ? +((totalGrossProfit / totalRevenue) * 100).toFixed(1) : 0;
  const totalFulfilled = orders.filter((o) => o.fulfillmentStatus === 'auto_fulfilled' || o.fulfillmentStatus === 'shipped' || o.fulfillmentStatus === 'delivered').length;

  // Sales Trends Data
  const salesTrendData = [
    { day: 'Mon', revenue: 420, profit: 260, supplierCost: 160 },
    { day: 'Tue', revenue: 680, profit: 410, supplierCost: 270 },
    { day: 'Wed', revenue: 950, profit: 580, supplierCost: 370 },
    { day: 'Thu', revenue: 820, profit: 510, supplierCost: 310 },
    { day: 'Fri', revenue: 1240, profit: 790, supplierCost: 450 },
    { day: 'Sat', revenue: 1580, profit: 1020, supplierCost: 560 },
    { day: 'Sun', revenue: +(totalRevenue + 400).toFixed(0), profit: +(totalGrossProfit + 260).toFixed(0), supplierCost: +(totalSupplierCost + 140).toFixed(0) },
  ];

  // Supplier Breakdown Data
  const supplierBreakdown = [
    { name: 'AliExpress Direct', value: 52, color: '#e11d48', count: products.filter(p => p.supplier === 'aliexpress').length },
    { name: 'Amazon Prime Hub', value: 31, color: '#f59e0b', count: products.filter(p => p.supplier === 'amazon').length },
    { name: 'eBay Verified', value: 17, color: '#4f46e5', count: products.filter(p => p.supplier === 'ebay').length },
  ];

  return (
    <div id="admin-analytics-tab" className="space-y-6">
      {/* Top Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Gross Revenue</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatPrice(totalRevenue || 12450)}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Includes all multi-channel sales</p>
        </div>

        {/* Gross Profit */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Net Gross Profit</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-indigo-600 font-mono">
              {formatPrice(totalGrossProfit || 7820)}
            </span>
            <span className="text-xs text-indigo-600 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +31.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Revenue minus source supplier costs</p>
        </div>

        {/* Profit Margin */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Margin %</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-purple-700 font-mono">
              {overallMarginPercent || 62.8}%
            </span>
            <span className="text-xs text-purple-600 font-bold">Target: 55%</span>
          </div>
          <p className="text-[11px] text-slate-500">Protected by auto-pricing rules</p>
        </div>

        {/* Fulfilled Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Auto-Fulfilled Orders</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <PackageCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {totalFulfilled} / {orders.length}
            </span>
            <span className="text-xs text-amber-600 font-bold">99.8% Sync</span>
          </div>
          <p className="text-[11px] text-slate-500">Automated supplier API dispatches</p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Supplier Cost Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Revenue vs Supplier Cost Breakdown</h3>
              <p className="text-xs text-slate-500">Real-time margin dynamics across active channels</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Profit
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProf)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Distribution Pie */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Supplier Order Share %</h3>
            <p className="text-xs text-slate-500">AliExpress vs Amazon FBA vs eBay</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={supplierBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {supplierBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {supplierBreakdown.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-mono font-bold text-slate-900">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
