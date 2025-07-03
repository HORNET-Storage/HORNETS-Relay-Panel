import React from 'react';
import { Form, Select, Space, Alert } from 'antd';
import { AllowedUsersSettings, AllowedUsersMode, PermissionType, MODE_CONFIGURATIONS, getPermissionLabel } from '@app/types/allowedUsers.types';
import * as S from './PermissionsConfig.styles';

interface PermissionsConfigProps {
  settings: AllowedUsersSettings;
  onSettingsChange: (settings: AllowedUsersSettings) => void;
  disabled?: boolean;
}

export const PermissionsConfig: React.FC<PermissionsConfigProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const modeConfig = MODE_CONFIGURATIONS[settings.mode];

  // Safety check for undefined modeConfig
  if (!modeConfig) {
    return (
      <S.Container>
        <Alert
          message="Invalid Mode"
          description={`Unknown mode: ${settings.mode}. Please select a valid mode.`}
          type="error"
          showIcon
        />
      </S.Container>
    );
  }

  const handleReadPermissionChange = (value: PermissionType) => {
    onSettingsChange({
      ...settings,
      read: value
    });
  };

  const handleWritePermissionChange = (value: PermissionType) => {
    onSettingsChange({
      ...settings,
      write: value
    });
  };

  // Create options for read permissions
  const readOptions = modeConfig.readOptions.map(permission => ({
    value: permission,
    label: getPermissionLabel(permission)
  }));

  // Create options for write permissions
  const writeOptions = modeConfig.writeOptions.map(permission => ({
    value: permission,
    label: getPermissionLabel(permission)
  }));

  // Check if permissions are forced by mode
  const isReadForced = !!modeConfig.forcedRead;
  const isWriteForced = !!modeConfig.forcedWrite;

  return (
    <S.Container>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Mode description */}
        <Alert
          message={`${settings.mode.charAt(0).toUpperCase() + settings.mode.slice(1)} Mode`}
          description={modeConfig.description}
          type="info"
          showIcon
          style={{ 
            backgroundColor: '#25284B',
            border: '1px solid #d9d9d9',
            color: '#d9d9d9'
          }}
        />

        <Form layout="vertical">
          {/* Read Permission */}
          <Form.Item
            label={<span style={{ color: '#d9d9d9' }}>Read Permission</span>}
            help={<span style={{ color: '#d9d9d9' }}>{isReadForced ? "This permission is automatically set based on the selected mode" : "Who can read from this relay"}</span>}
          >
            <S.ForcedSelectWrapper $isForced={isReadForced}>
              <Select
                value={settings.read}
                onChange={handleReadPermissionChange}
                options={readOptions}
                disabled={disabled || isReadForced}
                placeholder="Select read permission"
              />
            </S.ForcedSelectWrapper>
          </Form.Item>

          {/* Write Permission */}
          <Form.Item
            label={<span style={{ color: '#d9d9d9' }}>Write Permission</span>}
            help={<span style={{ color: '#d9d9d9' }}>{isWriteForced ? "This permission is automatically set based on the selected mode" : "Who can write to this relay"}</span>}
          >
            <S.ForcedSelectWrapper $isForced={isWriteForced}>
              <Select
                value={settings.write}
                onChange={handleWritePermissionChange}
                options={writeOptions}
                disabled={disabled || isWriteForced}
                placeholder="Select write permission"
              />
            </S.ForcedSelectWrapper>
          </Form.Item>
        </Form>
      </Space>
    </S.Container>
  );
};
