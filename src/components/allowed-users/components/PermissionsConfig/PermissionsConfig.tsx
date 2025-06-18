import React from 'react';
import { Switch, Select, Row, Col, Alert } from 'antd';
import { AllowedUsersSettings, AllowedUsersMode, MODE_CONFIGURATIONS } from '@app/types/allowedUsers.types';
import * as S from './PermissionsConfig.styles';

interface PermissionsConfigProps {
  settings: AllowedUsersSettings;
  mode: AllowedUsersMode;
  onSettingsChange: (settings: AllowedUsersSettings) => void;
  disabled?: boolean;
}

export const PermissionsConfig: React.FC<PermissionsConfigProps> = ({
  settings,
  mode,
  onSettingsChange,
  disabled = false
}) => {
  const modeConfig = MODE_CONFIGURATIONS[mode];

  const handleReadEnabledChange = (enabled: boolean) => {
    const updatedSettings = {
      ...settings,
      read_access: {
        ...settings.read_access,
        enabled
      }
    };
    onSettingsChange(updatedSettings);
  };

  const handleReadScopeChange = (scope: string) => {
    const updatedSettings = {
      ...settings,
      read_access: {
        ...settings.read_access,
        scope: scope as any
      }
    };
    onSettingsChange(updatedSettings);
  };

  const handleWriteEnabledChange = (enabled: boolean) => {
    const updatedSettings = {
      ...settings,
      write_access: {
        ...settings.write_access,
        enabled
      }
    };
    onSettingsChange(updatedSettings);
  };

  const handleWriteScopeChange = (scope: string) => {
    const updatedSettings = {
      ...settings,
      write_access: {
        ...settings.write_access,
        scope: scope as any
      }
    };
    onSettingsChange(updatedSettings);
  };

  const showPublicReadWarning = settings.read_access.enabled && settings.read_access.scope === 'all_users';

  return (
    <S.Container>
      {showPublicReadWarning && (
        <Alert
          message="Public Read Access Enabled"
          description="Your relay is configured to allow read access to all users. This means anyone can read events from your relay."
          type="warning"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#25284B',
            border: '1px solid #d9d9d9',
            color: '#d9d9d9'
          }}
        />
      )}

      <Row gutter={[24, 16]}>
        <Col span={24}>
          <S.PermissionRow>
            <S.PermissionLabel>Read:</S.PermissionLabel>
            <S.PermissionControls>
              <Switch
                checked={settings.read_access.enabled}
                onChange={handleReadEnabledChange}
                disabled={disabled}
              />
              {settings.read_access.enabled && (
                <Select
                  value={settings.read_access.scope}
                  onChange={handleReadScopeChange}
                  disabled={disabled}
                  style={{ minWidth: 150 }}
                >
                  {modeConfig.readOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </S.PermissionControls>
          </S.PermissionRow>
        </Col>

        <Col span={24}>
          <S.PermissionRow>
            <S.PermissionLabel>Write:</S.PermissionLabel>
            <S.PermissionControls>
              <Switch
                checked={settings.write_access.enabled}
                onChange={handleWriteEnabledChange}
                disabled={disabled}
              />
              {settings.write_access.enabled && (
                <Select
                  value={settings.write_access.scope}
                  onChange={handleWriteScopeChange}
                  disabled={disabled}
                  style={{ minWidth: 150 }}
                >
                  {modeConfig.writeOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </S.PermissionControls>
          </S.PermissionRow>
        </Col>
      </Row>

      <S.PermissionNotes>
        <S.NoteItem>
          <strong>Read Access:</strong> Controls who can read events from your relay
        </S.NoteItem>
        <S.NoteItem>
          <strong>Write Access:</strong> Controls who can publish events to your relay
        </S.NoteItem>
        {mode === 'paid' && (
          <S.NoteItem>
            <strong>Paid Mode:</strong> Write access is automatically limited to paid users
          </S.NoteItem>
        )}
        {mode === 'exclusive' && (
          <S.NoteItem>
            <strong>Exclusive Mode:</strong> Write access is automatically limited to allowed users
          </S.NoteItem>
        )}
      </S.PermissionNotes>
    </S.Container>
  );
};
