import { useState, useEffect, useCallback } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { SettingsGroupName, SettingsGroupType } from '@app/types/settings.types';

// Helper function to extract the correct nested data for each settings group
const extractSettingsForGroup = (settings: any, groupName: string) => {
  console.log(`Extracting settings for group: ${groupName}`, settings);
  
  let rawData: any = {};
  
  switch (groupName) {
    case 'image_moderation':
      rawData = settings?.content_filtering?.image_moderation || {};
      break;
    
    case 'content_filter':
      rawData = settings?.content_filtering?.text_filter || {};
      break;
    
    
    case 'ollama':
      rawData = settings?.external_services?.ollama || {};
      break;
    
    case 'wallet':
      rawData = settings?.external_services?.wallet || {};
      break;
    
    case 'relay_info':
      rawData = settings?.relay || {};
      break;
    
    case 'general':
      rawData = settings?.server || {};
      break;
    
    default:
      console.warn(`Unknown settings group: ${groupName}`);
      return {};
  }

  // Handle the prefixed field name issue
  // The backend returns both prefixed and unprefixed fields, but forms expect prefixed ones
  if (groupName === 'image_moderation' && rawData) {
    const processedData: any = {};
    
    // Map backend fields to prefixed ones that the form expects
    // Based on the actual backend response, backend sends both prefixed and unprefixed versions
    const imageModerationMappings: Record<string, string[]> = {
      'image_moderation_api': ['image_moderation_api'],
      'image_moderation_check_interval': ['image_moderation_check_interval_seconds', 'check_interval_seconds'],
      'image_moderation_concurrency': ['image_moderation_concurrency', 'concurrency'],
      'image_moderation_enabled': ['image_moderation_enabled', 'enabled'],
      'image_moderation_mode': ['image_moderation_mode', 'mode'],
      'image_moderation_temp_dir': ['image_moderation_temp_dir'],
      'image_moderation_threshold': ['image_moderation_threshold', 'threshold'],
      'image_moderation_timeout': ['image_moderation_timeout_seconds', 'timeout_seconds']
    };
    
    // Map fields, prioritizing prefixed versions if they exist
    Object.entries(imageModerationMappings).forEach(([formField, possibleBackendFields]) => {
      for (const backendField of possibleBackendFields) {
        if (rawData[backendField] !== undefined) {
          processedData[formField] = rawData[backendField];
          break; // Use the first found value
        }
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  if (groupName === 'content_filter' && rawData) {
    const processedData: any = {};
    
    // Handle content filter prefixed fields
    const contentFilterMappings: Record<string, string> = {
      'content_filter_cache_size': 'cache_size',
      'content_filter_cache_ttl': 'cache_ttl_seconds', 
      'content_filter_enabled': 'enabled',
      'full_text_kinds': 'full_text_search_kinds' // Special mapping
    };
    
    // Start with raw data
    Object.keys(rawData).forEach(key => {
      processedData[key] = rawData[key];
    });
    
    // Apply prefixed field mappings
    Object.entries(contentFilterMappings).forEach(([prefixedKey, rawKey]) => {
      if (rawData[rawKey] !== undefined) {
        processedData[prefixedKey] = rawData[rawKey];
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  
  // Handle wallet field name mapping
  if (groupName === 'wallet' && rawData) {
    const processedData: any = {};
    
    // Map backend field names to frontend field names
    const walletMappings: Record<string, string> = {
      'wallet_name': 'name',
      'wallet_api_key': 'key' // Backend sends 'key', frontend expects 'wallet_api_key'
    };
    
    // Apply field mappings
    Object.entries(walletMappings).forEach(([frontendKey, backendKey]) => {
      if (rawData[backendKey] !== undefined) {
        processedData[frontendKey] = rawData[backendKey];
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  // Handle general settings field name mapping
  if (groupName === 'general' && rawData) {
    const processedData: any = {};
    
    // General settings come from both server and relay sections
    // We need to access both sections from the root settings
    const relayData = settings?.relay || {};
    
    // Map backend field names to frontend field names
    // Some fields come from server section, others from relay section
    const generalMappings: Record<string, { section: string; field: string }> = {
      'port': { section: 'server', field: 'port' },
      'private_key': { section: 'relay', field: 'private_key' },
      'service_tag': { section: 'relay', field: 'service_tag' },
      'relay_stats_db': { section: 'server', field: 'stats_db' },
      'proxy': { section: 'server', field: 'proxy' }, // May not exist
      'demo_mode': { section: 'server', field: 'demo' },
      'web': { section: 'server', field: 'web' }
    };
    
    // Apply field mappings
    Object.entries(generalMappings).forEach(([frontendKey, mapping]) => {
      const sourceData = mapping.section === 'relay' ? relayData : rawData;
      if (sourceData[mapping.field] !== undefined) {
        processedData[frontendKey] = sourceData[mapping.field];
      } else {
        // Set default values for missing fields
        if (frontendKey === 'relay_stats_db') {
          processedData[frontendKey] = ''; // Default empty
        } else if (frontendKey === 'proxy') {
          processedData[frontendKey] = false; // Default false
        }
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  // Handle relay info field name mapping
  if (groupName === 'relay_info' && rawData) {
    const processedData: any = {};
    
    // Map backend field names to frontend field names
    const relayInfoMappings: Record<string, string> = {
      'relayname': 'name',
      'relaydescription': 'description', 
      'relaycontact': 'contact',
      'relaypubkey': 'public_key', // Backend sends 'public_key'
      'relaydhtkey': 'dht_key',
      'relaysoftware': 'software',
      'relayversion': 'version',
      'relaysupportednips': 'supported_nips'
    };
    
    // Apply field mappings
    Object.entries(relayInfoMappings).forEach(([frontendKey, backendKey]) => {
      if (rawData[backendKey] !== undefined) {
        processedData[frontendKey] = rawData[backendKey];
      } else {
        // Set default values for missing fields
        if (frontendKey === 'relaysupportednips') {
          processedData[frontendKey] = []; // Default empty array
        }
      }
    });
    
    console.log(`Processed ${groupName} data:`, processedData);
    return processedData;
  }
  
  return rawData;
};

// Helper function to build the nested update structure for the new API
const buildNestedUpdate = (groupName: string, data: any) => {
  switch (groupName) {
    case 'image_moderation':
      return {
        settings: {
          content_filtering: {
            image_moderation: data
          }
        }
      };
    
    case 'content_filter':
      return {
        settings: {
          content_filtering: {
            text_filter: data
          }
        }
      };
    
    
    case 'ollama':
      return {
        settings: {
          external_services: {
            ollama: data
          }
        }
      };
    
    case 'wallet':
      // Reverse the field mapping for saving
      const backendWalletData: any = {};
      const walletFieldMappings: Record<string, string> = {
        'name': 'wallet_name',
        'key': 'wallet_api_key'
      };
      
      Object.entries(walletFieldMappings).forEach(([backendKey, frontendKey]) => {
        if (data[frontendKey] !== undefined) {
          backendWalletData[backendKey] = data[frontendKey];
        }
      });
      
      return {
        settings: {
          external_services: {
            wallet: backendWalletData
          }
        }
      };
    
    case 'relay_info':
      // Reverse the field mapping for saving
      const backendRelayData: any = {};
      const relayFieldMappings: Record<string, string> = {
        'name': 'relayname',
        'description': 'relaydescription',
        'contact': 'relaycontact', 
        'public_key': 'relaypubkey', // Frontend 'relaypubkey' -> backend 'public_key'
        'dht_key': 'relaydhtkey',
        'software': 'relaysoftware',
        'version': 'relayversion',
        'supported_nips': 'relaysupportednips'
      };
      
      Object.entries(relayFieldMappings).forEach(([backendKey, frontendKey]) => {
        if (data[frontendKey] !== undefined) {
          // Special handling for supported_nips to ensure they're numbers
          if (backendKey === 'supported_nips') {
            const nips = data[frontendKey];
            if (Array.isArray(nips)) {
              backendRelayData[backendKey] = nips.map((nip: any) => Number(nip)).filter((nip: number) => !isNaN(nip));
            } else {
              backendRelayData[backendKey] = [];
            }
          } else {
            backendRelayData[backendKey] = data[frontendKey];
          }
        }
      });
      
      return {
        settings: {
          relay: backendRelayData
        }
      };
    
    case 'general':
      // Reverse the field mapping for saving
      // General settings need to be split between server and relay sections
      const serverData: any = {};
      const relayData: any = {};
      
      const generalFieldMappings: Record<string, { section: string; field: string }> = {
        'port': { section: 'server', field: 'port' },
        'private_key': { section: 'relay', field: 'private_key' },
        'service_tag': { section: 'relay', field: 'service_tag' },
        'stats_db': { section: 'server', field: 'relay_stats_db' },
        'proxy': { section: 'server', field: 'proxy' },
        'demo': { section: 'server', field: 'demo_mode' }, // Frontend 'demo_mode' -> backend 'demo'
        'web': { section: 'server', field: 'web' }
      };
      
      Object.entries(generalFieldMappings).forEach(([backendField, mapping]) => {
        const frontendField = mapping.field;
        if (data[frontendField] !== undefined) {
          if (mapping.section === 'server') {
            serverData[backendField] = data[frontendField];
          } else {
            relayData[backendField] = data[frontendField];
          }
        }
      });
      
      // Return nested structure with both server and relay sections
      const result: any = { settings: {} };
      if (Object.keys(serverData).length > 0) {
        result.settings.server = serverData;
      }
      if (Object.keys(relayData).length > 0) {
        result.settings.relay = relayData;
      }
      
      return result;
    
    default:
      console.warn(`Unknown settings group for save: ${groupName}`);
      return {
        settings: {}
      };
  }
};

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

      const response = await fetch(`${config.baseURL}/api/settings`, {
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
      console.log(`Raw settings data:`, data);
      
      // Extract the correct nested data based on groupName
      const settingsData = extractSettingsForGroup(data.settings, groupName) as SettingsGroupType<T>;

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

        // First fetch complete settings structure to preserve all values
        console.log(`Fetching complete settings before saving ${groupName}...`);
        const fetchResponse = await fetch(`${config.baseURL}/api/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!fetchResponse.ok) {
          throw new Error(`Failed to fetch current settings: ${fetchResponse.status}`);
        }

        const currentData = await fetchResponse.json();
        const currentSettings = extractSettingsForGroup(currentData.settings, groupName) || {};
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

      // Construct the nested update structure for the new API
      const nestedUpdate = buildNestedUpdate(groupName, dataToSave);
      console.log(`Nested update structure:`, nestedUpdate);

      const response = await fetch(`${config.baseURL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nestedUpdate),
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
