import React, { useState } from 'react';
import { Collapse, Button, Space, Spin } from 'antd';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import styled from 'styled-components';
import GeneralSettingsPanel from '../panels/GeneralSettingsPanel';
import ImageModerationPanel from '../panels/ImageModerationPanel';
import ContentFilterPanel from '../panels/ContentFilterPanel';
import useGenericSettings from '@app/hooks/useGenericSettings';

const { Panel } = Collapse;

const SettingsContainer = styled.div`
  margin-bottom: 2rem;
`;

const SaveButtonContainer = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
`;

interface AdvancedSettingsLayoutProps {
  loading?: boolean;
  error?: string | null;
}

const AdvancedSettingsLayout: React.FC<AdvancedSettingsLayoutProps> = ({
  loading: propLoading,
  error: propError,
}) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>(['general']);
  
  // Use the generic settings hook to handle saving all settings
  const { 
    loading: hookLoading, 
    error: hookError,
    saveSettings,
    fetchSettings
  } = useGenericSettings('general'); // We just need a hook instance for the save/fetch methods
  
  const loading = propLoading || hookLoading;
  const error = propError || (hookError ? hookError.toString() : null);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await saveSettings();
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = async () => {
    setResetLoading(true);
    try {
      await fetchSettings();
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spin size="large" />
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <p>Error loading settings: {error}</p>
        <Button onClick={handleReset}>Try Again</Button>
      </div>
    );
  }

  return (
    <BaseRow>
      <BaseCol span={24}>
        <SettingsContainer>
          <Collapse 
            accordion={false} 
            activeKey={activeKeys} 
            onChange={(keys) => setActiveKeys(keys as string[])}
          >
            <Panel header="General Settings" key="general">
              <GeneralSettingsPanel />
            </Panel>
            
            <Panel header="Image Moderation" key="image-moderation">
              <ImageModerationPanel />
            </Panel>
            
            <Panel header="Content Filter" key="content-filter">
              <ContentFilterPanel />
            </Panel>
            
            {/* Add more panels here as they are created */}
          </Collapse>
        </SettingsContainer>
        
        <SaveButtonContainer>
          <Space size="middle">
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSave} 
              loading={saveLoading}
            >
              Save All Settings
            </Button>
            <Button 
              size="large" 
              onClick={handleReset} 
              loading={resetLoading}
            >
              Reset
            </Button>
          </Space>
        </SaveButtonContainer>
      </BaseCol>
    </BaseRow>
  );
};

export default AdvancedSettingsLayout;
