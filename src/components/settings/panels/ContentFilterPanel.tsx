import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Switch, Tooltip, Select } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const { Option } = Select;

const ContentFilterPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
  } = useGenericSettings('content_filter');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('ContentFilterPanel - Received settings:', settings);
      
      // Transform property names to match form field names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        content_filter_enabled: settingsObj.enabled,
        content_filter_cache_size: typeof settingsObj.cache_size === 'string'
          ? parseInt(settingsObj.cache_size)
          : settingsObj.cache_size,
        content_filter_cache_ttl: typeof settingsObj.cache_ttl === 'string'
          ? parseInt(settingsObj.cache_ttl)
          : settingsObj.cache_ttl,
        full_text_kinds: settingsObj.full_text_kinds
      };
      
      console.log('ContentFilterPanel - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('ContentFilterPanel - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'content_filter'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('ContentFilterPanel - changedValues:', changedValues);
    console.log('ContentFilterPanel - current form values:', form.getFieldsValue());
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
        onFinish={(values) => {
          console.log('Form submitted with values:', values);
          setIsUserEditing(false);
        }}
      >
        <Form.Item
          name="content_filter_enabled"
          label={
            <span>
              Enable Content Filter&nbsp;
              <Tooltip title="Enable automatic filtering of content">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="content_filter_cache_size"
          label={
            <span>
              Cache Size&nbsp;
              <Tooltip title="Maximum number of entries in the content filter cache">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 100, message: 'Value must be at least 100' }
          ]}
        >
          <InputNumber 
            min={100} 
            style={{ width: '100%' }}
          />
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
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber 
            min={1} 
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="full_text_kinds"
          label={
            <span>
              Full Text Kinds&nbsp;
              <Tooltip title="Nostr event kinds that should have full text analysis">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Select
            mode="multiple"
            placeholder="Select event kinds"
            style={{ width: '100%' }}
          >
            <Option value={1}>Kind 1 - Short Text Note</Option>
            <Option value={30023}>Kind 30023 - Long-form Content</Option>
            <Option value={1984}>Kind 1984 - Report</Option>
            <Option value={9802}>Kind 9802 - Highlights</Option>
          </Select>
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
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Content filtering helps prevent spam and inappropriate content. The cache improves performance by avoiding repeated analysis of the same content.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default ContentFilterPanel;
