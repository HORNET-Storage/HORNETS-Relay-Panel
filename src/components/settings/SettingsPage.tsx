import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import styled from 'styled-components';
import {
  FilterOutlined,
  PictureOutlined,
  ApiOutlined,
  RobotOutlined,
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

const SettingsContainer = styled.div`
  width: 100%;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 16px;
`;

const SettingSection = styled.div`
  margin-bottom: 1px;
  overflow: hidden;
  background-color: transparent;
`;

const SectionHeader = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  
  ${props => props.$isActive && `
    background-color: rgba(0, 0, 0, 0.3);
  `}
`;

const SectionIcon = styled.span`
  margin-right: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: #fff;
`;

const SectionTitle = styled.span`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
`;

const SectionContent = styled.div<{ $isVisible: boolean }>`
  max-height: ${props => props.$isVisible ? '2000px' : '0'};
  opacity: ${props => props.$isVisible ? '1' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.2s ease;
  padding: ${props => props.$isVisible ? '20px' : '0'};
  background-color: rgba(0, 0, 0, 0.15);
  border-bottom: ${props => props.$isVisible ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'};
`;

// Custom wrapper to hide the title and style components
const SettingsWrapper = styled.div`
  .ant-card-head {
    display: none;
  }
  
  .ant-card {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  
  .ant-card-body {
    padding: 0 10px;
  }
  
  .ant-alert {
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  /* Style for notes */
  p, div {
    &[class*="note"], &:has(em:first-child:contains("Note")), &:contains("Note:") {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9em;
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: rgba(0, 0, 0, 0.1);
      border-left: 3px solid rgba(82, 196, 255, 0.8);
      border-radius: 0 4px 4px 0;
      
      &::first-line {
        color: rgba(82, 196, 255, 1);
      }
      
      strong, em, b {
        color: rgba(82, 196, 255, 1);
      }
    }
  }
  
  .ant-form-item-label > label {
    color: rgba(255, 255, 255, 0.85);
  }
  
  .ant-input, .ant-input-number, .ant-select-selector {
    background-color: rgba(0, 0, 0, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 4px !important;
  }
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
              <SettingsWrapper>
                {item.component}
              </SettingsWrapper>
            </SectionContent>
          </SettingSection>
        ))}
      </SettingsContainer>
    </>
  );
};

export default SettingsPage;
