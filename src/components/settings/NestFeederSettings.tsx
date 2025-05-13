import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined, ApiOutlined } from '@ant-design/icons';
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
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('NestFeederSettings - Received settings:', settings);
      
      // Transform property names to match form field names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        nest_feeder_enabled: settingsObj.enabled,
        nest_feeder_url: settingsObj.url,
        nest_feeder_cache_size: typeof settingsObj.cache_size === 'string'
          ? parseInt(settingsObj.cache_size)
          : settingsObj.cache_size,
        nest_feeder_cache_ttl: typeof settingsObj.cache_ttl === 'string'
          ? parseInt(settingsObj.cache_ttl)
          : settingsObj.cache_ttl,
        nest_feeder_timeout: typeof settingsObj.timeout === 'string'
          ? parseInt(settingsObj.timeout)
          : settingsObj.timeout,
      };
      
      console.log('NestFeederSettings - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('NestFeederSettings - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'nest_feeder'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    updateSettings(changedValues);
  };

  // Modified save function to reset the editing flag
  const handleSave = async () => {
    await saveSettings();
    setIsUserEditing(false); // Reset after saving
  };

  return (
    <BaseSettingsForm
      title="Nest Feeder Settings"
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
              API Endpoint&nbsp;
              <Tooltip title="URL of the Nest Feeder API">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please enter the API endpoint' }]}
        >
          <Input 
            prefix={<ApiOutlined />}
            placeholder="http://localhost:8000/feed" 
          />
        </Form.Item>

        <Form.Item
          name="nest_feeder_cache_size"
          label={
            <span>
              Cache Size&nbsp;
              <Tooltip title="Maximum number of entries in the nest feeder cache">
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

        <Form.Item
          name="nest_feeder_timeout"
          label={
            <span>
              Timeout (seconds)&nbsp;
              <Tooltip title="Timeout for API requests">
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
      </Form>
    </BaseSettingsForm>
  );
};

export default NestFeederSettings;
