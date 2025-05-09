import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';

const NestFeederSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('nest_feeder');

  const [form] = Form.useForm();

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'nest_feeder'>>) => {
    updateSettings(changedValues);
  };

  return (
    <BaseSettingsForm
      title="Nest Feeder Settings"
      loading={loading}
      error={error}
      onSave={saveSettings}
      onReset={fetchSettings}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={settings || {}}
      >
        <Form.Item
          name="nest_feeder_enabled"
          label="Enable Nest Feeder"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="nest_feeder_url"
          label={
            <span>
              Nest Feeder URL&nbsp;
              <Tooltip title="URL of the Nest Feeder service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the Nest Feeder URL' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}
        >
          <Input placeholder="https://nest-feeder.example.com" />
        </Form.Item>

        <Form.Item
          name="nest_feeder_timeout"
          label={
            <span>
              Timeout (seconds)&nbsp;
              <Tooltip title="Maximum time to wait for a response from the Nest Feeder service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter a timeout value' },
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="nest_feeder_cache_size"
          label={
            <span>
              Cache Size&nbsp;
              <Tooltip title="Maximum number of entries to store in the Nest Feeder cache">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter a cache size' },
            { type: 'number', min: 100, message: 'Value must be at least 100' }
          ]}
        >
          <InputNumber min={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="nest_feeder_cache_ttl"
          label={
            <span>
              Cache TTL (seconds)&nbsp;
              <Tooltip title="Time to live for cache entries in seconds">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter a cache TTL' },
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default NestFeederSettings;
