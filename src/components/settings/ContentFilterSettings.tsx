import React, { useEffect, useState } from 'react';
import { Form, Switch, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import { InputNumberField } from './Settings.styles';

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
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('ContentFilterSettings - Received settings:', settings);
      
      // Transform property names to match form field names
      // The API returns properties without the prefix, but the form expects prefixed names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        content_filter_enabled: settingsObj.enabled,
        content_filter_cache_size: typeof settingsObj.cache_size === 'string' 
          ? parseInt(settingsObj.cache_size) 
          : settingsObj.cache_size,
        content_filter_cache_ttl: typeof settingsObj.cache_ttl === 'string' 
          ? parseInt(settingsObj.cache_ttl) 
          : settingsObj.cache_ttl,
        full_text_kinds: settingsObj.full_text_kinds || []
      };
      
      console.log('ContentFilterSettings - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('ContentFilterSettings - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'content_filter'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    updateSettings(changedValues);
  };

  // Modified save function to reset the editing flag
  const handleSave = async () => {
    await saveSettings();
    setIsUserEditing(false); // Reset after saving
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
      loading={loading}
      error={error}
      onSave={handleSave}
      onReset={() => {
        fetchSettings();
        setIsUserEditing(false);
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={settings || {}}
        onFinish={(values) => {
          console.log('Form submitted with values:', values);
          setIsUserEditing(false);
        }}
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
          <InputNumberField min={100} style={{ width: '100%' }} />
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
          <InputNumberField min={1} style={{ width: '100%' }} />
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
