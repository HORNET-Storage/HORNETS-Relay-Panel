import React from 'react';
import { Form, Select, Card, Space, Alert } from 'antd';
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
      <Card title="Global Access Permissions" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Mode description */}
          <Alert
            message={`${settings.mode.charAt(0).toUpperCase() + settings.mode.slice(1)} Mode`}
            description={modeConfig.description}
            type="info"
            showIcon
          />

          <Form layout="vertical">
            {/* Read Permission */}
            <Form.Item
              label="Read Permission"
              help={isReadForced ? "This permission is automatically set based on the selected mode" : "Who can read from this relay"}
            >
              <Select
                value={settings.read}
                onChange={handleReadPermissionChange}
                options={readOptions}
                disabled={disabled || isReadForced}
                placeholder="Select read permission"
              />
            </Form.Item>

            {/* Write Permission */}
            <Form.Item
              label="Write Permission"
              help={isWriteForced ? "This permission is automatically set based on the selected mode" : "Who can write to this relay"}
            >
              <Select
                value={settings.write}
                onChange={handleWritePermissionChange}
                options={writeOptions}
                disabled={disabled || isWriteForced}
                placeholder="Select write permission"
              />
            </Form.Item>
          </Form>

          {/* Permission explanations */}
          <S.PermissionExplanations>
            <h4>Permission Types:</h4>
            <ul>
              <li><strong>All Users:</strong> Everyone can access (no restrictions)</li>
              <li><strong>Paid Users:</strong> Only users with active paid subscriptions</li>
              <li><strong>Allowed Users:</strong> Only users in the allowed users list</li>
              <li><strong>Only Me:</strong> Only the relay owner can access</li>
            </ul>
          </S.PermissionExplanations>
        </Space>
      </Card>
    </S.Container>
  );
};
