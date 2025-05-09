import React, { useEffect } from 'react';
import { Form, InputNumber, Switch, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';

const { Option } = Select;

const ContentFilterSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('content_filter');

  const [form] = Form.useForm();

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'content_filter'>>) => {
    updateSettings(changedValues);
  };

  // Available Nostr kind options for full text filtering
  const kindOptions = [
    { value: 1, label: 'Kind 1 - Text Notes' },
    { value: 30023, label: 'Kind 30023 - Long-form Content' },
    { value: 1984, label: 'Kind 1984 - Reporting' },
    { value: 9735, label: 'Kind 9735 - Zap Receipt' },
    { value: 10002, label: 'Kind 10002 - Relay List' },
  ];

  return (
    <BaseSettingsForm
      title="Content Filter Settings"
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
          name="content_filter_enabled"
          label="Enable Content Filtering"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="content_filter_cache_size"
          label={
            <span>
              Cache Size&nbsp;
              <Tooltip title="Maximum number of entries to store in the content filter cache">
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
          name="content_filter_cache_ttl"
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

        <Form.Item
          name="full_text_kinds"
          label={
            <span>
              Full Text Kinds&nbsp;
              <Tooltip title="Nostr event kinds that should have their full text content analyzed">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Select
            mode="multiple"
            placeholder="Select kinds for full text analysis"
            style={{ width: '100%' }}
          >
            {kindOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default ContentFilterSettings;
