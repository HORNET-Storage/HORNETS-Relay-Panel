import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined, LockOutlined, DatabaseOutlined, TagOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const GeneralSettingsPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
  } = useGenericSettings('general');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('GeneralSettingsPanel - Received settings:', settings);

      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(settings);
        console.log('GeneralSettingsPanel - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'general'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('GeneralSettingsPanel - changedValues:', changedValues);
    console.log('GeneralSettingsPanel - current form values:', form.getFieldsValue());
    updateSettings(changedValues);
  };

  return (
    <BaseSettingsPanel
      loading={loading}
      error={error}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={settings || {}}
      >
        <Form.Item
          name="port"
          label={
            <span>
              Port&nbsp;
              <Tooltip title="Port number for the relay server">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter a port number' },
            { pattern: /^\d+$/, message: 'Port must be a number' }
          ]}
        >
          <Input placeholder="8080" />
        </Form.Item>

        <Form.Item
          name="private_key"
          label={
            <span>
              Private Key&nbsp;
              <Tooltip title="Private key for the relay (keep this secure)">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the private key' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter private key"
          />
        </Form.Item>

        <Form.Item
          name="service_tag"
          label={
            <span>
              Service Tag&nbsp;
              <Tooltip title="Tag to identify this relay service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input
            prefix={<TagOutlined />}
            placeholder="Enter service tag"
          />
        </Form.Item>

        <Form.Item
          name="relay_stats_db"
          label={
            <span>
              Stats Database Path&nbsp;
              <Tooltip title="Path to the relay statistics database">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input
            prefix={<DatabaseOutlined />}
            placeholder="./data/stats.db"
          />
        </Form.Item>

        <Form.Item
          name="proxy"
          label={
            <span>
              Enable Proxy&nbsp;
              <Tooltip title="Enable proxy support for the relay">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="demo_mode"
          label={
            <span>
              Demo Mode&nbsp;
              <Tooltip title="Run the relay in demo mode with limited functionality">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="web"
          label={
            <span>
              Web Interface&nbsp;
              <Tooltip title="Enable the web interface for the relay">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9em',
            padding: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)',
            borderRadius: '0 4px 4px 0'
          }}>
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Changing these settings may require a restart of the relay server to take effect.
            The private key should be kept secure and not shared with others.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default GeneralSettingsPanel;
