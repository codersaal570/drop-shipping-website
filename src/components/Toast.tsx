import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useDropship } from '../context/DropshipContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useDropship();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-600 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-white text-emerald-950 shadow-lg';
      case 'error':
        return 'border-rose-200 bg-white text-rose-950 shadow-lg';
      case 'warning':
        return 'border-amber-200 bg-white text-amber-950 shadow-lg';
      default:
        return 'border-slate-200 bg-white text-slate-900 shadow-lg';
    }
  };

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          id="global-toast"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4"
        >
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl border ${getBorderColor()}`}
          >
            {getIcon()}
            <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
            <button
              id="toast-close-btn"
              onClick={hideToast}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
