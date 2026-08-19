import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bell, 
  Sparkles, 
  Package, 
  TrendingDown, 
  CheckCheck, 
  Send, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useDropship } from '../context/DropshipContext';
import { NotificationType } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendPushNotification,
    applyPromoCode,
  } = useDropship();

  const [activeTab, setActiveTab] = useState<'all' | 'promo' | 'inventory_alert' | 'order_update'>('all');
  const [customPromoTitle, setCustomPromoTitle] = useState('');
  const [customPromoMsg, setCustomPromoMsg] = useState('');
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'promo':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'inventory_alert':
        return <Package className="w-4 h-4 text-indigo-500" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-emerald-500" />;
      case 'order_update':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleBroadcastPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromoTitle.trim()) return;

    sendPushNotification({
      title: customPromoTitle,
      message: customPromoMsg || 'Special seasonal inventory discount with express supplier fulfillment.',
      type: 'promo',
      badgeText: 'HOT DEAL',
      discountCode: 'SUMMER20',
      discountPercent: 20,
    });

    setCustomPromoTitle('');
    setCustomPromoMsg('');
    setIsCreatingPromo(false);
  };

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationCenterOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col shadow-2xl text-slate-800"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Push Notifications & Deals</h2>
                    <p className="text-xs text-slate-500">Automated price alerts & seasonal push notifications</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id="mark-all-read-btn"
                    onClick={markAllNotificationsAsRead}
                    title="Mark all as read"
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                  <button
                    id="close-notifications-drawer-btn"
                    onClick={() => setIsNotificationCenterOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex gap-1.5 overflow-x-auto text-xs scrollbar-none">
                {(['all', 'promo', 'inventory_alert', 'order_update'] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`notif-tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab === 'all'
                      ? 'All Updates'
                      : tab === 'promo'
                      ? 'Promotions'
                      : tab === 'inventory_alert'
                      ? 'Stock & Price'
                      : 'Orders'}
                  </button>
                ))}
              </div>

              {/* Push Simulation & Broadcast Action */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200">
                {!isCreatingPromo ? (
                  <button
                    id="open-promo-broadcast-btn"
                    onClick={() => setIsCreatingPromo(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Broadcast Push Notification</span>
                  </button>
                ) : (
                  <form onSubmit={handleBroadcastPromo} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Send Push Alert to Customers
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCreatingPromo(false)}
                        className="text-slate-400 hover:text-slate-800 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                    <input
                      type="text"
                      value={customPromoTitle}
                      onChange={(e) => setCustomPromoTitle(e.target.value)}
                      placeholder="e.g. 🍁 Autumn Dropship Flash Sale: 25% Off"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      value={customPromoMsg}
                      onChange={(e) => setCustomPromoMsg(e.target.value)}
                      placeholder="e.g. Applied direct across AliExpress and Amazon gadgets!"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      id="submit-push-broadcast-btn"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Broadcast Live Push Notification
                    </button>
                  </form>
                )}
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredNotifs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No notifications in this category</p>
                  </div>
                ) : (
                  filteredNotifs.map((notif) => (
                    <motion.div
                      key={notif.id}
                      id={`notif-card-${notif.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        notif.read
                          ? 'bg-slate-50 border-slate-200 text-slate-500'
                          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-3.5 right-3.5" />
                      )}

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                          {getNotifIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className={`text-xs font-bold ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>
                              {notif.title}
                            </h4>
                            {notif.badgeText && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                {notif.badgeText}
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-slate-500">{notif.message}</p>

                          {notif.discountCode && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-emerald-700 font-bold">
                                {notif.discountCode}
                              </span>
                              <button
                                id={`apply-coupon-${notif.discountCode}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applyPromoCode(notif.discountCode!);
                                }}
                                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold underline"
                              >
                                Apply Coupon
                              </button>
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
