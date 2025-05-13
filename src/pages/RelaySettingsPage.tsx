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
import { Settings, Category, defaultTiers, SubscriptionTier } from '@app/constants/relaySettings';

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
    appBuckets: [],
    dynamicAppBuckets: [],
    isKindsActive: true,
    isPhotosActive: true,
    isVideosActive: true,
    isGitNestrActive: true,
    isAudioActive: true,
    isFileStorageActive: false,
    subscription_tiers: [],
    freeTierEnabled: false,
    freeTierLimit: '100 MB per month',
    moderationMode: 'strict'  // Default to strict mode
  });

  // Initialize stored dynamic items
  const [storedDynamicKinds, setStoredDynamicKinds] = useState<string[]>(
    JSON.parse(localStorage.getItem('dynamicKinds') || '[]'),
  );

  const [dynamicAppBuckets, setDynamicAppBuckets] = useState<string[]>(
    JSON.parse(localStorage.getItem('dynamicAppBuckets') || '[]'),
  );

  // Blacklist state
  const [blacklist, setBlacklist] = useState({
    kinds: [],
    photos: [],
    videos: [],
    gitNestr: [],
    audio: [],
  });

  // Fetch initial settings
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sync settings with relay settings
  useEffect(() => {
    if (relaySettings) {
      console.log('Raw relay settings:', relaySettings); // For debugging

      // Only set defaults if there are no tiers or if they are invalid
      const tiers = Array.isArray(relaySettings.subscription_tiers) &&
        relaySettings.subscription_tiers.length > 0 &&
        relaySettings.subscription_tiers.every(tier => tier.data_limit && tier.price)
        ? relaySettings.subscription_tiers
        : defaultTiers;

      setSettings(prev => ({
        ...relaySettings,
        protocol: Array.isArray(relaySettings.protocol) ? relaySettings.protocol : [relaySettings.protocol],
        subscription_tiers: tiers
      }));
      setDynamicAppBuckets(relaySettings.dynamicAppBuckets);
    }
  }, [relaySettings]);

  // Reset blacklist when mode changes
  useEffect(() => {
    if (settings.mode === 'blacklist') return;
    setBlacklist({
      kinds: [],
      photos: [],
      videos: [],
      gitNestr: [],
      audio: [],
    });
  }, [settings.mode]);

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
        updateSettings('appBuckets', settings.appBuckets),
        updateSettings('dynamicAppBuckets', settings.dynamicAppBuckets),
        updateSettings('freeTierEnabled', settings.freeTierEnabled),
        updateSettings('freeTierLimit', settings.freeTierLimit),
        updateSettings('subscription_tiers', settings.subscription_tiers),
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

  // App buckets handlers
  const handleAppBucketsChange = (values: string[]) => {
    setSettings(prev => ({ ...prev, appBuckets: values }));
    updateSettings('appBuckets', values);
  };

  const handleDynamicAppBucketsChange = (values: string[]) => {
    setSettings(prev => ({ ...prev, dynamicAppBuckets: values }));
    updateSettings('dynamicAppBuckets', values);
  };

  const handleAddBucket = (bucket: string) => {
    if (!bucket || dynamicAppBuckets.includes(bucket)) return;

    const updatedBuckets = [...dynamicAppBuckets, bucket];
    setDynamicAppBuckets(updatedBuckets);
    setSettings(prev => ({ ...prev, dynamicAppBuckets: updatedBuckets }));
    updateSettings('dynamicAppBuckets', updatedBuckets);
    localStorage.setItem('dynamicAppBuckets', JSON.stringify(updatedBuckets));
  };

  const handleRemoveBucket = (bucket: string) => {
    const updatedBuckets = dynamicAppBuckets.filter(b => b !== bucket);
    setDynamicAppBuckets(updatedBuckets);
    setSettings(prev => ({ ...prev, dynamicAppBuckets: updatedBuckets }));
    updateSettings('dynamicAppBuckets', updatedBuckets);
    localStorage.setItem('dynamicAppBuckets', JSON.stringify(updatedBuckets));
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
    // App buckets props
    appBuckets: settings.appBuckets,
    dynamicAppBuckets: settings.dynamicAppBuckets,
    onAppBucketsChange: handleAppBucketsChange,
    onDynamicAppBucketsChange: handleDynamicAppBucketsChange,
    onAddBucket: handleAddBucket,
    onRemoveBucket: handleRemoveBucket,
    // Subscription props
    subscriptionTiers: settings.subscription_tiers || defaultTiers,
    freeTierEnabled: settings.freeTierEnabled,
    freeTierLimit: settings.freeTierLimit,
    onSubscriptionChange: (tiers: SubscriptionTier[]) => {
      setSettings(prev => ({
        ...prev,
        subscription_tiers: tiers
      }));
      updateSettings('subscription_tiers', tiers);
    },
    onFreeTierChange: (enabled: boolean, limit: string) => {  // Combined function
      setSettings(prev => ({
        ...prev,
        freeTierEnabled: enabled,
        freeTierLimit: limit
      }));
      updateSettings('freeTierEnabled', enabled);
      updateSettings('freeTierLimit', limit);
    },
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
      onChange: (values: string[]) => handleMediaChange('photos', values),
      onToggle: (checked: boolean) => handleMediaToggle('isPhotosActive', checked),
    },
    videos: {
      selected: settings.videos,
      isActive: settings.isVideosActive,
      onChange: (values: string[]) => handleMediaChange('videos', values),
      onToggle: (checked: boolean) => handleMediaToggle('isVideosActive', checked),
    },
    audio: {
      selected: settings.audio,
      isActive: settings.isAudioActive,
      onChange: (values: string[]) => handleMediaChange('audio', values),
      onToggle: (checked: boolean) => handleMediaToggle('isAudioActive', checked),
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
