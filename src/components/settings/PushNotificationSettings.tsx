import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Tooltip, Alert, Spin, Divider, Card } from 'antd';
import {
  QuestionCircleOutlined,
  KeyOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { LiquidToggle } from '@app/components/common/LiquidToggle';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import styled from 'styled-components';

const Container = styled.div`
  background: rgba(0, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  margin-bottom: 1rem;
`;

const PushNotificationSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('push_notifications');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('PushNotificationSettings - Received settings:', settings);
      
      // The useGenericSettings hook returns the settings data
      const settingsObj = settings as Record<string, any>;
      
      console.log('PushNotificationSettings - Setting form values directly:', settingsObj);
      
      // Set form values directly
      form.setFieldsValue(settingsObj);
      console.log('PushNotificationSettings - Form values after set:', form.getFieldsValue());
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'push_notifications'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    updateSettings(changedValues);
  };


  return (
    <Container>
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
            padding: 0,
            margin: 0,
            background: 'transparent',
            border: 'none'
          }}
          colon={false}
        >
        {/* Main Configuration */}
        <Divider orientation="left" style={{
          borderColor: 'rgba(82, 196, 255, 0.3)',
          fontSize: '0.95em',
          marginTop: 0
        }}>
          General Configuration
        </Divider>
        
          <Form.Item
            name="enabled"
            label={
              <span>
                Enable Push Notifications&nbsp;
                <Tooltip title="Master toggle for the push notification service">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <LiquidToggle />
          </Form.Item>
        {/* Service Configuration */}
        <Divider orientation="left" style={{
          borderColor: 'rgba(82, 196, 255, 0.3)',
          fontSize: '0.95em'
        }}>
          Service Configuration
        </Divider>
        
          <Form.Item
            name="service_worker_count"
            label={
              <span>
                Worker Count&nbsp;
                <Tooltip title="Number of concurrent workers processing notifications (1-100)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter worker count' },
              { type: 'number', min: 1, max: 100, message: 'Worker count must be between 1 and 100' }
            ]}
          >
            <InputNumber
              placeholder="Enter worker count"
              style={{ width: '100%' }}
              min={1}
              max={100}
            />
          </Form.Item>

          <Form.Item
            name="service_queue_size"
            label={
              <span>
                Queue Size&nbsp;
                <Tooltip title="Maximum notifications that can be queued (100-10000)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter queue size' },
              { type: 'number', min: 100, max: 10000, message: 'Queue size must be between 100 and 10000' }
            ]}
          >
            <InputNumber
              placeholder="Enter queue size"
              style={{ width: '100%' }}
              min={100}
              max={10000}
            />
          </Form.Item>

          <Form.Item
            name="service_retry_attempts"
            label={
              <span>
                Max Retry Attempts&nbsp;
                <Tooltip title="Maximum retry attempts for failed notifications (1-10)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter max retry attempts' },
              { type: 'number', min: 1, max: 10, message: 'Max retry attempts must be between 1 and 10' }
            ]}
          >
            <InputNumber
              placeholder="Enter max retry attempts"
              style={{ width: '100%' }}
              min={1}
              max={10}
            />
          </Form.Item>

          <Form.Item
            name="service_retry_delay"
            label={
              <span>
                Retry Base Delay&nbsp;
                <Tooltip title="Base delay between retries using Go duration format (e.g., '1s', '500ms', '2m')">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter retry base delay' },
              {
                pattern: /^\d+[a-zA-Z]+$/,
                message: 'Invalid duration format. Use Go duration format (e.g., "1s", "500ms", "2m")'
              }
            ]}
          >
            <Input
              placeholder="e.g., 1s, 500ms, 2m"
            />
          </Form.Item>

          <Form.Item
            name="service_batch_size"
            label={
              <span>
                Batch Size&nbsp;
                <Tooltip title="Number of notifications to process in each batch (1-1000)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter batch size' },
              { type: 'number', min: 1, max: 1000, message: 'Batch size must be between 1 and 1000' }
            ]}
          >
            <InputNumber
              placeholder="Enter batch size"
              style={{ width: '100%' }}
              min={1}
              max={1000}
            />
          </Form.Item>
        {/* APNs Configuration */}
        <Divider orientation="left" style={{
          borderColor: 'rgba(82, 196, 255, 0.3)',
          fontSize: '0.95em'
        }}>
          Apple Push Notification Service (APNs)
        </Divider>
        
          <Form.Item
            name="apns_enabled"
            label={
              <span>
                Enable APNs&nbsp;
                <Tooltip title="Enable Apple Push Notification service for iOS devices">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <LiquidToggle />
          </Form.Item>

          <Form.Item
            name="apns_key_path"
            label={
              <span>
                APNs Key File Path&nbsp;
                <Tooltip title="Path to the APNs .p8 key file (required if APNs is enabled)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: form.getFieldValue('apns_enabled'),
                message: 'Please enter APNs key file path when APNs is enabled'
              }
            ]}
          >
            <Input
              placeholder="path/to/apns-key.p8"
              prefix={<FileTextOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="apns_key_id"
            label={
              <span>
                APNs Key ID&nbsp;
                <Tooltip title="APNs Key ID, exactly 10 characters (required if APNs is enabled)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: form.getFieldValue('apns_enabled'),
                message: 'Please enter APNs key ID when APNs is enabled'
              },
              { len: 10, message: 'APNs Key ID must be exactly 10 characters' }
            ]}
          >
            <Input
              placeholder="YOUR_KEY_ID"
              prefix={<KeyOutlined />}
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            name="apns_team_id"
            label={
              <span>
                Team ID&nbsp;
                <Tooltip title="Apple Developer Team ID, exactly 10 characters (required if APNs is enabled)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: form.getFieldValue('apns_enabled'),
                message: 'Please enter Team ID when APNs is enabled'
              },
              { len: 10, message: 'Team ID must be exactly 10 characters' }
            ]}
          >
            <Input
              placeholder="YOUR_TEAM_ID"
              prefix={<KeyOutlined />}
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            name="apns_bundle_id"
            label={
              <span>
                App Bundle Identifier&nbsp;
                <Tooltip title="App's bundle identifier (required if APNs is enabled)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: form.getFieldValue('apns_enabled'),
                message: 'Please enter app bundle identifier when APNs is enabled'
              }
            ]}
          >
            <Input
              placeholder="com.your.app"
            />
          </Form.Item>

          <Form.Item
            name="apns_production"
            label={
              <span>
                Production Mode&nbsp;
                <Tooltip title="Use production APNs servers (default: false for sandbox)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <LiquidToggle />
          </Form.Item>
        {/* FCM Configuration */}
        <Divider orientation="left" style={{
          borderColor: 'rgba(82, 196, 255, 0.3)',
          fontSize: '0.95em'
        }}>
          Firebase Cloud Messaging (FCM)
        </Divider>
        
          <Form.Item
            name="fcm_enabled"
            label={
              <span>
                Enable FCM&nbsp;
                <Tooltip title="Enable Firebase Cloud Messaging for Android devices">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <LiquidToggle />
          </Form.Item>

          <Form.Item
            name="fcm_credentials_path"
            label={
              <span>
                FCM Credentials File Path&nbsp;
                <Tooltip title="Path to FCM service account JSON file (required if FCM is enabled)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: form.getFieldValue('fcm_enabled'),
                message: 'Please enter FCM credentials file path when FCM is enabled'
              }
            ]}
          >
            <Input
              placeholder="path/to/fcm-credentials.json"
              prefix={<FileTextOutlined />}
            />
          </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9em',
            padding: '0.75rem 0 0.75rem 0.75rem',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)'
          }}>
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Push notification settings are saved to the configuration file
            and the push notification service automatically reloads with the new configuration.
            At least one service (APNs or FCM) should be enabled if push notifications are enabled.
          </p>
        </Form.Item>
        </Form>
      </Spin>
    </Container>
  );
};

export default PushNotificationSettings;