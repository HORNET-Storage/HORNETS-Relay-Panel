import { httpApi } from './http.api';

export interface ModerationNotificationParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'unread' | 'user';
  pubkey?: string;
}

export interface ModerationNotification {
  id: number;
  pubkey: string;
  event_id: string;
  reason: string;
  created_at: string;
  is_read: boolean;
  content_type: string;
  media_url?: string;
  thumbnail_url?: string;
}

export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ModerationNotificationsResponse {
  notifications: ModerationNotification[];
  pagination: PaginationData;
}

export interface ModerationStats {
  total_blocked: number;
  total_blocked_today: number;
  by_content_type: Array<{ type: string; count: number }>;
  by_user: Array<{ pubkey: string; count: number }>;
  recent_reasons: string[];
}

// Fetch moderation notifications with filtering and pagination
export const getModerationNotifications = async (
  params: ModerationNotificationParams = {},
): Promise<ModerationNotificationsResponse> => {
  const response = await httpApi.get<ModerationNotificationsResponse>('/api/moderation/notifications', { params });
  return response.data;
};

// Mark a specific notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
  await httpApi.post('/api/moderation/notifications/read', { id: [id] });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await httpApi.post('/api/moderation/notifications/read-all');
};

// Get moderation statistics
export const getModerationStats = async (): Promise<ModerationStats> => {
  const response = await httpApi.get<ModerationStats>('/api/moderation/stats');
  return response.data;
};
