import { useState, useEffect, useCallback, useRef } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { Settings } from '@app/constants/relaySettings';
import { CORE_KINDS, ensureCoreKinds, calculateInverseKinds, getAllPossibleKinds, isCoreKind, getAllPossibleMediaTypes, calculateInverseMediaTypes } from '@app/constants/coreKinds';

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
  const lastMode = useRef<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  // Effect to handle mode changes - only for manual user mode switches, not initial load
  useEffect(() => {
    // Skip if this is the initial load (lastMode is undefined/null)
    if (lastMode.current === undefined || lastMode.current === null) {
      lastMode.current = relaySettings.mode;
      return;
    }

    // Skip if mode hasn't actually changed
    if (relaySettings.mode === lastMode.current) {
      return;
    }

    console.log(`[useRelaySettings] Mode change detected: ${lastMode.current} -> ${relaySettings.mode}`);

    // When user manually switches TO blacklist mode from whitelist mode
    if (relaySettings.mode === 'blacklist' && lastMode.current === 'whitelist') {
      // Store current whitelist settings before clearing
      setPreviousSmartSettings({
        kinds: relaySettings.kinds,
        photos: relaySettings.photos,
        videos: relaySettings.videos,
        audio: relaySettings.audio,
      });

      // Always clear selections when switching to blacklist mode - user starts fresh
      setRelaySettings(prev => ({
        ...prev,
        kinds: [],
        photos: [],
        videos: [],
        audio: [],
      }));
    } else if (relaySettings.mode === 'whitelist' && lastMode.current === 'blacklist' && previousSmartSettings) {
      // Restore previous whitelist mode settings
      setRelaySettings(prev => ({
        ...prev,
        kinds: previousSmartSettings.kinds,
        photos: previousSmartSettings.photos,
        videos: previousSmartSettings.videos,
        audio: previousSmartSettings.audio,
      }));
    }

    // Update lastMode after processing
    lastMode.current = relaySettings.mode;
  }, [relaySettings.mode, previousSmartSettings]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Legacy transformation functions - kept for reference but not used with new API
  // These can be removed once migration is fully tested

  // Simplified transformation functions based on actual backend response
  const transformFromBackendSettings = useCallback((backendData: any): Settings => {
    console.log('Raw backend settings:', backendData);
    const settings = getInitialSettings();
    
    // Set the mode first to avoid triggering mode change logic during initial load
    if (backendData.event_filtering?.mode) {
      console.log(`[useRelaySettings] Setting lastMode to ${backendData.event_filtering.mode} during data load`);
      lastMode.current = backendData.event_filtering.mode;
    }
    
    // Map from actual backend structure
    if (backendData.event_filtering) {
      settings.mode = backendData.event_filtering.mode || 'whitelist';
      settings.moderationMode = backendData.event_filtering.moderation_mode || 'strict';
      // Handle kinds based on mode
      const backendKinds = backendData.event_filtering.kind_whitelist || [];
      
      // Get all stored dynamic kinds from localStorage
      const allStoredDynamicKinds = JSON.parse(localStorage.getItem('dynamicKinds') || '[]');
      
      if (settings.mode === 'blacklist') {
        // In blacklist mode: backend sends allowed kinds, we need to calculate blocked kinds
        const allPossibleKinds = getAllPossibleKinds();
        const backendKindsSet = new Set(backendKinds);
        const allKindsSet = new Set(allPossibleKinds);
        
        // Calculate blocked predefined kinds: all possible kinds minus backend allowed kinds
        const blockedPredefinedKinds = Array.from(allKindsSet).filter(kind => !backendKindsSet.has(kind));
        // Only show non-core kinds as blocked (core kinds can't be blocked)
        settings.kinds = blockedPredefinedKinds.filter(kind => !isCoreKind(kind));
        
        // Calculate blocked dynamic kinds: stored dynamic kinds that are NOT in backend allowed kinds
        settings.dynamicKinds = allStoredDynamicKinds.filter((kind: string) => !backendKindsSet.has(kind));
        
        console.log('[useRelaySettings] Blacklist mode - Backend allowed kinds:', backendKinds);
        console.log('[useRelaySettings] Blacklist mode - Calculated blocked predefined kinds:', settings.kinds);
        console.log('[useRelaySettings] Blacklist mode - Calculated blocked dynamic kinds:', settings.dynamicKinds);
      } else {
        // In whitelist mode: backend sends allowed kinds directly
        // Separate predefined kinds from dynamic kinds
        const allPossibleKinds = getAllPossibleKinds();
        const predefinedKinds = backendKinds.filter((kind: string) => allPossibleKinds.includes(kind));
        const dynamicKinds = backendKinds.filter((kind: string) => !allPossibleKinds.includes(kind) && allStoredDynamicKinds.includes(kind));
        
        settings.kinds = ensureCoreKinds(predefinedKinds);
        settings.dynamicKinds = dynamicKinds;
      }
      
      // Extract mime types and file sizes from actual backend format
      const mediaDefinitions = backendData.event_filtering.media_definitions || {};
      // Handle both old and new field names for backward compatibility
      const backendPhotos = mediaDefinitions.image?.mime_patterns || mediaDefinitions.image?.mimepatterns || [];
      const backendVideos = mediaDefinitions.video?.mime_patterns || mediaDefinitions.video?.mimepatterns || [];
      const backendAudio = mediaDefinitions.audio?.mime_patterns || mediaDefinitions.audio?.mimepatterns || [];
      
      // Handle media types based on mode (same logic as kinds)
      if (settings.mode === 'blacklist') {
        // In blacklist mode: backend sends allowed media types, we need to calculate blocked types
        const allPossiblePhotos = getAllPossibleMediaTypes('photos');
        const allPossibleVideos = getAllPossibleMediaTypes('videos');
        const allPossibleAudio = getAllPossibleMediaTypes('audio');
        
        // Use Sets for more reliable comparison
        const backendPhotosSet = new Set(backendPhotos);
        const backendVideosSet = new Set(backendVideos);
        const backendAudioSet = new Set(backendAudio);
        
        settings.photos = allPossiblePhotos.filter(type => !backendPhotosSet.has(type));
        settings.videos = allPossibleVideos.filter(type => !backendVideosSet.has(type));
        settings.audio = allPossibleAudio.filter(type => !backendAudioSet.has(type));
        
        console.log('[useRelaySettings] Blacklist mode - Backend allowed photos:', backendPhotos);
        console.log('[useRelaySettings] Blacklist mode - Calculated blocked photos:', settings.photos);
        console.log('[useRelaySettings] Blacklist mode - Backend allowed videos:', backendVideos);
        console.log('[useRelaySettings] Blacklist mode - Calculated blocked videos:', settings.videos);
        console.log('[useRelaySettings] Blacklist mode - Backend allowed audio:', backendAudio);
        console.log('[useRelaySettings] Blacklist mode - Calculated blocked audio:', settings.audio);
      } else {
        // In whitelist mode: backend sends allowed media types directly
        settings.photos = backendPhotos;
        settings.videos = backendVideos;
        settings.audio = backendAudio;
      }
      
      // Extract file size limits (handle both old and new field names)
      settings.photoMaxSizeMB = mediaDefinitions.image?.max_size_mb || mediaDefinitions.image?.maxsizemb || 100;
      settings.videoMaxSizeMB = mediaDefinitions.video?.max_size_mb || mediaDefinitions.video?.maxsizemb || 500;
      settings.audioMaxSizeMB = mediaDefinitions.audio?.max_size_mb || mediaDefinitions.audio?.maxsizemb || 100;
      
      // Set protocols
      if (backendData.event_filtering.protocols?.enabled) {
        settings.protocol = backendData.event_filtering.protocols.allowed_protocols || ['WebSocket'];
      } else {
        settings.protocol = ['WebSocket'];
      }
    }

    // Store these as the previous whitelist settings ONLY if in whitelist mode
    // In blacklist mode, settings.kinds/photos/etc contain blocked items, not allowed items
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
    // Handle media types based on mode - same logic as kinds
    const photoMimePatterns = settings.mode === 'blacklist' 
      ? calculateInverseMediaTypes(settings.photos, 'photos') // For blacklist: send inverse (all types except blocked ones)
      : settings.photos; // For whitelist: send selected types directly
      
    const videoMimePatterns = settings.mode === 'blacklist'
      ? calculateInverseMediaTypes(settings.videos, 'videos') // For blacklist: send inverse (all types except blocked ones)
      : settings.videos; // For whitelist: send selected types directly
      
    const audioMimePatterns = settings.mode === 'blacklist'
      ? calculateInverseMediaTypes(settings.audio, 'audio') // For blacklist: send inverse (all types except blocked ones)
      : settings.audio; // For whitelist: send selected types directly

    // Always create media definitions with correct field names to avoid backend conflicts
    const mediaDefinitions = {
      image: {
        mime_patterns: photoMimePatterns, // Send processed mime patterns based on mode
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        max_size_mb: settings.photoMaxSizeMB // Only send correct field name
      },
      video: {
        mime_patterns: videoMimePatterns, // Send processed mime patterns based on mode
        extensions: [".mp4", ".webm", ".avi", ".mov"],
        max_size_mb: settings.videoMaxSizeMB // Only send correct field name
      },
      audio: {
        mime_patterns: audioMimePatterns, // Send processed mime patterns based on mode
        extensions: [".mp3", ".wav", ".ogg", ".flac"],
        max_size_mb: settings.audioMaxSizeMB // Only send correct field name
      }
    };

    return {
      settings: {
        event_filtering: {
          mode: settings.mode,
          moderation_mode: settings.moderationMode,
          kind_whitelist: (() => {
            if (settings.mode === 'blacklist') {
              // For blacklist: get all predefined allowed kinds, then add unblocked dynamic kinds
              const predefinedAllowed = calculateInverseKinds(settings.kinds);
              // Get all stored dynamic kinds from localStorage
              const allStoredDynamicKinds = JSON.parse(localStorage.getItem('dynamicKinds') || '[]');
              // Add dynamic kinds that are NOT blocked (not in settings.dynamicKinds)
              const allowedDynamicKinds = allStoredDynamicKinds.filter((kind: string) => !settings.dynamicKinds.includes(kind));
              return [...predefinedAllowed, ...allowedDynamicKinds];
            } else {
              // For whitelist: send all selected kinds (including dynamic)
              return ensureCoreKinds([...settings.kinds, ...settings.dynamicKinds]);
            }
          })(),
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
