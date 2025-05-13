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

    // All groups should preserve existing settings when updating
    setSettings(prevSettings => {
      if (!prevSettings) {
        console.log(`No previous ${groupName} settings, using updated settings as initial`);
        return updatedSettings as SettingsGroupType<T>;
      }

      // Create a deep copy of the previous settings
      const prevSettingsCopy = { ...prevSettings };

      // Only update the changed fields, preserving all other fields
      const newSettings = { ...prevSettingsCopy, ...updatedSettings };

      console.log(`Previous settings:`, prevSettingsCopy);
      console.log(`Updated fields:`, updatedSettings);
      console.log(`Merged settings:`, newSettings);

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

      // By default, use settings as-is
      let dataToSave = settings;

      // Define settings groups that need special handling
      const prefixedSettingsMap: Record<string, { prefix: string, formKeys: string[] }> = {
        'image_moderation': {
          prefix: 'image_moderation_',
          formKeys: [
            'image_moderation_api',
            'image_moderation_check_interval',
            'image_moderation_concurrency',
            'image_moderation_enabled',
            'image_moderation_mode',
            'image_moderation_temp_dir',
            'image_moderation_threshold',
            'image_moderation_timeout'
          ]
        },
        'content_filter': {
          prefix: 'content_filter_',
          formKeys: [
            'content_filter_cache_size',
            'content_filter_cache_ttl',
            'content_filter_enabled',
            'full_text_kinds' // Special case without prefix
          ]
        },
        'nest_feeder': {
          prefix: 'nest_feeder_',
          formKeys: [
            'nest_feeder_cache_size',
            'nest_feeder_cache_ttl',
            'nest_feeder_enabled',
            'nest_feeder_timeout',
            'nest_feeder_url'
          ]
        },
        'ollama': {
          prefix: 'ollama_',
          formKeys: [
            'ollama_model',
            'ollama_timeout',
            'ollama_url'
          ]
        },
        'xnostr': {
          prefix: 'xnostr_',
          formKeys: [
            'xnostr_browser_path',
            'xnostr_browser_pool_size',
            'xnostr_check_interval',
            'xnostr_concurrency',
            'xnostr_enabled',
            'xnostr_temp_dir',
            'xnostr_update_interval',
            'xnostr_nitter',
            'xnostr_verification_intervals'
          ]
        },
        'wallet': {
          prefix: 'wallet_',
          formKeys: [
            'wallet_api_key',
            'wallet_name'
          ]
        }
      };

      // Check if this group needs special handling
      if (groupName in prefixedSettingsMap) {
        console.log(`Settings from state for ${groupName}:`, settings);
        const { prefix, formKeys } = prefixedSettingsMap[groupName];

        // First fetch current settings to preserve values not in the form
        console.log(`Fetching current ${groupName} settings before saving...`);
        const fetchResponse = await fetch(`${config.baseURL}/api/settings/${groupName}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!fetchResponse.ok) {
          throw new Error(`Failed to fetch current settings: ${fetchResponse.status}`);
        }

        const currentData = await fetchResponse.json();
        const currentSettings = currentData[groupName] || {};
        console.log(`Current ${groupName} settings from API:`, currentSettings);

        // Create a properly prefixed object for the API
        const prefixedSettings: Record<string, any> = {};

        // Copy all existing settings from the backend with correct prefixes
        Object.entries(currentSettings).forEach(([key, value]) => {
          // Special case for content_filter's full_text_kinds which doesn't have prefix
          if (groupName === 'content_filter' && key === 'full_text_kinds') {
            prefixedSettings[key] = value;
          } else {
            prefixedSettings[`${prefix}${key}`] = value;
          }
        });

        // Update with changed values from the form
        const settingsObj = settings as Record<string, any>;

        // Update each field that has changed
        formKeys.forEach(formKey => {
          if (formKey in settingsObj && settingsObj[formKey] !== undefined) {
            console.log(`Updating field: ${formKey} from ${prefixedSettings[formKey]} to ${settingsObj[formKey]}`);
            prefixedSettings[formKey] = settingsObj[formKey];
          }
        });

        console.log(`Final ${groupName} settings with prefixed keys for API:`, prefixedSettings);
        dataToSave = prefixedSettings as unknown as SettingsGroupType<T>;
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
