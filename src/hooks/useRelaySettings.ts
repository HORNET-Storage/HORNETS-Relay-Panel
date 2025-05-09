import { useRef } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Settings, noteOptions, mimeTypeOptions, SubscriptionTier } from '@app/constants/relaySettings';
import useGenericSettings from './useGenericSettings';

// These interfaces are kept for backward compatibility
interface BackendSubscriptionTier {
  datalimit: string;
  price: string;
}

interface BackendRelaySettings {
  mode: string;
  protocol: CheckboxValueType[];
  chunked: CheckboxValueType[];
  chunksize: string;
  maxFileSize: number;
  maxFileSizeUnit: string;
  subscription_tiers: BackendSubscriptionTier[];
  freeTierEnabled: boolean;
  freeTierLimit: string;
  moderationMode: string;
  MimeTypeGroups: {
    images: string[];
    videos: string[];
    audio: string[];
    documents: string[];
  };
  MimeTypeWhitelist: string[];
  KindWhitelist: string[];
  isFileStorageActive?: boolean;
}

const defaultTiers: SubscriptionTier[] = [
  { data_limit: '1 GB per month', price: '8000' },
  { data_limit: '5 GB per month', price: '10000' },
  { data_limit: '10 GB per month', price: '15000' }
];

const getInitialSettings = (): Settings => ({
  mode: 'whitelist',
  protocol: ['WebSocket'],
  kinds: [],
  dynamicKinds: [],
  photos: [],
  videos: [],
  gitNestr: [],
  audio: [],
  appBuckets: [],
  dynamicAppBuckets: [],
  isKindsActive: true,
  isPhotosActive: true,
  isVideosActive: true,
  isGitNestrActive: true,
  isAudioActive: true,
  isFileStorageActive: false,
  subscription_tiers: defaultTiers,
  freeTierEnabled: false,
  freeTierLimit: '100 MB per month',
  moderationMode: 'strict' // Default to strict mode
});

/**
 * Hook for managing relay settings
 * This is a wrapper around useGenericSettings for backward compatibility
 */
const useRelaySettings = () => {
  // Use the generic settings hook internally
  const { 
    settings: genericSettings, 
    loading,
    error,
    fetchSettings: genericFetchSettings,
    updateSettings: genericUpdateSettings,
    saveSettings: genericSaveSettings
  } = useGenericSettings('relay_settings');
  
  // Keep track of the last mode to prevent unnecessary updates
  const lastMode = useRef(genericSettings?.mode || 'whitelist');
  
  // Transform the generic settings to the expected format
  const relaySettings: Settings = genericSettings as Settings || getInitialSettings();

  // Handle mode changes (previously in useEffect)
  const updateSettings = (category: keyof Settings, value: any) => {
    // Special handling for mode changes
    if (category === 'mode' && value !== lastMode.current) {
      lastMode.current = value;
      
      const updatedSettings = { ...relaySettings, [category]: value };
      
      if (value === 'blacklist') {
        // In blacklist mode, clear selections
        updatedSettings.kinds = [];
        updatedSettings.photos = [];
        updatedSettings.videos = [];
        updatedSettings.audio = [];
      }
      
      genericUpdateSettings(updatedSettings);
    } else {
      // Normal update for other settings
      genericUpdateSettings({ ...relaySettings, [category]: value });
    }
  };

  // Fetch settings using the generic hook
  const fetchSettings = async () => {
    await genericFetchSettings();
  };

  // Save settings using the generic hook
  const saveSettings = async () => {
    await genericSaveSettings();
  };

  return { 
    relaySettings, 
    fetchSettings, 
    updateSettings, 
    saveSettings,
    loading,
    error
  };
};

export default useRelaySettings;
