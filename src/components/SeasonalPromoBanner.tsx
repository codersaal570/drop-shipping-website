import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Copy, Check } from 'lucide-react';
import { useDropship } from '../context/DropshipContext';

export const SeasonalPromoBanner: React.FC = () => {
  const { applyPromoCode, activePromoCode } = useDropship();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    applyPromoCode('FLASH20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="seasonal-promo-banner"
      className="bg-indigo-600 text-white py-2.5 px-4 text-xs font-medium"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Highlight */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Seasonal Push Offer
          </span>
          <span className="text-indigo-100 hidden md:inline">
            Direct dropship fulfillment across AliExpress, Amazon FBA, & eBay.
          </span>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center gap-2 bg-indigo-700/60 px-3 py-1 rounded-lg border border-indigo-500/50">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-indigo-200">Ends in:</span>
          <span className="font-mono font-bold text-white tracking-wider">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Coupon Claim */}
        <div className="flex items-center gap-2">
          <span className="text-indigo-100 hidden lg:inline">Use promo code:</span>
          <button
            id="claim-promo-code-btn"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold text-xs transition-all ${
              activePromoCode === 'FLASH20'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm'
            }`}
          >
            {copied || activePromoCode === 'FLASH20' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>APPLIED (20% OFF)</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-indigo-600" />
                <span>FLASH20</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
