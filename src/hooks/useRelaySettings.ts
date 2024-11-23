import { useState, useEffect, useCallback } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { Settings, noteOptions, mimeTypeOptions, SubscriptionTier } from '@app/constants/relaySettings';

interface BackendSubscriptionTier {
  DataLimit: string;
  Price: string;
}

interface BackendRelaySettings {
  mode: string;
  protocol: CheckboxValueType[];
  chunked: CheckboxValueType[];
  chunksize: string;
  maxFileSize: number;
  maxFileSizeUnit: string;
  subscription_tiers: BackendSubscriptionTier[];
  MimeTypeGroups: {
    images: string[];
    videos: string[];
    audio: string[];
    documents: string[];
  };
  MimeTypeWhitelist: string[];
  KindWhitelist: string[];
}

const defaultTiers: SubscriptionTier[] = [
  { data_limit: '1 GB per month', price: '8000' },
  { data_limit: '5 GB per month', price: '10000' },
  { data_limit: '10 GB per month', price: '15000' }
];

const getInitialSettings = (): Settings => ({
  mode: 'smart',
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
  subscription_tiers: defaultTiers
});

const useRelaySettings = () => {
  const [relaySettings, setRelaySettings] = useState<Settings>(getInitialSettings());
  // Add state to store previous smart mode settings
  const [previousSmartSettings, setPreviousSmartSettings] = useState<{
    kinds: string[];
    photos: string[];
    videos: string[];
    audio: string[];
  } | null>(null);
  
  const handleLogout = useHandleLogout();
  const token = readToken();

  // Effect to handle mode changes
  useEffect(() => {
    if (relaySettings.mode === 'unlimited') {
      // Store current settings before clearing
      setPreviousSmartSettings({
        kinds: relaySettings.kinds,
        photos: relaySettings.photos,
        videos: relaySettings.videos,
        audio: relaySettings.audio,
      });
      
      setRelaySettings(prev => ({
        ...prev,
        kinds: [],
        photos: [],
        videos: [],
        audio: [],
      }));
    } else if (relaySettings.mode === 'smart' && previousSmartSettings) {
      // Restore previous smart mode settings
      setRelaySettings(prev => ({
        ...prev,
        kinds: previousSmartSettings.kinds,
        photos: previousSmartSettings.photos,
        videos: previousSmartSettings.videos,
        audio: previousSmartSettings.audio,
      }));
    }
  }, [relaySettings.mode]);

  const transformToBackendSettings = (settings: Settings): BackendRelaySettings => {
    const mimeGroups = {
      images: settings.photos,
      videos: settings.videos,
      audio: settings.audio,
      documents: [] as string[]
    };

    const selectedMimeTypes = [
      ...mimeGroups.images,
      ...mimeGroups.videos,
      ...mimeGroups.audio
    ];

    return {
      mode: settings.mode,
      protocol: settings.protocol as CheckboxValueType[],
      chunked: [],
      chunksize: '2',
      maxFileSize: 10,
      maxFileSizeUnit: 'MB',
      subscription_tiers: settings.subscription_tiers.map(tier => ({
        DataLimit: tier.data_limit,
        Price: tier.price
      })),
      MimeTypeGroups: mimeGroups,
      MimeTypeWhitelist: settings.mode === 'smart'
        ? selectedMimeTypes
        : mimeTypeOptions
            .map(m => m.value)
            .filter(mimeType => !selectedMimeTypes.includes(mimeType)),
      KindWhitelist: settings.mode === 'smart'
        ? settings.kinds
        : noteOptions
            .map(note => note.kindString)
            .filter(kind => !settings.kinds.includes(kind))
    };
  };

  const transformFromBackendSettings = (backendSettings: BackendRelaySettings): Settings => {
    const settings = getInitialSettings();
    settings.mode = backendSettings.mode;
    settings.protocol = backendSettings.protocol as string[];
    
    // Handle subscription tiers
    settings.subscription_tiers = backendSettings.subscription_tiers.map(tier => ({
      data_limit: tier.DataLimit || defaultTiers[0].data_limit,
      price: tier.Price || defaultTiers[0].price
    }));

    if (!settings.subscription_tiers.length || 
        settings.subscription_tiers.every(tier => !tier.data_limit)) {
      settings.subscription_tiers = defaultTiers;
    }

    if (backendSettings.mode === 'unlimited') {
      // In unlimited mode, start with empty selections
      settings.photos = [];
      settings.videos = [];
      settings.audio = [];
      settings.kinds = [];
    } else {
      // In smart mode, use the MimeTypeGroups directly
      settings.photos = backendSettings.MimeTypeGroups?.images || [];
      settings.videos = backendSettings.MimeTypeGroups?.videos || [];
      settings.audio = backendSettings.MimeTypeGroups?.audio || [];
      settings.kinds = backendSettings.KindWhitelist || [];
      
      // Store these as the previous smart settings
      setPreviousSmartSettings({
        kinds: settings.kinds,
        photos: settings.photos,
        videos: settings.videos,
        audio: settings.audio,
      });
    }

    // Set active states
    settings.isKindsActive = true;
    settings.isPhotosActive = true;
    settings.isVideosActive = true;
    settings.isAudioActive = true;
    
    return settings;
  };


  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/relay-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const settings = transformFromBackendSettings(data.relay_settings);
      setRelaySettings(settings);
      
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, [token, handleLogout]);

  const saveSettings = useCallback(async () => {
    try {
      const backendSettings = transformToBackendSettings(relaySettings);
      const response = await fetch(`${config.baseURL}/api/relay-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_settings: backendSettings }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Update previous smart settings after successful save
      if (relaySettings.mode === 'smart') {
        setPreviousSmartSettings({
          kinds: relaySettings.kinds,
          photos: relaySettings.photos,
          videos: relaySettings.videos,
          audio: relaySettings.audio,
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }, [relaySettings, token]);

  const updateSettings = useCallback((category: keyof Settings, value: any) => {
    setRelaySettings(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  return { relaySettings, fetchSettings, updateSettings, saveSettings };
};

export default useRelaySettings;
