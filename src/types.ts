export type SupplierType = 'aliexpress' | 'amazon' | 'ebay';

export type SyncStatus = 'synced' | 'updating' | 'warning' | 'out_of_stock';

export interface PricePoint {
  date: string;
  costPrice: number;
  sellingPrice: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'plug' | 'style';
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  category: string;
  supplier: SupplierType;
  supplierSku: string;
  supplierUrl: string;
  supplierRating: number;
  supplierLocation: string;
  supplierShippingDays: string;
  costPrice: number;
  sellingPrice: number;
  compareAtPrice: number;
  currency: string;
  marginPercent: number;
  stockQuantity: number;
  lowStockThreshold: number;
  inStock: boolean;
  lastSyncedAt: string;
  syncStatus: SyncStatus;
  images: string[];
  rating: number;
  reviewsCount: number;
  variants?: ProductVariant[];
  selectedOptions?: Record<string, string>;
  features: string[];
  tags: string[];
  priceHistory: PricePoint[];
  hotDeal?: boolean;
  salesCount: number;
  aiOptimized?: boolean;
  headline?: string;
}

export type PaymentMethodType = 'credit_card' | 'mobile_money' | 'paypal' | 'apple_pay';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
  unitPrice: number;
  supplierCost: number;
}

export type OrderFulfillmentStatus = 
  | 'pending'
  | 'syncing_supplier'
  | 'auto_fulfilled'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface StatusTimelineEntry {
  status: string;
  timestamp: string;
  note: string;
  icon?: string;
}

export interface SupplierDispatchInfo {
  itemId: string;
  productTitle: string;
  supplier: SupplierType;
  supplierOrderId: string;
  carrierName: string;
  carrierTrackingCode: string;
  estimatedDeliveryDays: string;
  dispatchStatus: string;
  supplierApiCost: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  supplierTotalCost: number;
  grossProfit: number;
  profitMarginPercent: number;
  paymentMethod: PaymentMethodType;
  paymentProviderName: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  transactionReference: string;
  fulfillmentStatus: OrderFulfillmentStatus;
  supplierOrderId?: string;
  carrierTrackingCode?: string;
  carrierName?: string;
  estimatedDelivery?: string;
  statusTimeline: StatusTimelineEntry[];
  dispatchDetails?: SupplierDispatchInfo[];
  customerNotificationSent: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export type NotificationType = 
  | 'promo' 
  | 'inventory_alert' 
  | 'price_drop' 
  | 'order_update' 
  | 'system';

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  badgeText?: string;
  actionUrl?: string;
  discountCode?: string;
  discountPercent?: number;
  image?: string;
}

export interface SupplierSyncRule {
  autoSyncIntervalMinutes: number;
  minProfitMarginPercent: number;
  targetMarkupPercent: number;
  autoPriceAdjustment: boolean;
  autoFulfillOrders: boolean;
  pauseOnSupplierStockout: boolean;
  notifyOnPriceIncrease: boolean;
  exchangeRateMultiplier: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // relative to USD
}
