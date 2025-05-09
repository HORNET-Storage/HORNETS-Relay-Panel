import { useState, useEffect, useCallback } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { SettingsGroupName, SettingsGroupType } from '@app/types/settings.types';

interface UseGenericSettingsResult<T> {
  settings: T | null;
  loading: boolean;
  error: Error | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updatedSettings: Partial<T>) => void;
  saveSettings: () => Promise<void>;
}

/**
 * A hook for managing generic settings groups
 * @param groupName The name of the settings group to manage
 * @returns Object containing settings data and methods to fetch, update, and save settings
 */
const useGenericSettings = <T extends SettingsGroupName>(
  groupName: T
): UseGenericSettingsResult<SettingsGroupType<T>> => {
  const [settings, setSettings] = useState<SettingsGroupType<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = useHandleLogout();
  const token = readToken();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${config.baseURL}/api/settings/${groupName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // The API returns data in the format { [groupName]: settings }
      const settingsData = data[groupName] as SettingsGroupType<T>;
      
      if (!settingsData) {
        console.warn(`No settings data found for group: ${groupName}`);
        // Return empty object instead of null to prevent errors when accessing properties
        setSettings({} as SettingsGroupType<T>);
      } else {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error(`Error fetching ${groupName} settings:`, error);
      setError(error instanceof Error ? error : new Error(String(error)));
      // Set empty object on error to prevent null reference errors
      setSettings({} as SettingsGroupType<T>);
    } finally {
      setLoading(false);
    }
  }, [groupName, token, handleLogout]);

  const updateSettings = useCallback((updatedSettings: Partial<SettingsGroupType<T>>) => {
    setSettings(prevSettings => {
      if (!prevSettings) {
        return updatedSettings as SettingsGroupType<T>;
      }
      return { ...prevSettings, ...updatedSettings };
    });
  }, []);

  const saveSettings = useCallback(async () => {
    if (!settings) {
      console.warn('No settings to save');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${config.baseURL}/api/settings/${groupName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ [groupName]: settings }),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally refresh settings after save to get any server-side changes
      await fetchSettings();
    } catch (error) {
      console.error(`Error saving ${groupName} settings:`, error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [groupName, settings, token, handleLogout, fetchSettings]);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  };
};

export default useGenericSettings;
