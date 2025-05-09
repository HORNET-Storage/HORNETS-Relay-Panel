import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  SettingOutlined,
  FilterOutlined,
  PictureOutlined,
  ApiOutlined,
  RobotOutlined,
  TwitterOutlined,
  InfoCircleOutlined,
  WalletOutlined,
  GlobalOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const StyledTabs = styled(Tabs)`
  margin-bottom: 1.5rem;
`;

interface SettingsTab {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const settingsTabs: SettingsTab[] = [
  {
    key: 'relay_settings',
    label: 'Relay Settings',
    icon: <SettingOutlined />,
    path: '/settings/relay'
  },
  {
    key: 'image_moderation',
    label: 'Image Moderation',
    icon: <PictureOutlined />,
    path: '/settings/image-moderation'
  },
  {
    key: 'content_filter',
    label: 'Content Filter',
    icon: <FilterOutlined />,
    path: '/settings/content-filter'
  },
  {
    key: 'nest_feeder',
    label: 'Nest Feeder',
    icon: <ApiOutlined />,
    path: '/settings/nest-feeder'
  },
  {
    key: 'ollama',
    label: 'Ollama',
    icon: <RobotOutlined />,
    path: '/settings/ollama'
  },
  {
    key: 'xnostr',
    label: 'XNostr',
    icon: <TwitterOutlined />,
    path: '/settings/xnostr'
  },
  {
    key: 'relay_info',
    label: 'Relay Info',
    icon: <InfoCircleOutlined />,
    path: '/settings/relay-info'
  },
  {
    key: 'wallet',
    label: 'Wallet',
    icon: <WalletOutlined />,
    path: '/settings/wallet'
  },
  {
    key: 'general',
    label: 'General',
    icon: <GlobalOutlined />,
    path: '/settings/general'
  },
  {
    key: 'query_cache',
    label: 'Query Cache',
    icon: <DatabaseOutlined />,
    path: '/settings/query-cache'
  }
];

const SettingsNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on current path
  const getActiveKey = () => {
    const path = location.pathname;
    const tab = settingsTabs.find(tab => tab.path === path);
    return tab ? tab.key : 'relay_settings';
  };
  
  const handleTabChange = (key: string) => {
    const tab = settingsTabs.find(tab => tab.key === key);
    if (tab) {
      navigate(tab.path);
    }
  };
  
  return (
    <StyledTabs
      activeKey={getActiveKey()}
      onChange={handleTabChange}
      type="card"
      size="large"
    >
      {settingsTabs.map(tab => (
        <TabPane
          tab={
            <span>
              {tab.icon} {tab.label}
            </span>
          }
          key={tab.key}
        />
      ))}
    </StyledTabs>
  );
};

export default SettingsNavigation;
