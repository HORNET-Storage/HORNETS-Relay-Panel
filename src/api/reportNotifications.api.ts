import { httpApi } from './http.api';

// Define NostrEvent interface based on NIP-01 spec
export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface ReportNotificationParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'unread';
}

export interface ReportNotification {
  id: number;
  pubkey: string;
  event_id: string;
  report_type: string;
  report_content: string;
  reporter_pubkey: string;
  report_count: number;
  created_at: string;
  updated_at: string;
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

export interface ReportNotificationsResponse {
  notifications: ReportNotification[];
  pagination: PaginationData;
}

export interface ReportTypeStats {
  type: string;
  count: number;
}

export interface MostReportedItem {
  event_id: string;
  pubkey: string;
  report_count: number;
  report_type: string;
  created_at: string;
}

export interface ReportStats {
  total_reported: number;
  total_reported_today: number;
  by_report_type: ReportTypeStats[];
  most_reported: MostReportedItem[];
}

// Fetch report notifications with filtering and pagination
export const getReportNotifications = async (
  params: ReportNotificationParams = {}
): Promise<ReportNotificationsResponse> => {
  const response = await httpApi.get<ReportNotificationsResponse>('/api/reports/notifications', { params });
  return response.data;
};

// Mark a specific notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
  await httpApi.post('/api/reports/notifications/read', { id });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await httpApi.post('/api/reports/notifications/read-all');
};

// Get report statistics
export const getReportStats = async (): Promise<ReportStats> => {
  const response = await httpApi.get<ReportStats>('/api/reports/stats');
  return response.data;
};

// Get reported event content
export const getReportedEvent = async (eventId: string): Promise<{event: NostrEvent}> => {
  const response = await httpApi.get<{event: NostrEvent}>(`/api/reports/event/${eventId}`);
  return response.data;
};

// Delete reported event
export const deleteReportedEvent = async (eventId: string): Promise<{success: boolean; message: string}> => {
  const response = await httpApi.delete<{success: boolean; message: string}>(`/api/reports/event/${eventId}`);
  return response.data;
};
