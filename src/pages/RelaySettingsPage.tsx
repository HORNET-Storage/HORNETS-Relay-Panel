// src/pages/RelaySettingsPage.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { setMode } from '@app/store/slices/modeSlice';
import { useResponsive } from '@app/hooks/useResponsive';
import useRelaySettings from '@app/hooks/useRelaySettings';
import { DesktopLayout } from '@app/components/relay-settings/layouts/DesktopLayout';
import { MobileLayout } from '@app/components/relay-settings/layouts/MobileLayout';
import { Settings } from '@app/constants/relaySettings';

const RelaySettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDesktop } = useResponsive();
  const theme = useAppSelector((state) => state.theme.theme);
  const relaymode = useAppSelector((state) => state.mode.relayMode);
  const { relaySettings, fetchSettings, updateSettings, saveSettings } = useRelaySettings();

  // Loading state
  const [loadings, setLoadings] = useState<boolean[]>([]);

  // Local state for settings
  const [settings, setSettings] = useState<Settings>({
    mode: JSON.parse(localStorage.getItem('relaySettings') || '{}').mode || relaymode || 'blacklist',
    protocol: ['WebSocket'],
    kinds: [],
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
    moderationMode: 'strict',  // Default to strict mode
    // Default file size limits in MB
    photoMaxSizeMB: 100,
    videoMaxSizeMB: 500,
    audioMaxSizeMB: 100
  });

  // Initialize stored dynamic items
  const [storedDynamicKinds, setStoredDynamicKinds] = useState<string[]>(
    JSON.parse(localStorage.getItem('dynamicKinds') || '[]'),
  );

  // Fetch initial settings
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sync settings with relay settings
  useEffect(() => {
    if (relaySettings) {
      setSettings({
        ...relaySettings,
        protocol: Array.isArray(relaySettings.protocol) ? relaySettings.protocol : [relaySettings.protocol]
      });
    }
  }, [relaySettings]);

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'whitelist' : 'blacklist';
    setSettings(prev => ({
      ...prev,
      mode: newMode,
      kinds: newMode === 'blacklist' ? [] : prev.kinds,
      photos: newMode === 'blacklist' ? [] : prev.photos,
      videos: newMode === 'blacklist' ? [] : prev.videos,
      audio: newMode === 'blacklist' ? [] : prev.audio,
    }));
    updateSettings('mode', newMode);
    dispatch(setMode(newMode));
  };

  const handleSaveClick = async () => {
    setLoadings(prev => {
      const newLoadings = [...prev];
      newLoadings[0] = true;
      return newLoadings;
    });

    try {
      await Promise.all([
        updateSettings('kinds', settings.isKindsActive ? settings.kinds : []),
        updateSettings('dynamicKinds', settings.dynamicKinds),
        updateSettings('photos', settings.isPhotosActive ? settings.photos : []),
        updateSettings('videos', settings.isVideosActive ? settings.videos : []),
        updateSettings('gitNestr', settings.isGitNestrActive ? settings.gitNestr : []),
        updateSettings('audio', settings.isAudioActive ? settings.audio : []),
        updateSettings('protocol', settings.protocol),
        updateSettings('isFileStorageActive', settings.isFileStorageActive),
        updateSettings('moderationMode', settings.moderationMode),
      ]);

      await saveSettings();
    } finally {
      setLoadings(prev => {
        const newLoadings = [...prev];
        newLoadings[0] = false;
        return newLoadings;
      });
    }
  };

  // Network section handlers
  const handleProtocolChange = (protocols: string[]) => {
    setSettings(prev => ({ ...prev, protocol: protocols }));
    updateSettings('protocol', protocols);
  };

  const handleFileStorageChange = (active: boolean) => {
    setSettings(prev => ({ ...prev, isFileStorageActive: active }));
    updateSettings('isFileStorageActive', active);
  };

  // Kinds section handlers
  const handleKindsActiveChange = (active: boolean) => {
    setSettings(prev => ({ ...prev, isKindsActive: active }));
    updateSettings('isKindsActive', active);
  };

  const handleKindsChange = (values: string[]) => {
    setSettings(prev => ({ ...prev, kinds: values }));
    updateSettings('kinds', values);
  };

  const handleDynamicKindsChange = (values: string[]) => {
    setSettings(prev => ({ ...prev, dynamicKinds: values }));
    updateSettings('dynamicKinds', values);
  };

  const handleAddKind = (kind: string) => {
    if (!kind) return;
    const updatedKinds = [...storedDynamicKinds, kind];
    setStoredDynamicKinds(updatedKinds);
    localStorage.setItem('dynamicKinds', JSON.stringify(updatedKinds));
    handleDynamicKindsChange([...settings.dynamicKinds, kind]);
  };

  const handleRemoveKind = (kind: string) => {
    const updatedKinds = storedDynamicKinds.filter(k => k !== kind);
    setStoredDynamicKinds(updatedKinds);
    localStorage.setItem('dynamicKinds', JSON.stringify(updatedKinds));
    handleDynamicKindsChange(settings.dynamicKinds.filter(k => k !== kind));
  };

  // Media section handlers
  const handleMediaChange = (type: 'photos' | 'videos' | 'audio', values: string[]) => {
    setSettings(prev => ({ ...prev, [type]: values }));
    updateSettings(type, values);
  };

  const handleMediaToggle = (type: keyof Settings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [type]: checked }));
    updateSettings(type, checked);
  };

  // File size change handler
  const handleFileSizeChange = (type: 'photoMaxSizeMB' | 'videoMaxSizeMB' | 'audioMaxSizeMB', size: number) => {
    setSettings(prev => ({ ...prev, [type]: size }));
    updateSettings(type, size);
  };

  // Moderation mode handler
  const handleModerationModeChange = (mode: string) => {
    setSettings(prev => ({ ...prev, moderationMode: mode }));
    updateSettings('moderationMode', mode);
  };

  const layoutProps = {
    mode: settings.mode,
    onModeChange: handleModeChange,
    onSaveClick: handleSaveClick,
    loadings,
    // Network props
    protocols: settings.protocol,
    isFileStorageActive: settings.isFileStorageActive,
    onProtocolsChange: handleProtocolChange,
    onFileStorageChange: handleFileStorageChange,
    // Kinds props
    isKindsActive: settings.isKindsActive,
    selectedKinds: settings.kinds,
    dynamicKinds: storedDynamicKinds,
    selectedDynamicKinds: settings.dynamicKinds,
    onKindsActiveChange: handleKindsActiveChange,
    onKindsChange: handleKindsChange,
    onDynamicKindsChange: handleDynamicKindsChange,
    onAddKind: handleAddKind,
    onRemoveKind: handleRemoveKind,
    // Media props
    photos: {
      selected: settings.photos,
      isActive: settings.isPhotosActive,
      maxSizeMB: settings.photoMaxSizeMB,
      onChange: (values: string[]) => handleMediaChange('photos', values),
      onToggle: (checked: boolean) => handleMediaToggle('isPhotosActive', checked),
      onMaxSizeChange: (size: number) => handleFileSizeChange('photoMaxSizeMB', size),
    },
    videos: {
      selected: settings.videos,
      isActive: settings.isVideosActive,
      maxSizeMB: settings.videoMaxSizeMB,
      onChange: (values: string[]) => handleMediaChange('videos', values),
      onToggle: (checked: boolean) => handleMediaToggle('isVideosActive', checked),
      onMaxSizeChange: (size: number) => handleFileSizeChange('videoMaxSizeMB', size),
    },
    audio: {
      selected: settings.audio,
      isActive: settings.isAudioActive,
      maxSizeMB: settings.audioMaxSizeMB,
      onChange: (values: string[]) => handleMediaChange('audio', values),
      onToggle: (checked: boolean) => handleMediaToggle('isAudioActive', checked),
      onMaxSizeChange: (size: number) => handleFileSizeChange('audioMaxSizeMB', size),
    },
    // Moderation props
    moderationMode: settings.moderationMode,
    onModerationModeChange: handleModerationModeChange,
  };

  return (
    <>
      <PageTitle>{t('common.customizeRelaySettings')}</PageTitle>
      {isDesktop ? <DesktopLayout {...layoutProps} /> : <MobileLayout {...layoutProps} />}
    </>
  );
};

export default RelaySettingsPage;
