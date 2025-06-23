import { useState, useEffect, useCallback, useRef } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { Settings } from '@app/constants/relaySettings';
import { CORE_KINDS, ensureCoreKinds } from '@app/constants/coreKinds';

// Legacy interface - no longer used with new API
// interface BackendRelaySettings { ... }

const getInitialSettings = (): Settings => ({
  mode: 'whitelist',
  protocol: ['WebSocket'],
  kinds: [...CORE_KINDS], // Always start with core kinds
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
  moderationMode: 'strict', // Default to strict mode
  // Default file size limits in MB
  photoMaxSizeMB: 100,
  videoMaxSizeMB: 500,
  audioMaxSizeMB: 100
});

const useRelaySettings = () => {
  const [relaySettings, setRelaySettings] = useState<Settings>(getInitialSettings());
  const [previousSmartSettings, setPreviousSmartSettings] = useState<{
    kinds: string[];
    photos: string[];
    videos: string[];
    audio: string[];
  } | null>(null);

  const handleLogout = useHandleLogout();
  const token = readToken();
  
  // Keep track of the last mode to prevent unnecessary updates
  const lastMode = useRef(relaySettings.mode);

  /* eslint-disable react-hooks/exhaustive-deps */
  // Effect to handle mode changes
  useEffect(() => {
    if (relaySettings.mode === lastMode.current) {
      return;
    }

    lastMode.current = relaySettings.mode;

    if (relaySettings.mode === 'blacklist') {
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
    } else if (relaySettings.mode === 'whitelist' && previousSmartSettings) {
      // Restore previous whitelist mode settings
      setRelaySettings(prev => ({
        ...prev,
        kinds: previousSmartSettings.kinds,
        photos: previousSmartSettings.photos,
        videos: previousSmartSettings.videos,
        audio: previousSmartSettings.audio,
      }));
    }
  }, [relaySettings.mode, previousSmartSettings]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Legacy transformation functions - kept for reference but not used with new API
  // These can be removed once migration is fully tested

  // Simplified transformation functions based on actual backend response
  const transformFromBackendSettings = useCallback((backendData: any): Settings => {
    console.log('Raw backend settings:', backendData);
    const settings = getInitialSettings();
    
    // Map from actual backend structure
    if (backendData.event_filtering) {
      settings.mode = backendData.event_filtering.mode || 'whitelist';
      settings.moderationMode = backendData.event_filtering.moderation_mode || 'strict';
      // Always ensure core kinds are included from backend data
      const backendKinds = backendData.event_filtering.kind_whitelist || [];
      settings.kinds = ensureCoreKinds(backendKinds);
      
      // Extract mime types and file sizes from actual backend format
      const mediaDefinitions = backendData.event_filtering.media_definitions || {};
      settings.photos = mediaDefinitions.image?.mimepatterns || [];
      settings.videos = mediaDefinitions.video?.mimepatterns || [];
      settings.audio = mediaDefinitions.audio?.mimepatterns || [];
      
      // Extract file size limits
      settings.photoMaxSizeMB = mediaDefinitions.image?.maxsizemb || 100;
      settings.videoMaxSizeMB = mediaDefinitions.video?.maxsizemb || 500;
      settings.audioMaxSizeMB = mediaDefinitions.audio?.maxsizemb || 100;
      
      // Set protocols
      if (backendData.event_filtering.protocols?.enabled) {
        settings.protocol = backendData.event_filtering.protocols.allowed_protocols || ['WebSocket'];
      } else {
        settings.protocol = ['WebSocket'];
      }
    }

    // Store these as the previous whitelist settings if in whitelist mode
    if (settings.mode === 'whitelist') {
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
    settings.isFileStorageActive = true;

    return settings;
  }, []);

  const transformToBackendSettings = useCallback((settings: Settings) => {
    const mediaDefinitions: any = {};
    
    // Create media definitions in the format backend expects
    if (settings.photos.length > 0) {
      mediaDefinitions.image = {
        mimepatterns: settings.photos,
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        maxsizemb: settings.photoMaxSizeMB
      };
    }
    
    if (settings.videos.length > 0) {
      mediaDefinitions.video = {
        mimepatterns: settings.videos,
        extensions: [".mp4", ".webm", ".avi", ".mov"],
        maxsizemb: settings.videoMaxSizeMB
      };
    }
    
    if (settings.audio.length > 0) {
      mediaDefinitions.audio = {
        mimepatterns: settings.audio,
        extensions: [".mp3", ".wav", ".ogg", ".flac"],
        maxsizemb: settings.audioMaxSizeMB
      };
    }

    return {
      settings: {
        event_filtering: {
          mode: settings.mode,
          moderation_mode: settings.moderationMode,
          kind_whitelist: ensureCoreKinds(settings.kinds), // Always include core kinds
          media_definitions: mediaDefinitions,
          dynamic_kinds: {
            enabled: false,
            allowed_kinds: []
          },
          protocols: {
            enabled: settings.protocol.length > 0,
            allowed_protocols: settings.protocol
          }
        }
      }
    };
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/settings`, {
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
      const settings = transformFromBackendSettings(data.settings);
      setRelaySettings(settings);

    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, [token, handleLogout, transformFromBackendSettings]);

  const saveSettings = useCallback(async () => {
    try {
      const updateRequest = transformToBackendSettings(relaySettings);
      
      const response = await fetch(`${config.baseURL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Update previous whitelist settings after successful save
      if (relaySettings.mode === 'whitelist') {
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
  }, [relaySettings, token, transformToBackendSettings]);

  const updateSettings = useCallback((category: keyof Settings, value: any) => {
    setRelaySettings(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  return { relaySettings, fetchSettings, updateSettings, saveSettings };
};

export default useRelaySettings;
