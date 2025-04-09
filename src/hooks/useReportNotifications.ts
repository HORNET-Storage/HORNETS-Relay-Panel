import { useState, useEffect, useCallback } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';

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

export interface UseReportNotificationsReturn {
  notifications: ReportNotification[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (params?: ReportNotificationParams) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getReportedEventContent: (eventId: string) => Promise<{ event: any } | null>;
  deleteReportedEvent: (eventId: string) => Promise<boolean>;
}

export const useReportNotifications = (): UseReportNotificationsReturn => {
  const [notifications, setNotifications] = useState<ReportNotification[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogout = useHandleLogout();
  const token = readToken();

  const fetchNotifications = useCallback(async (params: ReportNotificationParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.filter) queryParams.append('filter', params.filter);
      
      const response = await fetch(`${config.baseURL}/api/reports/notifications?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 204) {
        // 204 No Content means no notifications, return empty arrays
        setNotifications([]);
        setPagination({ 
          currentPage: 1, 
          pageSize: params.limit || 10, 
          totalItems: 0, 
          totalPages: 0, 
          hasNext: false, 
          hasPrevious: false 
        });
        return;
      } else if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }
      
      // Parse JSON if there's content
      const data = await response.json();
      
      setNotifications(data.notifications);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report notifications';
      setError(errorMessage);
      console.error('Failed to fetch report notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, handleLogout]);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${config.baseURL}/api/reports/notifications/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      notificationController.error({ message: errorMessage });
      console.error('Failed to mark notification as read:', err);
    }
  }, [token, handleLogout]);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/reports/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      notificationController.error({ message: errorMessage });
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [token, handleLogout]);

  const getReportedEventContent = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`${config.baseURL}/api/reports/event/${eventId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return null;
        }
        throw new Error(`Request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch reported event content:', err);
      return null;
    }
  }, [token, handleLogout]);

  const deleteReportedEvent = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`${config.baseURL}/api/reports/event/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return false;
        }
        throw new Error(`Request failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the deleted notification from state
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.event_id !== eventId)
        );
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Failed to delete reported event:', err);
      return false;
    }
  }, [token, handleLogout]);

  return {
    notifications,
    pagination,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getReportedEventContent,
    deleteReportedEvent,
  };
};
