import React from 'react';
import { Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined, LockOutlined, DatabaseOutlined, TagOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import BaseSettingsForm from './BaseSettingsForm';
import * as S from './Settings.styles';

const GeneralSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('general');


  return (
    <BaseSettingsForm
      loading={loading}
      error={error}
      onSave={saveSettings}
      onReset={fetchSettings}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Port&nbsp;
            <Tooltip title="Port number for the relay server">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
          <S.InputField
            placeholder="8080"
            value={settings?.port}
            onChange={(e) => updateSettings({ port: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Private Key&nbsp;
            <Tooltip title="Private key for the relay (keep this secure)">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
          <S.PasswordField
            prefix={<LockOutlined />}
            placeholder="Enter private key"
            value={settings?.private_key}
            onChange={(e) => updateSettings({ private_key: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Service Tag&nbsp;
            <Tooltip title="Tag to identify this relay service">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
          <S.InputFieldWithPrefix
            prefix={<TagOutlined />}
            placeholder="Enter service tag"
            value={settings?.service_tag}
            onChange={(e) => updateSettings({ service_tag: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Stats Database Path&nbsp;
            <Tooltip title="Path to the relay statistics database">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
          <S.InputFieldWithPrefix
            prefix={<DatabaseOutlined />}
            placeholder="./data/stats.db"
            value={settings?.relay_stats_db}
            onChange={(e) => updateSettings({ relay_stats_db: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Switch
            checked={settings?.proxy}
            onChange={(checked) => updateSettings({ proxy: checked })}
          />
          <label>
            Enable Proxy&nbsp;
            <Tooltip title="Enable proxy support for the relay">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Switch
            checked={settings?.demo_mode}
            onChange={(checked) => updateSettings({ demo_mode: checked })}
          />
          <label>
            Demo Mode&nbsp;
            <Tooltip title="Run the relay in demo mode with limited functionality">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Switch
            checked={settings?.web}
            onChange={(checked) => updateSettings({ web: checked })}
          />
          <label>
            Web Interface&nbsp;
            <Tooltip title="Enable the web interface for the relay">
              <QuestionCircleOutlined />
            </Tooltip>
          </label>
        </div>

        <div style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.9em',
          padding: '0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderLeft: '3px solid rgba(82, 196, 255, 0.8)',
          borderRadius: '0 4px 4px 0',
          marginTop: '1rem'
        }}>
          <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Changing these settings may require a restart of the relay server to take effect.
          The private key should be kept secure and not shared with others.
        </div>
      </div>
    </BaseSettingsForm>
  );
};

export default GeneralSettings;
