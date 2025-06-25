import React, { useEffect, useState } from 'react';
import { Form, Switch, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { ImageModerationSettings as ImageModerationSettingsType, SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import * as S from './Settings.styles';
const { Option } = Select;

const ImageModerationSettings: React.FC = () => {
  const { settings, loading, error, fetchSettings, updateSettings, saveSettings } =
    useGenericSettings('image_moderation');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if the user isn't currently editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('ImageModerationSettings - Received settings:', settings);

      // The useGenericSettings hook now returns properly prefixed field names
      // so we can use the settings directly without transformation
      const settingsObj = settings as Record<string, any>;

      console.log('ImageModerationSettings - Setting form values directly:', settingsObj);

      // Set form values directly since they're already properly prefixed
      form.setFieldsValue(settingsObj);
      console.log('ImageModerationSettings - Form values after set:', form.getFieldsValue());
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'image_moderation'>>) => {
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
      title="Image Moderation Settings"
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
        <Form.Item name="image_moderation_enabled" label="Enable Image Moderation" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          name="image_moderation_mode"
          label={
            <span>
              Moderation Mode&nbsp;
              <Tooltip title="Select the appropriate moderation mode based on your needs for accuracy vs. performance">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Select allowClear={true} placeholder="Select a moderation mode">
            <Option value="basic">Basic Mode (Fastest, detects explicit content only)</Option>
            <Option value="strict">Strict Mode (Fast, blocks all buttocks)</Option>
            <Option value="full">Full Mode (Most accurate, uses Llama Vision)</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          >
            <h4 style={{ marginTop: 0 }}>Moderation Mode Details:</h4>
            <p>
              <strong>Basic Mode:</strong> Only detects genitals, anus, and exposed breasts. Fastest processing (no
              Llama Vision). Best for high-volume applications.
            </p>
            <p>
              <strong>Strict Mode:</strong> Includes all &quot;basic&quot; detection plus automatic blocking of all
              detected buttocks. Fast processing. Best for zero-tolerance platforms.
            </p>
            <p>
              <strong>Full Mode (Default):</strong> Complete analysis with contextual evaluation. Slower due to Llama
              Vision, but most accurate. Reduces false positives.
            </p>
          </div>
        </Form.Item>

        <Form.Item
          name="image_moderation_api"
          label="API Endpoint"
          rules={[{ required: true, message: 'Please enter the API endpoint' }]}
        >
          <S.InputField placeholder="http://localhost:8000/moderate" />
        </Form.Item>

        <Form.Item name="image_moderation_temp_dir" label="Temporary Directory">
          <S.InputField placeholder="./data/moderation/temp" />
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
            { type: 'number', min: 0, max: 1, message: 'Value must be between 0 and 1' },
          ]}
        >
          <S.InputNumberField step={0.1} min={0} max={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_check_interval"
          label="Check Interval (seconds)"
          rules={[
            { required: true, message: 'Please enter a check interval' },
            { type: 'number', min: 1, message: 'Value must be at least 1' },
          ]}
        >
          <S.InputNumberField min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_concurrency"
          label="Concurrency"
          rules={[
            { required: true, message: 'Please enter a concurrency value' },
            { type: 'number', min: 1, message: 'Value must be at least 1' },
          ]}
        >
          <S.InputNumberField min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="image_moderation_timeout"
          label="Timeout (seconds)"
          rules={[
            { required: true, message: 'Please enter a timeout value' },
            { type: 'number', min: 1, message: 'Value must be at least 1' },
          ]}
        >
          <S.InputNumberField min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default ImageModerationSettings;
