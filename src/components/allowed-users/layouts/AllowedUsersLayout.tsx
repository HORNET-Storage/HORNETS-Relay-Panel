import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Alert, Button, Space, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { LiquidBlueButton } from '@app/components/common/LiquidBlueButton';
import { useAllowedUsersSettings } from '@app/hooks/useAllowedUsers';
import { ModeSelector } from '../components/ModeSelector/ModeSelector';
import { PermissionsConfig } from '../components/PermissionsConfig/PermissionsConfig';
import { TiersConfig } from '../components/TiersConfig/TiersConfig';
import { NPubManagement } from '../components/NPubManagement/NPubManagement';
import { RelayOwnerConfig } from '../components/RelayOwnerConfig/RelayOwnerConfig';
import { AllowedUsersMode, MODE_CONFIGURATIONS, AllowedUsersSettings, DEFAULT_TIERS } from '@app/types/allowedUsers.types';
import { getRelayOwner } from '@app/api/allowedUsers.api';
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';
import * as PageStyles from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import * as S from './AllowedUsersLayout.styles';

export const AllowedUsersLayout: React.FC = () => {
  const { settings, loading, error, updateSettings } = useAllowedUsersSettings();
  const [currentMode, setCurrentMode] = useState<AllowedUsersMode>('public');
  const [localSettings, setLocalSettings] = useState<AllowedUsersSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setCurrentMode(settings.mode);
      setLocalSettings(settings);
      setHasChanges(false);
    }
  }, [settings]);

  const handleModeChange = (mode: AllowedUsersMode) => {
    if (!localSettings) return;

    const modeConfig = MODE_CONFIGURATIONS[mode];
    
    // Comprehensive logging for mode changes
    console.group('🔄 [UI] Mode Change Handler');
    console.log('🎯 Selected mode:', mode);
    console.log('⚙️ Mode configuration:', modeConfig);
    console.log('📋 Current local settings:', localSettings);
    console.log('🔒 Forced read permission:', modeConfig.forcedRead);
    console.log('🔒 Forced write permission:', modeConfig.forcedWrite);
    console.log('📖 Available read options:', modeConfig.readOptions);
    console.log('✍️ Available write options:', modeConfig.writeOptions);
    console.log('🏷️ Default tiers for mode:', DEFAULT_TIERS[mode]);
    console.groupEnd();
    
    // Apply mode-specific forced permissions and defaults
    const updatedSettings: AllowedUsersSettings = {
      ...localSettings,
      mode,
      read: modeConfig.forcedRead || modeConfig.readOptions[0],
      write: modeConfig.forcedWrite || modeConfig.writeOptions[0],
      tiers: DEFAULT_TIERS[mode]
      // Note: relay_owner_npub is no longer managed in settings - it's handled via /api/allowed-users
    };

    console.group('📝 [UI] Updated Settings After Mode Change');
    console.log('🆕 New settings object:', updatedSettings);
    console.log('🎯 Final mode:', updatedSettings.mode);
    console.log('📖 Final read permission:', updatedSettings.read);
    console.log('✍️ Final write permission:', updatedSettings.write);
    console.log('🏷️ Final tiers:', updatedSettings.tiers);
    console.groupEnd();

    setLocalSettings(updatedSettings);
    setCurrentMode(mode);
    setHasChanges(true);
  };

  const handleSettingsUpdate = (newSettings: AllowedUsersSettings) => {
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!localSettings) return;
    
    // Check if owner exists when trying to save "only-me" mode
    if (localSettings.mode === 'only-me') {
      try {
        const ownerResponse = await getRelayOwner();
        if (!ownerResponse.relay_owner) {
          message.error('Cannot save "Only Me" mode: Please set a relay owner first.');
          return;
        }
      } catch (error) {
        console.error('Failed to check relay owner:', error);
        message.error('Cannot verify relay owner. Please ensure owner is set before saving "Only Me" mode.');
        return;
      }
    }
    
    setSaving(true);
    try {
      await updateSettings(localSettings);
      setHasChanges(false);
    } catch (error) {
      // If save fails due to wallet service, reset to previous mode
      if (localSettings.mode === 'subscription' && 
          error instanceof Error && 
          error.message.includes('wallet service')) {
        console.log('Reverting to previous mode due to wallet service error');
        setLocalSettings(settings);
        setCurrentMode(settings.mode);
        setHasChanges(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setLocalSettings(settings);
      setCurrentMode(settings.mode);
      setHasChanges(false);
    }
  };

  if (loading && !settings) {
    return (
      <S.LoadingContainer>
        <Spin size="large" />
      </S.LoadingContainer>
    );
  }

  if (error && !settings) {
    return (
      <S.ErrorContainer>
        <Alert
          message="Error Loading Settings"
          description={error}
          type="error"
          showIcon
        />
      </S.ErrorContainer>
    );
  }

  if (!settings || !localSettings) {
    return null;
  }

  // Determine what sections to show based on mode and permissions
  const showNpubManagement = localSettings.read === 'allowed_users' || localSettings.write === 'allowed_users';
  const showTiers = currentMode === 'subscription' || currentMode === 'invite-only' || currentMode === 'public' || currentMode === 'only-me';
  const showRelayOwnerConfig = currentMode === 'only-me';

  return (
    <DashboardWrapper>
      <BaseRow>
        <PageStyles.LeftSideCol xl={16} xxl={17}>
          <S.Container>
            <S.Header>
              <S.Title>H.O.R.N.E.T Allowed Users</S.Title>
              <S.Subtitle>Centralized user permission management</S.Subtitle>
            </S.Header>

            <Row gutter={[24, 24]}>
              <Col span={24}>
                <S.ContentCard title="Relay Mode" loading={loading}>
                  <ModeSelector
                    currentMode={currentMode}
                    onModeChange={handleModeChange}
                    disabled={loading || saving}
                  />
                </S.ContentCard>
              </Col>

              <Col span={24}>
                <S.ContentCard title="Global Permissions" loading={loading}>
                  <PermissionsConfig
                    settings={localSettings}
                    onSettingsChange={handleSettingsUpdate}
                    disabled={loading || saving}
                  />
                </S.ContentCard>
              </Col>

              {showRelayOwnerConfig && (
                <Col span={24}>
                  <S.ContentCard title="Relay Owner Configuration" loading={loading}>
                    <RelayOwnerConfig
                      settings={localSettings}
                      onSettingsChange={handleSettingsUpdate}
                      disabled={loading || saving}
                    />
                  </S.ContentCard>
                </Col>
              )}

              {showTiers && (
                <Col span={24}>
                  <S.ContentCard title={
                    currentMode === 'public' ? 'Free Tier Configuration' :
                    currentMode === 'only-me' ? 'Only Me Tiers' :
                    'Subscription Tiers'
                  } loading={loading}>
                    <TiersConfig
                      settings={localSettings}
                      mode={currentMode}
                      onSettingsChange={handleSettingsUpdate}
                      disabled={loading || saving}
                    />
                  </S.ContentCard>
                </Col>
              )}

              {showNpubManagement && (
                <Col span={24}>
                  <S.ContentCard title="Allowed Users Management">
                    <NPubManagement
                      settings={localSettings}
                      mode={currentMode}
                    />
                  </S.ContentCard>
                </Col>
              )}

              <Col span={24}>
                <S.SaveSection>
                  <Space>
                    <LiquidBlueButton
                      variant="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSave}
                      loading={saving}
                      disabled={!hasChanges}
                    >
                      Save Changes
                    </LiquidBlueButton>
                    <Button
                      onClick={handleReset}
                      disabled={!hasChanges || saving}
                    >
                      Reset
                    </Button>
                    {hasChanges && (
                      <S.ChangesIndicator>
                        You have unsaved changes
                      </S.ChangesIndicator>
                    )}
                  </Space>
                </S.SaveSection>
              </Col>
            </Row>
          </S.Container>
        </PageStyles.LeftSideCol>

        <PageStyles.RightSideCol xl={8} xxl={7}>
          <PageStyles.RightSideContentWrapper>
            <div id="balance">
              <Balance />
            </div>
            <PageStyles.Space />
            <div id="total-earning">
              <TotalEarning />
            </div>
            <PageStyles.Space />
            <div id="activity-story">
              <ActivityStory />
            </div>
          </PageStyles.RightSideContentWrapper>
        </PageStyles.RightSideCol>
      </BaseRow>
    </DashboardWrapper>
  );
};
