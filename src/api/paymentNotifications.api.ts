import { httpApi } from './http.api';

export interface PaymentNotificationParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'unread' | 'user';
  pubkey?: string;
}

export interface PaymentNotification {
  id: number;
  pubkey: string;
  tx_id: string;
  amount: number;              // In satoshis
  subscription_tier: string;   // e.g. "5GB"
  is_new_subscriber: boolean;  // First time subscriber flag
  expiration_date: string;     // ISO date
  created_at: string;          // ISO date
  is_read: boolean;
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaymentNotificationsResponse {
  notifications: PaymentNotification[];
  pagination: PaginationData;
}

export interface TierStat {
  tier: string;
  count: number;
  revenue: number;               // In satoshis
}

export interface TxSummary {
  pubkey: string;
  amount: number;                // In satoshis
  tier: string;
  date: string;                  // ISO date
}

export interface PaymentStats {
  total_revenue: number;          // In satoshis
  revenue_today: number;          // In satoshis
  active_subscribers: number;
  new_subscribers_today: number;
  by_tier: TierStat[];
  recent_transactions: TxSummary[];
}

// Fetch payment notifications with filtering and pagination
export const getPaymentNotifications = async (
  params: PaymentNotificationParams = {},
): Promise<PaymentNotificationsResponse> => {
  const response = await httpApi.get<PaymentNotificationsResponse>('/api/payment/notifications', { params });
  return response.data;
};

// Mark a specific notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
  await httpApi.post('/api/payment/notifications/read', { id });
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (pubkey?: string): Promise<void> => {
  await httpApi.post('/api/payment/notifications/read-all', pubkey ? { pubkey } : {});
};

// Get payment statistics
export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await httpApi.get<PaymentStats>('/api/payment/stats');
  return response.data;
};
