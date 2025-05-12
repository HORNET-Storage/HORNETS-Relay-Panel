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
      
      console.log(`Fetching ${groupName} settings...`);

      const response = await fetch(`${config.baseURL}/api/settings/${groupName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized access, logging out');
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Raw ${groupName} settings data:`, data);
      
      // The API returns data in the format { [groupName]: settings }
      const settingsData = data[groupName] as SettingsGroupType<T>;

      if (!settingsData) {
        console.warn(`No settings data found for group: ${groupName}`);
        // Return empty object instead of null to prevent errors when accessing properties
        setSettings({} as SettingsGroupType<T>);
      } else {
        console.log(`Processed ${groupName} settings:`, settingsData);
        
        // Handle all settings groups the same way - no special handling for image_moderation
        // This approach works for all other settings groups, so it should work for image_moderation too
        setSettings(settingsData as SettingsGroupType<T>);
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
    console.log(`Updating ${groupName} settings:`, updatedSettings);
    setSettings(prevSettings => {
      if (!prevSettings) {
        console.log(`No previous ${groupName} settings, using updated settings as initial`);
        return updatedSettings as SettingsGroupType<T>;
      }
      
      // No special handling for image_moderation - treat all settings groups the same
      const newSettings = { ...prevSettings, ...updatedSettings };
      console.log(`New ${groupName} settings after update:`, newSettings);
      return newSettings;
    });
  }, [groupName]);

  const saveSettings = useCallback(async () => {
    if (!settings) {
      console.warn('No settings to save');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // For image_moderation, we need to transform the prefixed keys back to unprefixed keys
      let dataToSave = settings;
      
      if (groupName === 'image_moderation') {
        // Map from prefixed to unprefixed keys
        const prefixMap: Record<string, string> = {
          'image_moderation_api': 'api',
          'image_moderation_check_interval': 'check_interval',
          'image_moderation_concurrency': 'concurrency',
          'image_moderation_enabled': 'enabled',
          'image_moderation_mode': 'mode',
          'image_moderation_temp_dir': 'temp_dir',
          'image_moderation_threshold': 'threshold',
          'image_moderation_timeout': 'timeout'
        };
        
        // Create a new object with only the unprefixed keys
        const unprefixedSettings: Record<string, any> = {};
        const settingsObj = settings as Record<string, any>;
        
        // Transform all prefixed keys to unprefixed keys
        Object.entries(prefixMap).forEach(([prefixedKey, unprefixedKey]) => {
          // Set the value in the unprefixed object, preserving the data type
          unprefixedSettings[unprefixedKey] = settingsObj[prefixedKey];
        });
        
        console.log(`Transformed settings for backend (unprefixed keys):`, unprefixedSettings);
        dataToSave = unprefixedSettings as SettingsGroupType<T>;
      }
      
      console.log(`Saving ${groupName} settings:`, dataToSave);

      const response = await fetch(`${config.baseURL}/api/settings/${groupName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ [groupName]: dataToSave }),
      });

      if (response.status === 401) {
        console.error('Unauthorized access when saving, logging out');
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`${groupName} settings saved successfully`);
      
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
