import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { ImageModerationSettings as ImageModerationSettingsType, SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';

const { Option } = Select;

const ImageModerationSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('image_moderation');

  const [form] = Form.useForm();

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      console.log('ImageModerationSettings - Received settings:', settings);
      
      // Transform property names to match form field names
      // The API returns properties without the prefix, but the form expects prefixed names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        image_moderation_api: settingsObj.api,
        image_moderation_check_interval: typeof settingsObj.check_interval === 'string' 
          ? parseFloat(settingsObj.check_interval) 
          : settingsObj.check_interval,
        image_moderation_concurrency: typeof settingsObj.concurrency === 'string' 
          ? parseFloat(settingsObj.concurrency) 
          : settingsObj.concurrency,
        image_moderation_enabled: settingsObj.enabled,
        image_moderation_mode: settingsObj.mode,
        image_moderation_temp_dir: settingsObj.temp_dir,
        image_moderation_threshold: typeof settingsObj.threshold === 'string' 
          ? parseFloat(settingsObj.threshold) 
          : settingsObj.threshold,
        image_moderation_timeout: typeof settingsObj.timeout === 'string' 
          ? parseFloat(settingsObj.timeout) 
          : settingsObj.timeout
      };
      
      console.log('ImageModerationSettings - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('ImageModerationSettings - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'image_moderation'>>) => {
    updateSettings(changedValues);
  };

  return (
    <BaseSettingsForm
      title="Image Moderation Settings"
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
        onFinish={(values) => console.log('Form submitted with values:', values)}
      >
        <Form.Item
          name="image_moderation_enabled"
          label="Enable Image Moderation"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="image_moderation_mode"
          label={
            <span>
              Moderation Mode&nbsp;
              <Tooltip title="Choose between 'full' for comprehensive moderation or other available modes">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Select>
            <Option value="full">Full (Check all images)</Option>
            <Option value="basic">Basic (Limited checks)</Option>
            <Option value="minimal">Minimal (Essential checks only)</Option>
            <Option value="sample">Sample (Check random images)</Option>
            <Option value="flagged">Flagged Only (Check only reported images)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="image_moderation_api"
          label="API Endpoint"
          rules={[{ required: true, message: 'Please enter the API endpoint' }]}
        >
          <Input placeholder="http://localhost:8000/moderate" />
        </Form.Item>

        <Form.Item
          name="image_moderation_temp_dir"
          label="Temporary Directory"
        >
          <Input placeholder="./data/moderation/temp" />
        </Form.Item>

        <Form.Item
          name="image_moderation_threshold"
          label={
            <span>
              Moderation Threshold&nbsp;
              <Tooltip title="Threshold value between 0 and 1. Lower values are more strict.">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter a threshold value' },
            { type: 'number', min: 0, max: 1, message: 'Value must be between 0 and 1' }
          ]}
        >
          <InputNumber
            step={0.1}
            min={0}
            max={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="image_moderation_check_interval"
          label="Check Interval (seconds)"
          rules={[
            { required: true, message: 'Please enter a check interval' },
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_concurrency"
          label="Concurrency"
          rules={[
            { required: true, message: 'Please enter a concurrency value' },
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_timeout"
          label="Timeout (seconds)"
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

export default ImageModerationSettings;
