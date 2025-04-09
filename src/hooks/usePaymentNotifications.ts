import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { PaymentNotification, PaymentNotificationParams, PaginationData } from '@app/api/paymentNotifications.api';

// Static variables outside the hook to ensure true singleton pattern
let isInitialized = false;
let activePollingInterval: NodeJS.Timeout | null = null;
let globalNotifications: PaymentNotification[] = [];
let globalPagination: PaginationData | null = null;
let globalLastFetchTime = 0;
let globalPreviousIds = new Set<number>();

interface UsePaymentNotificationsResult {
  notifications: PaymentNotification[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (params?: PaymentNotificationParams) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: (pubkey?: string) => Promise<void>;
}

/**
 * Shared fetchNotifications function to be used by all hook instances
 */
const fetchPaymentNotifications = async (params: PaymentNotificationParams = {}) => {
  try {
    const token = readToken();
    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.pubkey) queryParams.append('pubkey', params.pubkey);
    
    const response = await fetch(`${config.baseURL}/api/payment/notifications?${queryParams}`, {
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
      const newNotifications = data.notifications.filter((n: PaymentNotification) => !globalPreviousIds.has(n.id));
      
      // Notify user if there are new notifications and this isn't the first fetch
      if (newNotifications.length > 0) {
        notificationController.info({
          message: 'New payment notifications',
          description: `${newNotifications.length} new payment notification(s) received`
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
    
    // Merge server data with our local knowledge of read status
    const mergedNotifications = data.notifications.map((notification: PaymentNotification) => {
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
    globalPreviousIds = new Set(data.notifications.map((n: PaymentNotification) => n.id));
    
    return { notifications: data.notifications, pagination: data.pagination };
  } catch (error) {
    throw error;
  }
};

/**
 * Initialize the singleton polling mechanism
 */
const initializePolling = (initialParams?: PaymentNotificationParams) => {
  if (isInitialized) return;
  
  isInitialized = true;
  
  // Set up polling
  if (activePollingInterval) {
    clearInterval(activePollingInterval);
  }
  
  // Initial fetch
  fetchPaymentNotifications(initialParams).catch(error => 
    console.error('Failed to fetch payment notifications:', error)
  );
  
  // Set up recurring polling
  activePollingInterval = setInterval(() => {
    fetchPaymentNotifications(initialParams).catch(error => 
      console.error('Failed to fetch payment notifications:', error)
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
      fetchPaymentNotifications(initialParams).catch(error => 
        console.error('Failed to fetch payment notifications:', error)
      );
    }, interval);
  };

  // Set up visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange);
};

export const usePaymentNotifications = (initialParams?: PaymentNotificationParams): UsePaymentNotificationsResult => {
  const [notifications, setNotifications] = useState<PaymentNotification[]>(globalNotifications);
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
  
  const fetchNotifications = useCallback(async (params: PaymentNotificationParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { notifications: newNotifications, pagination: newPagination } = await fetchPaymentNotifications(params);
      
      // Local state update
      setNotifications(newNotifications);
      setPagination(newPagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment notifications';
      setError(errorMessage);
      notificationController.error({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a specific notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      console.log(`[usePaymentNotifications] Marking notification ${id} as read`);
      
      const response = await fetch(`${config.baseURL}/api/payment/notifications/read`, {
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
      
      // Update both local state and global state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      // Update global notifications state
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
  const markAllAsRead = useCallback(async (pubkey?: string) => {
    try {
      console.log(`[usePaymentNotifications] Marking all notifications as read${pubkey ? ` for ${pubkey}` : ''}`);
      
      const response = await fetch(`${config.baseURL}/api/payment/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: pubkey ? JSON.stringify({ pubkey }) : undefined,
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
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      // Update global state as well
      globalNotifications = globalNotifications.map(notification => 
        ({ ...notification, is_read: true })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      notificationController.error({ message: errorMessage });
    }
  }, [token, handleLogout]);


  return {
    notifications,
    pagination,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
