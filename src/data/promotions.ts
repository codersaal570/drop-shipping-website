import { PushNotification } from '../types';

export const INITIAL_PROMOTIONS: PushNotification[] = [
  {
    id: 'promo-1',
    title: '☀️ Mid-Season Tech & Ambience Flash Sale',
    message: 'Take an extra 20% off all smart lighting & ambient lamps! Limited factory allocation with 48-hour express dispatch.',
    type: 'promo',
    timestamp: 'Just now',
    read: false,
    badgeText: '20% OFF',
    discountCode: 'FLASH20',
    discountPercent: 20,
    actionUrl: '#category-Smart Home & Lighting',
  },
  {
    id: 'promo-2',
    title: '📦 Automated Supplier Stock Restock Alert',
    message: 'ApexHydro 750ml OLED Insulated Flask has been restocked with +240 units directly from verified factory partner.',
    type: 'inventory_alert',
    timestamp: '15m ago',
    read: false,
    badgeText: 'Restocked',
  },
  {
    id: 'promo-3',
    title: '📉 Real-Time Price Drop: ProPulse Massage Gun',
    message: 'Amazon supplier lowered unit cost by $3.50. Retail price dynamically adjusted from $74.99 down to $69.99!',
    type: 'price_drop',
    timestamp: '1h ago',
    read: false,
    badgeText: 'Save $5',
  },
  {
    id: 'promo-4',
    title: '🌍 Multi-Currency & Mobile Money Active',
    message: 'Checkout is now fully localized with M-Pesa, MTN Mobile Money, Airtel Money, and all major Credit/Debit cards.',
    type: 'system',
    timestamp: '3h ago',
    read: true,
  },
];
