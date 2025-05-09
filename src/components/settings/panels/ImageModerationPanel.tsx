import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Select } from 'antd';
import { QuestionCircleOutlined, FolderOutlined, ApiOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const { Option } = Select;

const ImageModerationPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
  } = useGenericSettings('image_moderation');

  const [form] = Form.useForm();

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      console.log('ImageModerationPanel - Received settings:', settings);
      
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
      
      console.log('ImageModerationPanel - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('ImageModerationPanel - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'image_moderation'>>) => {
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
        onFinish={(values) => console.log('Form submitted with values:', values)}
      >
        <Form.Item
          name="image_moderation_enabled"
          label={
            <span>
              Enable Image Moderation&nbsp;
              <Tooltip title="Enable automatic moderation of images">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="image_moderation_api"
          label={
            <span>
              Moderation API Endpoint&nbsp;
              <Tooltip title="URL of the image moderation API">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the API endpoint' }
          ]}
        >
          <Input 
            prefix={<ApiOutlined />}
            placeholder="http://localhost:8000/moderate" 
          />
        </Form.Item>

        <Form.Item
          name="image_moderation_mode"
          label={
            <span>
              Moderation Mode&nbsp;
              <Tooltip title="How images should be moderated">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Select placeholder="Select a moderation mode">
            <Option value="full">Full (Check all images)</Option>
            <Option value="basic">Basic (Limited checks)</Option>
            <Option value="minimal">Minimal (Essential checks only)</Option>
            <Option value="sample">Sample (Check random images)</Option>
            <Option value="flagged">Flagged Only (Check only reported images)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="image_moderation_threshold"
          label={
            <span>
              Moderation Threshold&nbsp;
              <Tooltip title="Threshold for flagging inappropriate content (0.0 to 1.0)">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 0, max: 1, message: 'Value must be between 0 and 1' }
          ]}
        >
          <InputNumber 
            min={0} 
            max={1} 
            step={0.05} 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="image_moderation_concurrency"
          label={
            <span>
              Concurrency&nbsp;
              <Tooltip title="Number of concurrent moderation processes">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_check_interval"
          label={
            <span>
              Check Interval (seconds)&nbsp;
              <Tooltip title="Interval between moderation checks">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_timeout"
          label={
            <span>
              Timeout (seconds)&nbsp;
              <Tooltip title="Maximum time for a moderation request">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_temp_dir"
          label={
            <span>
              Temporary Directory&nbsp;
              <Tooltip title="Directory to store temporary files for moderation">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input 
            prefix={<FolderOutlined />}
            placeholder="./data/moderation/temp" 
          />
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
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Image moderation helps filter inappropriate content. Higher thresholds are more permissive, lower thresholds are more strict.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default ImageModerationPanel;
