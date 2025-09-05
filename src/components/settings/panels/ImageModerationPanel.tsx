import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Select, Alert, Spin } from 'antd';
import { QuestionCircleOutlined, FolderOutlined, ApiOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';

const { Option } = Select;

const ImageModerationPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
  } = useGenericSettings('image_moderation');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Add initial debug logging
  console.log('ImageModerationPanel - Initial settings:', settings);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('ImageModerationPanel - Received settings:', settings);
      
      // The useGenericSettings hook now returns properly prefixed field names
      // so we can use the settings directly without transformation
      const settingsObj = settings as Record<string, any>;
      
      console.log('ImageModerationPanel - Setting form values directly:', settingsObj);
      
      // Set form values directly since they're already properly prefixed
      form.setFieldsValue(settingsObj);
      console.log('ImageModerationPanel - Form values after set:', form.getFieldsValue());
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'image_moderation'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('ImageModerationPanel - changedValues:', changedValues);
    console.log('ImageModerationPanel - current form values:', form.getFieldsValue());
    updateSettings(changedValues);
  };

  return (
    <>
      {error && (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}
      
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          initialValues={settings || {}}
          onFinish={(values) => {
            console.log('Form submitted with values:', values);
            setIsUserEditing(false);
          }}
          style={{
            // Remove all container styling from the form
            padding: 0,
            margin: 0,
            background: 'transparent',
            border: 'none'
          }}
          colon={false}
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
              <Tooltip title="Select the appropriate moderation mode based on your needs for accuracy vs. performance">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Select
            placeholder="Select a moderation mode"
            allowClear={true}
          >
            <Option value="basic">Basic Mode (Fastest, detects explicit content only)</Option>
            <Option value="strict">Strict Mode (Fast, blocks all buttocks)</Option>
            <Option value="full">Full Mode (Most accurate, uses AI vision analysis)</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9em',
            padding: '0.75rem 0 0.75rem 0.75rem',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)',
            marginBottom: '16px'
          }}>
            <h4 style={{ marginTop: 0, color: 'rgba(82, 196, 255, 1)' }}>Moderation Mode Details:</h4>
            <p><strong>Basic Mode:</strong> Only detects genitals, anus, and exposed breasts. Fastest processing (no AI vision analysis). Best for initial screening in high-volume applications.</p>
            <p><strong>Strict Mode:</strong> Includes all &quot;basic&quot; detection plus automatic blocking of all detected buttocks with confidence ≥ 0.4. Fast processing (no AI vision analysis). Best for zero-tolerance platforms.</p>
            <p><strong>Full Mode (Default):</strong> Complete analysis with nuanced context evaluation. Slower due to AI vision model processing, but most accurate and reduces false positives.</p>
          </div>
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
            padding: '0.75rem 0 0.75rem 0.75rem',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)'
          }}>
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Image moderation helps filter inappropriate content. Higher thresholds are more permissive, lower thresholds are more strict.
          </p>
        </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default ImageModerationPanel;
