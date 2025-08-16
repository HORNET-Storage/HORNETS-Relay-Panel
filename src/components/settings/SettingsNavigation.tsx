import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
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
  BellOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

const StyledCollapse = styled(Collapse)`
  margin-bottom: 1.5rem;
  
  .ant-collapse-header {
    display: flex;
    align-items: center;
    padding: 12px 16px !important;
    
    .ant-collapse-arrow {
      right: 16px;
      left: auto !important;
    }
  }
  
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  
  .panel-icon {
    margin-right: 12px;
    font-size: 16px;
  }
`;

const NavigationItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .item-icon {
    margin-right: 12px;
    font-size: 16px;
  }
`;

interface SettingsTab {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const settingsTabs: SettingsTab[] = [
  {
    key: 'image_moderation',
    label: 'Image Moderation',
    icon: <PictureOutlined className="item-icon" />,
    path: '/settings/image-moderation'
  },
  {
    key: 'content_filter',
    label: 'Content Filter',
    icon: <FilterOutlined className="item-icon" />,
    path: '/settings/content-filter'
  },
  {
    key: 'ollama',
    label: 'Ollama',
    icon: <RobotOutlined className="item-icon" />,
    path: '/settings/ollama'
  },
  {
    key: 'push_notifications',
    label: 'Push Notifications',
    icon: <BellOutlined className="item-icon" />,
    path: '/settings/push-notifications'
  },
  {
    key: 'relay_info',
    label: 'Relay Info',
    icon: <InfoCircleOutlined className="item-icon" />,
    path: '/settings/relay-info'
  },
  {
    key: 'wallet',
    label: 'Wallet',
    icon: <WalletOutlined className="item-icon" />,
    path: '/settings/wallet'
  },
  {
    key: 'general',
    label: 'General',
    icon: <GlobalOutlined className="item-icon" />,
    path: '/settings/general'
  },
];

const SettingsNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  
  // Determine active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    const tab = settingsTabs.find(tab => tab.path === path);
    if (tab) {
      setActiveKey(tab.key);
    }
  }, [location.pathname]);
  
  const handleItemClick = (tab: SettingsTab) => {
    navigate(tab.path);
    setActiveKey(tab.key);
  };
  
  return (
    <StyledCollapse 
      accordion 
      expandIconPosition="end"
      ghost
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key as string | undefined)}
    >
      {settingsTabs.map(tab => (
        <Panel
          key={tab.key}
          header={
            <span>
              {React.cloneElement(tab.icon as React.ReactElement, { className: 'panel-icon' })} {tab.label}
            </span>
          }
        >
          <NavigationItem 
            className={activeKey === tab.key ? 'active' : ''}
            onClick={() => handleItemClick(tab)}
          >
            {tab.label}
          </NavigationItem>
        </Panel>
      ))}
    </StyledCollapse>
  );
};

export default SettingsNavigation;
