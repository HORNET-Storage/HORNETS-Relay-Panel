import React, { useState, useEffect } from 'react';
import { Collapse, Button, Space, Spin } from 'antd';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import styled from 'styled-components';
import GeneralSettingsPanel from '../panels/GeneralSettingsPanel';
import ImageModerationPanel from '../panels/ImageModerationPanel';
import ContentFilterPanel from '../panels/ContentFilterPanel';
import NestFeederPanel from '../panels/NestFeederPanel';
import OllamaPanel from '../panels/OllamaPanel';
import WalletPanel from '../panels/WalletPanel';
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
  const [activeKeys, setActiveKeys] = useState<string[]>(['general', 'image-moderation']);
  
  // Use the generic settings hook to handle saving all settings
  const { 
    loading: hookLoading, 
    error: hookError,
    saveSettings,
    fetchSettings
  } = useGenericSettings('general'); // We just need a hook instance for the save/fetch methods
  
  const loading = propLoading || hookLoading;
  const error = propError || (hookError ? hookError.toString() : null);

  // Ensure image-moderation panel is expanded when needed
  useEffect(() => {
    // Check URL for any parameters indicating we should expand image moderation
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('section') && urlParams.get('section') === 'image-moderation') {
      if (!activeKeys.includes('image-moderation')) {
        setActiveKeys([...activeKeys, 'image-moderation']);
      }
    }
    
    // Log for debugging
    console.log('AdvancedSettingsLayout - Active panels:', activeKeys);
  }, [activeKeys]);

  const handleSave = async () => {
    console.log('Saving all settings...');
    setSaveLoading(true);
    try {
      await saveSettings();
      console.log('Settings saved successfully');
      
      // Reset all forms by triggering their submit handlers
      // This will reset the isUserEditing flag in all panel components
      const formElements = document.querySelectorAll('form');
      formElements.forEach(form => {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      });
      
      // Also dispatch a custom event that the panel components can listen for
      const saveEvent = new CustomEvent('settings-saved');
      document.dispatchEvent(saveEvent);
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = async () => {
    console.log('Resetting all settings...');
    setResetLoading(true);
    try {
      await fetchSettings();
      console.log('Settings reset successfully');
    } catch (error) {
      console.error('Error resetting settings:', error);
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
            onChange={(keys) => {
              console.log('Collapse panels changed:', keys);
              setActiveKeys(keys as string[]);
            }}
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
            
            <Panel header="Nest Feeder" key="nest-feeder">
              <NestFeederPanel />
            </Panel>
            
            <Panel header="Ollama" key="ollama">
              <OllamaPanel />
            </Panel>
            
            <Panel header="Wallet" key="wallet">
              <WalletPanel />
            </Panel>
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
