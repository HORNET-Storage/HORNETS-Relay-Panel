import React, { useState } from 'react';
import { Button, Space, Spin } from 'antd';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import GeneralSettingsPanel from '../panels/GeneralSettingsPanel';
import ImageModerationPanel from '../panels/ImageModerationPanel';
import ContentFilterPanel from '../panels/ContentFilterPanel';
import OllamaPanel from '../panels/OllamaPanel';
import WalletPanel from '../panels/WalletPanel';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { CollapsibleSection } from '@app/components/relay-settings/shared/CollapsibleSection/CollapsibleSection';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';

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
    <DashboardWrapper>
      <BaseRow>
        <BaseCol span={24}>
          <CollapsibleSection header="General Settings">
            <S.Card>
              <GeneralSettingsPanel />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Image Moderation">
            <S.Card>
              <ImageModerationPanel />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Content Filter">
            <S.Card>
              <ContentFilterPanel />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Ollama">
            <S.Card>
              <OllamaPanel />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Wallet">
            <S.Card>
              <WalletPanel />
            </S.Card>
          </CollapsibleSection>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
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
          </div>
        </BaseCol>
      </BaseRow>
    </DashboardWrapper>
  );
};

export default AdvancedSettingsLayout;
