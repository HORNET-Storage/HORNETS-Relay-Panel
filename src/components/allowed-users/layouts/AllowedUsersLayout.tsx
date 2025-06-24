import React, { useState } from 'react';
import { Card, Row, Col, Spin, Alert, Button, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useAllowedUsersSettings } from '@app/hooks/useAllowedUsers';
import { ModeSelector } from '../components/ModeSelector/ModeSelector';
import { PermissionsConfig } from '../components/PermissionsConfig/PermissionsConfig';
import { TiersConfig } from '../components/TiersConfig/TiersConfig';
import { NPubManagement } from '../components/NPubManagement/NPubManagement';
import { AllowedUsersMode, MODE_CONFIGURATIONS, AllowedUsersSettings, DEFAULT_TIERS } from '@app/types/allowedUsers.types';
import * as S from './AllowedUsersLayout.styles';

export const AllowedUsersLayout: React.FC = () => {
  const { settings, loading, error, updateSettings } = useAllowedUsersSettings();
  const [currentMode, setCurrentMode] = useState<AllowedUsersMode>('free');
  const [localSettings, setLocalSettings] = useState<AllowedUsersSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (settings) {
      setCurrentMode(settings.mode);
      setLocalSettings(settings);
      setHasChanges(false);
    }
  }, [settings]);

  const handleModeChange = (mode: AllowedUsersMode) => {
    if (!localSettings) return;

    const modeConfig = MODE_CONFIGURATIONS[mode];
    
    // Use mode-specific default tiers or existing tiers if they're compatible
    let tiers = localSettings.tiers;
    
    // Check if current tiers are compatible with the new mode
    const isCompatibleTiers = (currentTiers: typeof tiers, targetMode: AllowedUsersMode): boolean => {
      if (currentTiers.length === 0) return false;
      
      return currentTiers.every(tier => {
        const hasValidDataLimit = tier.data_limit && tier.data_limit.trim() !== '';
        
        if (targetMode === 'paid') {
          // Paid mode requires at least one tier with non-zero price
          return hasValidDataLimit && tier.price && tier.price !== '0';
        } else if (targetMode === 'free') {
          // Free mode should have price "0"
          return hasValidDataLimit && tier.price === '0';
        } else if (targetMode === 'exclusive') {
          // Exclusive mode can have any price
          return hasValidDataLimit;
        }
        
        return hasValidDataLimit;
      });
    };
    
    // Each mode should use its own defaults when switching modes
    // Only preserve existing tiers if we're already in the target mode (backend data)
    const currentMode = localSettings.mode;
    
    if (currentMode === mode) {
      // We're already in this mode (from backend), keep existing tiers if compatible
      if (isCompatibleTiers(localSettings.tiers, mode)) {
        tiers = localSettings.tiers;
        if (mode === 'free') {
          // Ensure all prices are "0" for free mode
          tiers = tiers.map(tier => ({
            ...tier,
            price: '0'
          }));
        }
      } else {
        // Backend data isn't compatible with mode, use defaults
        tiers = DEFAULT_TIERS[mode];
      }
    } else {
      // Switching between different modes, always use mode-specific defaults
      tiers = DEFAULT_TIERS[mode];
    }
    
    const updatedSettings = {
      ...localSettings,
      mode,
      tiers,
      // Adjust scopes based on mode constraints
      read_access: {
        ...localSettings.read_access,
        scope: modeConfig.readOptions[0].value // Default to first available option
      },
      write_access: {
        ...localSettings.write_access,
        scope: modeConfig.writeOptions[0].value // Default to first available option
      }
    };

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
    
    setSaving(true);
    try {
      await updateSettings(localSettings);
      setHasChanges(false);
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

  const modeConfig = MODE_CONFIGURATIONS[currentMode];
  const showNpubManagement = modeConfig.requiresNpubManagement ||
    (localSettings.read_access.scope === 'allowed_users' || localSettings.write_access.scope === 'allowed_users');
  const showTiers = currentMode === 'paid' || currentMode === 'free' || currentMode === 'exclusive';

  return (
    <S.Container>
      <S.Header>
        <S.Title>H.O.R.N.E.T Allowed Users</S.Title>
        <S.Subtitle>Centralized user permission management</S.Subtitle>
      </S.Header>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Relay Mode" loading={loading}>
            <ModeSelector
              currentMode={currentMode}
              onModeChange={handleModeChange}
              disabled={loading || saving}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Permissions Configuration" loading={loading}>
            <PermissionsConfig
              settings={localSettings}
              mode={currentMode}
              onSettingsChange={handleSettingsUpdate}
              disabled={loading || saving}
            />
          </Card>
        </Col>

        {showTiers && (
          <Col span={24}>
            <Card title="Tiers Configuration" loading={loading}>
              <TiersConfig
                settings={localSettings}
                mode={currentMode}
                onSettingsChange={handleSettingsUpdate}
                disabled={loading || saving}
              />
            </Card>
          </Col>
        )}

        {showNpubManagement && (
          <Col span={24}>
            <Card title="User Lists Management">
              <NPubManagement
                settings={localSettings}
                mode={currentMode}
              />
            </Card>
          </Col>
        )}

        <Col span={24}>
          <S.SaveSection>
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                disabled={!hasChanges}
              >
                Save Changes
              </Button>
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
  );
};