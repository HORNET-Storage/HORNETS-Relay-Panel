import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';

export interface BlockedEventResponse {
  event: any; // Full Nostr event details
  moderation_details: ModerationNotification;
}

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
  const token = readToken();
  
  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.filter) queryParams.append('filter', params.filter);
  if (params.pubkey) queryParams.append('pubkey', params.pubkey);
  
  const response = await fetch(`${config.baseURL}/api/moderation/notifications?${queryParams}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 204) {
    // 204 No Content means no notifications, return empty arrays
    return { 
      notifications: [], 
      pagination: { 
        currentPage: 1, 
        pageSize: params.limit || 10, 
        totalItems: 0, 
        totalPages: 0, 
        hasNext: false, 
        hasPrevious: false 
      } 
    };
  } else if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return await response.json();
};

// Mark a specific notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
  const token = readToken();
  
  const response = await fetch(`${config.baseURL}/api/moderation/notifications/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ id: [id] }),
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  const token = readToken();
  
  const response = await fetch(`${config.baseURL}/api/moderation/notifications/read-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
};

// Get moderation statistics
export const getModerationStats = async (): Promise<ModerationStats> => {
  const token = readToken();
  
  const response = await fetch(`${config.baseURL}/api/moderation/stats`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return await response.json();
};

// Get details of a blocked event
export const getBlockedEvent = async (eventId: string): Promise<BlockedEventResponse> => {
  const token = readToken();
  
  const response = await fetch(`${config.baseURL}/api/moderation/blocked-event/${eventId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return await response.json();
};

// Unblock an incorrectly flagged event
export const unblockEvent = async (eventId: string): Promise<{ success: boolean; message: string; event_id: string }> => {
  const token = readToken();
  
  const response = await fetch(`${config.baseURL}/api/moderation/unblock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ event_id: eventId }),
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return await response.json();
};

// Permanently delete a moderated event
export const deleteModeratedEvent = async (eventId: string): Promise<{ success: boolean; message: string; event_id: string }> => {
  const token = readToken();
  
  const response = await fetch(`${config.baseURL}/api/moderation/event/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  
  return await response.json();
};
