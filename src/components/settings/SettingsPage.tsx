import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import SettingsNavigation from './SettingsNavigation';
import ImageModerationSettings from './ImageModerationSettings';
import ContentFilterSettings from './ContentFilterSettings';
import NestFeederSettings from './NestFeederSettings';
import OllamaSettings from './OllamaSettings';
import WalletSettings from './WalletSettings';
import GeneralSettings from './GeneralSettings';
import RelayInfoSettings from './RelayInfoSettings';
import QueryCacheSettings from './QueryCacheSettings';
import XNostrSettings from './XNostrSettings';

const SettingsPage: React.FC = () => {
  return (
    <>
      <PageTitle>Advanced Settings</PageTitle>
      
      <SettingsNavigation />
      
      <Routes>
        <Route path="image-moderation" element={<ImageModerationSettings />} />
        <Route path="content-filter" element={<ContentFilterSettings />} />
        <Route path="nest-feeder" element={<NestFeederSettings />} />
        <Route path="ollama" element={<OllamaSettings />} />
        <Route path="xnostr" element={<XNostrSettings />} />
        <Route path="relay-info" element={<RelayInfoSettings />} />
        <Route path="wallet" element={<WalletSettings />} />
        <Route path="general" element={<GeneralSettings />} />
        <Route path="query-cache" element={<QueryCacheSettings />} />
        
        {/* Redirect to general settings by default */}
        <Route path="/" element={<Navigate to="general" replace />} />
      </Routes>
    </>
  );
};

export default SettingsPage;
