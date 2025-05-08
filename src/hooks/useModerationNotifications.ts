import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import * as moderationNotificationsApi from '@app/api/moderationNotifications.api';
import { BlockedEventResponse } from '@app/api/moderationNotifications.api';

// Static variables outside the hook to ensure true singleton pattern
let isInitialized = false;
let activePollingInterval: NodeJS.Timeout | null = null;
let globalNotifications: ModerationNotification[] = [];
let globalPagination: PaginationData | null = null;
let globalLastFetchTime = 0;
let globalPreviousIds = new Set<number>();

// Types moved from the API file to here
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

interface UseModerationNotificationsResult {
  notifications: ModerationNotification[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (params?: ModerationNotificationParams) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getBlockedEvent: (eventId: string) => Promise<BlockedEventResponse>;
  unblockEvent: (eventId: string) => Promise<{ success: boolean; message: string; event_id: string }>;
  deleteEvent: (eventId: string) => Promise<{ success: boolean; message: string; event_id: string }>;
}

// Set of event IDs that we know don't exist in the backend
// Store it in the window object so it can be accessed from other components
(window as any).nonExistentEventIds = (window as any).nonExistentEventIds || new Set<string>();
const nonExistentEventIds = (window as any).nonExistentEventIds;

/**
 * Shared fetchNotifications function to be used by all hook instances
 */
const fetchModerationNotifications = async (params: ModerationNotificationParams = {}) => {
  try {
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
      return { notifications: [], pagination: { currentPage: 1, pageSize: params.limit || 10, totalItems: 0, totalPages: 0, hasNext: false, hasPrevious: false } };
    } else if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    
    // Only parse JSON if there's content
    const data = response.status !== 204 ? await response.json() : { notifications: [], pagination: null };
    
    // Check if there are new notifications
    if (globalLastFetchTime > 0) {
      const newNotifications = data.notifications.filter((n: ModerationNotification) => !globalPreviousIds.has(n.id));
      
      // Notify user if there are new notifications and this isn't the first fetch
      if (newNotifications.length > 0) {
        notificationController.info({
          message: 'New moderation notifications',
          description: `${newNotifications.length} new notification(s) received`
        });
      }
    }
    
    // Track manually marked as read notifications to prevent them from reappearing
    const manuallyMarkedAsRead = new Set<number>();
    
    // If we have existing notifications that are marked as read but server has them as unread,
    // we'll trust our local state (they were manually marked as read)
    globalNotifications.forEach(notification => {
      if (notification.is_read) {
        manuallyMarkedAsRead.add(notification.id);
      }
    });
    
    // Filter out notifications for events that we know don't exist
    const filteredNotifications = data.notifications.filter(
      (notification: ModerationNotification) => !nonExistentEventIds.has(notification.event_id)
    );
    
    // Merge server data with our local knowledge of read status
    const mergedNotifications = filteredNotifications.map((notification: ModerationNotification) => {
      // If we previously marked this as read manually, keep it marked as read
      if (manuallyMarkedAsRead.has(notification.id)) {
        return { ...notification, is_read: true };
      }
      return notification;
    });
    
    // Update global state
    globalNotifications = mergedNotifications;
    globalPagination = data.pagination;
    globalLastFetchTime = Date.now();
    globalPreviousIds = new Set(filteredNotifications.map((n: ModerationNotification) => n.id));
    
    return { notifications: mergedNotifications, pagination: data.pagination };
  } catch (error) {
    throw error;
  }
};

/**
 * Initialize the singleton polling mechanism
 */
const initializePolling = (initialParams?: ModerationNotificationParams) => {
  if (isInitialized) return;
  
  isInitialized = true;
  
  // Set up polling
  if (activePollingInterval) {
    clearInterval(activePollingInterval);
  }
  
  // Initial fetch
  fetchModerationNotifications(initialParams).catch(error => 
    console.error('Failed to fetch moderation notifications:', error)
  );
  
  // Set up recurring polling
  activePollingInterval = setInterval(() => {
    fetchModerationNotifications(initialParams).catch(error => 
      console.error('Failed to fetch moderation notifications:', error)
    );
  }, config.notifications.pollingInterval);
  
  // Set up visibility change handler
  const handleVisibilityChange = () => {
    // Clear existing interval
    if (activePollingInterval) {
      clearInterval(activePollingInterval);
    }
    
    // Use different interval based on visibility
    const interval = document.hidden 
      ? config.notifications.backgroundPollingInterval
      : config.notifications.pollingInterval;
    
    // Set up new interval
    activePollingInterval = setInterval(() => {
      fetchModerationNotifications(initialParams).catch(error => 
        console.error('Failed to fetch moderation notifications:', error)
      );
    }, interval);
  };

  // Set up visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange);
};

export const useModerationNotifications = (initialParams?: ModerationNotificationParams): UseModerationNotificationsResult => {
  const [notifications, setNotifications] = useState<ModerationNotification[]>(globalNotifications);
  const [pagination, setPagination] = useState<PaginationData | null>(globalPagination);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogout = useHandleLogout();
  const token = readToken();

  // Initialize polling on first mount of any instance
  useEffect(() => {
    // Initialize the singleton poller
    initializePolling(initialParams);
    
    // Subscribe to changes in the global state
    const checkForUpdates = setInterval(() => {
      setNotifications(globalNotifications);
      setPagination(globalPagination);
    }, 1000); // Check every second
    
    return () => {
      clearInterval(checkForUpdates);
    };
  }, [initialParams]);
  
  const fetchNotifications = useCallback(async (params: ModerationNotificationParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { notifications: newNotifications, pagination: newPagination } = await fetchModerationNotifications(params);
      
      // Local state update
      setNotifications(newNotifications);
      setPagination(newPagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch moderation notifications';
      setError(errorMessage);
      notificationController.error({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a specific notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      console.log(`[useModerationNotifications] Marking notification ${id} as read`);
      
      const response = await fetch(`${config.baseURL}/api/moderation/notifications/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id }), // Changed from array to single value to match backend expectation
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      // Update global state as well to ensure all components see the change
      globalNotifications = globalNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, is_read: true } 
          : notification
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      notificationController.error({ message: errorMessage });
    }
  }, [token, handleLogout]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      console.log(`[useModerationNotifications] Marking all notifications as read`);
      
      const response = await fetch(`${config.baseURL}/api/moderation/notifications/read-all`, {
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
      
      // Update local state as well
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      notificationController.error({ message: errorMessage });
    }
  }, [token, handleLogout]);

  // Get details of a blocked event
  const getBlockedEvent = useCallback(async (eventId: string) => {
    try {
      console.log(`[useModerationNotifications] Getting details for blocked event ${eventId}`);
      return await moderationNotificationsApi.getBlockedEvent(eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blocked event details';
      notificationController.error({ message: errorMessage });
      throw err;
    }
  }, []);

  // Unblock an incorrectly flagged event
  const unblockEvent = useCallback(async (eventId: string) => {
    try {
      console.log(`[useModerationNotifications] Unblocking event ${eventId}`);
      return await moderationNotificationsApi.unblockEvent(eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unblock event';
      notificationController.error({ message: errorMessage });
      throw err;
    }
  }, []);

  // Permanently delete a moderated event
  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      console.log(`[useModerationNotifications] Permanently deleting event ${eventId}`);
      return await moderationNotificationsApi.deleteModeratedEvent(eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      notificationController.error({ message: errorMessage });
      throw err;
    }
  }, []);

  return {
    notifications,
    pagination,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getBlockedEvent,
    unblockEvent,
    deleteEvent
  };
};
