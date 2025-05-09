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
      form.setFieldsValue(settings);
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
            <Option value="full">Full</Option>
            <Option value="basic">Basic</Option>
            <Option value="minimal">Minimal</Option>
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
