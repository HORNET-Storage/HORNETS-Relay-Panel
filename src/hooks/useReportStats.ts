import { useState, useEffect, useCallback } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { ReportStats } from '@app/api/reportNotifications.api';

export const useReportStats = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogout = useHandleLogout();
  const token = readToken();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.baseURL}/api/reports/stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report statistics';
      setError(errorMessage);
      notificationController.error({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [token, handleLogout]);

  // Fetch stats on initial load
  useEffect(() => {
    fetchStats();
    
    // Set up polling for stats (using same interval as notifications)
    const interval = setInterval(() => {
      fetchStats();
    }, config.notifications.pollingInterval);
    
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats
  };
};
