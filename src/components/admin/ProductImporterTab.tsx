import React, { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  Link as LinkIcon, 
  DollarSign, 
  CheckCircle2
} from 'lucide-react';
import { useDropship } from '../../context/DropshipContext';
import { SupplierType } from '../../types';

export const ProductImporterTab: React.FC = () => {
  const { importProduct } = useDropship();

  const [importUrl, setImportUrl] = useState('');
  const [detectedSupplier, setDetectedSupplier] = useState<SupplierType>('aliexpress');
  const [productTitle, setProductTitle] = useState('');
  const [costPrice, setCostPrice] = useState<number>(18.50);
  const [sellingPrice, setSellingPrice] = useState<number>(44.99);
  const [comparePrice, setComparePrice] = useState<number>(69.99);
  const [category, setCategory] = useState('Smart Home');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Direct dropship supplier fulfillment',
    'Real-time automated price syncing',
    'Full tracking barcode generated',
  ]);

  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Auto-detect supplier from URL
  const handleUrlChange = (val: string) => {
    setImportUrl(val);
    const low = val.toLowerCase();
    if (low.includes('amazon.')) {
      setDetectedSupplier('amazon');
    } else if (low.includes('ebay.')) {
      setDetectedSupplier('ebay');
    } else if (low.includes('aliexpress.')) {
      setDetectedSupplier('aliexpress');
    }
  };

  // Pre-fill quick demo presets
  const handleLoadSample = (sampleType: 'aliexpress' | 'amazon' | 'ebay') => {
    if (sampleType === 'aliexpress') {
      setImportUrl('https://aliexpress.com/item/1005006281901.html');
      setDetectedSupplier('aliexpress');
      setProductTitle('Levitating RGB Moon Lamp Magnetic Floating Light');
      setCostPrice(16.20);
      setSellingPrice(39.99);
      setComparePrice(59.99);
      setCategory('Smart Home');
      setImageUrl('https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80');
      setDescription('Futuristic magnetic levitation lamp with 16 RGB color modes and touch sensor base.');
    } else if (sampleType === 'amazon') {
      setImportUrl('https://amazon.com/dp/B09X7K4L9P');
      setDetectedSupplier('amazon');
      setProductTitle('Ergonomic Memory Foam Lumbar Support Cushion');
      setCostPrice(14.00);
      setSellingPrice(34.99);
      setComparePrice(49.99);
      setCategory('Travel & Comfort');
      setImageUrl('https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80');
      setDescription('Orthopedic memory foam cushion designed for office chairs and car seats.');
    } else {
      setImportUrl('https://ebay.com/itm/394827104928');
      setDetectedSupplier('ebay');
      setProductTitle('Vintage Mechanical Keyboard 75% Layout Gateron Yellow');
      setCostPrice(28.00);
      setSellingPrice(64.99);
      setComparePrice(89.99);
      setCategory('Audio & Desk Gear');
      setImageUrl('https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80');
      setDescription('Retro aesthetic mechanical keyboard with factory pre-lubed linear switches.');
    }
  };

  // Gemini AI listing enhancer
  const handleAiOptimize = async () => {
    if (!productTitle && !importUrl) return;
    setIsAiEnhancing(true);

    try {
      const response = await fetch('/api/ai/optimize-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productTitle || 'Modern Dropship Gadget',
          category,
          supplier: detectedSupplier,
          costPrice,
        }),
      });

      const data = await response.json();
      if (data.optimizedTitle) {
        setProductTitle(data.optimizedTitle);
      }
      if (data.compellingDescription) {
        setDescription(data.compellingDescription);
      }
      if (data.keyFeatures && Array.isArray(data.keyFeatures)) {
        setFeatures(data.keyFeatures);
      }
      if (data.suggestedSellingPrice) {
        setSellingPrice(data.suggestedSellingPrice);
      }
    } catch (err) {
      console.error('AI optimization failed, using local fallback:', err);
      setProductTitle((prev) => `⚡ [2025 Edition] ${prev || 'Smart Ambient Device'}`);
      setDescription('Engineered with premium components for maximum durability and effortless user experience.');
    } finally {
      setIsAiEnhancing(false);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitle.trim()) return;

    const marginPercent = +(((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(1);

    importProduct({
      title: productTitle,
      description: description || 'High-converting verified dropship product.',
      headline: 'Best-in-class multi-supplier sourcing',
      sellingPrice,
      costPrice,
      compareAtPrice: comparePrice,
      currency: 'USD',
      marginPercent,
      supplier: detectedSupplier,
      supplierSku: `${detectedSupplier.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      supplierUrl: importUrl || `https://${detectedSupplier}.com/item/${Math.floor(100000000 + Math.random() * 900000000)}`,
      supplierLocation: detectedSupplier === 'aliexpress' ? 'Shenzhen, CN' : detectedSupplier === 'amazon' ? 'Seattle, US' : 'Frankfurt, DE',
      supplierShippingDays: detectedSupplier === 'amazon' ? '2-3 Business Days' : '5-8 Business Days',
      supplierRating: 4.9,
      images: [imageUrl],
      category,
      rating: 4.8,
      reviewsCount: 38,
      stockQuantity: 120,
      inStock: true,
      lowStockThreshold: 15,
      features,
      tags: [category, detectedSupplier, 'Trending', 'AutoSync'],
      aiOptimized: true,
      salesCount: 14,
    });

    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 4000);

    // Reset fields
    setImportUrl('');
    setProductTitle('');
    setDescription('');
  };

  const calculatedMargin = sellingPrice > 0 ? +(((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(1) : 0;

  return (
    <div id="admin-product-importer-tab" className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <span>1-Click Multi-Supplier Product Importer & AI Enhancer</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Import winning listings from AliExpress, Amazon, or eBay with automated Gemini AI sales copywriting and dynamic profit margin calculations.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold">Test Presets:</span>
          <button
            type="button"
            onClick={() => handleLoadSample('aliexpress')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-bold"
          >
            AliExpress Lamp
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('amazon')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold"
          >
            Amazon Cushion
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('ebay')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 font-bold"
          >
            eBay Keyboard
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Product successfully imported to live catalog with real-time supplier sync enabled!</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleImportSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & AI optimization */}
        <div className="lg:col-span-2 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Source URL or Supplier SKU</span>
              <span className="text-indigo-600 capitalize">Detected: {detectedSupplier}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={importUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Paste AliExpress, Amazon, or eBay product link..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Supplier Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'aliexpress', label: 'AliExpress Direct', color: 'text-rose-700' },
              { id: 'amazon', label: 'Amazon Prime', color: 'text-amber-800' },
              { id: 'ebay', label: 'eBay Verified', color: 'text-indigo-700' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setDetectedSupplier(s.id as SupplierType)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  detectedSupplier === s.id
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className={s.color}>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Title & Gemini AI Optimization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Listing Title</label>
              <button
                type="button"
                id="gemini-ai-optimize-btn"
                onClick={handleAiOptimize}
                disabled={isAiEnhancing || (!productTitle && !importUrl)}
                className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-40 transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiEnhancing ? 'animate-spin' : 'text-amber-300'}`} />
                <span>{isAiEnhancing ? 'AI Crafting Copy...' : 'AI Enhance Copy & Pricing'}</span>
              </button>
            </div>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              placeholder="e.g. Minimalist Wireless Fast Charging Station 3-in-1"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Sales Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Enter product description or click AI Enhance Copy above..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Image & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Smart Home">Smart Home</option>
                <option value="Audio & Desk Gear">Audio & Desk Gear</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Travel & Comfort">Travel & Comfort</option>
                <option value="Kitchen & Coffee">Kitchen & Coffee</option>
                <option value="Lighting & Decor">Lighting & Decor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Col: Pricing Matrix & Live Profit Preview */}
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Profit Matrix & Price Strategy</span>
            </h4>

            {/* Pricing inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Supplier Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Retail Selling Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-indigo-600 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Compare At / MSRP ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
                />
              </div>
            </div>

            {/* Live Profit Preview Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Net Profit per Sale:</span>
                <span className="font-mono font-bold text-emerald-600">
                  +${Math.max(0, sellingPrice - costPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Gross Margin %:</span>
                <span className="font-mono font-bold text-indigo-600">{calculatedMargin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Customer Savings:</span>
                <span className="font-mono text-slate-800">
                  ${Math.max(0, comparePrice - sellingPrice).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Import Button */}
          <button
            type="submit"
            id="import-product-to-store-btn"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Publish to Live Storefront</span>
          </button>
        </div>
      </form>
    </div>
  );
};
