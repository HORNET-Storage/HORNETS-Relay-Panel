import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import styled from 'styled-components';
import {
  FilterOutlined,
  PictureOutlined,
  ApiOutlined,
  RobotOutlined,
  TwitterOutlined,
  InfoCircleOutlined,
  WalletOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons';
import ImageModerationSettings from './ImageModerationSettings';
import ContentFilterSettings from './ContentFilterSettings';
import NestFeederSettings from './NestFeederSettings';
import OllamaSettings from './OllamaSettings';
import WalletSettings from './WalletSettings';
import GeneralSettings from './GeneralSettings';
import RelayInfoSettings from './RelayInfoSettings';
import QueryCacheSettings from './QueryCacheSettings';
import XNostrSettings from './XNostrSettings';

const SettingsContainer = styled.div`
  width: 100%;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 10px;
`;

const SettingSection = styled.div`
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
`;

const SectionHeader = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  ${props => props.$isActive && `
    background-color: rgba(0, 0, 0, 0.5);
  `}
`;

const SectionIcon = styled.span`
  margin-right: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const SectionTitle = styled.span`
  flex: 1;
  font-size: 16px;
`;

const SectionContent = styled.div<{ $isVisible: boolean }>`
  display: ${props => props.$isVisible ? 'block' : 'none'};
  padding: 0;
  transition: all 0.3s;
`;

interface SettingItem {
  key: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  
  const settingItems: SettingItem[] = useMemo(() => [
    {
      key: 'image_moderation',
      path: '/settings/image-moderation',
      label: 'Image Moderation',
      icon: <PictureOutlined />,
      component: <ImageModerationSettings />
    },
    {
      key: 'content_filter',
      path: '/settings/content-filter',
      label: 'Content Filter',
      icon: <FilterOutlined />,
      component: <ContentFilterSettings />
    },
    {
      key: 'nest_feeder',
      path: '/settings/nest-feeder',
      label: 'Nest Feeder',
      icon: <ApiOutlined />,
      component: <NestFeederSettings />
    },
    {
      key: 'ollama',
      path: '/settings/ollama',
      label: 'Ollama',
      icon: <RobotOutlined />,
      component: <OllamaSettings />
    },
    {
      key: 'xnostr',
      path: '/settings/xnostr',
      label: 'XNostr',
      icon: <TwitterOutlined />,
      component: <XNostrSettings />
    },
    {
      key: 'relay_info',
      path: '/settings/relay-info',
      label: 'Relay Info',
      icon: <InfoCircleOutlined />,
      component: <RelayInfoSettings />
    },
    {
      key: 'wallet',
      path: '/settings/wallet',
      label: 'Wallet',
      icon: <WalletOutlined />,
      component: <WalletSettings />
    },
    {
      key: 'general',
      path: '/settings/general',
      label: 'General',
      icon: <GlobalOutlined />,
      component: <GeneralSettings />
    },
    {
      key: 'query_cache',
      path: '/settings/query-cache',
      label: 'Query Cache',
      icon: <DatabaseOutlined />,
      component: <QueryCacheSettings />
    }
  ], []);
  
  // Set active key based on current path
  useEffect(() => {
    const path = location.pathname;
    const item = settingItems.find(item => item.path === path);
    
    if (item) {
      setActiveKey(item.key);
    } else if (path === '/settings' || path === '/settings/') {
      // Don't navigate to any settings by default
      setActiveKey(undefined);
    }
  }, [location.pathname, navigate, settingItems]);
  
  const handleSectionClick = (item: SettingItem) => {
    if (activeKey === item.key) {
      // If clicking the active section, close it
      setActiveKey(undefined);
      navigate('/settings');
    } else {
      // Otherwise, open the clicked section
      setActiveKey(item.key);
      navigate(item.path);
    }
  };
  
  return (
    <>
      <PageTitle>Advanced Settings</PageTitle>
      
      <SettingsContainer>
        {settingItems.map(item => (
          <SettingSection key={item.key}>
            <SectionHeader 
              $isActive={activeKey === item.key}
              onClick={() => handleSectionClick(item)}
            >
              <SectionIcon>{item.icon}</SectionIcon>
              <SectionTitle>{item.label}</SectionTitle>
              {activeKey === item.key ? <DownOutlined /> : <RightOutlined />}
            </SectionHeader>
            
            <SectionContent $isVisible={activeKey === item.key}>
              {item.component}
            </SectionContent>
          </SettingSection>
        ))}
      </SettingsContainer>
    </>
  );
};

export default SettingsPage;
