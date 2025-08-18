import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Card } from 'antd';
import { 
  QuestionCircleOutlined, 
  BellOutlined, 
  AppleOutlined, 
  AndroidOutlined, 
  SettingOutlined,
  KeyOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const PushNotificationPanel: React.FC = () => {
  console.log('PushNotificationPanel - Component rendering');
  
  const {
    settings,
    loading,
    error,
    updateSettings,
    // saveSettings is not used in panels - they use the global save
  } = useGenericSettings('push_notifications');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);
  
  console.log('PushNotificationPanel - Hook result:', { settings, loading, error });

  // Listen for global save event
  useEffect(() => {
    const handleGlobalSave = () => {
      setTimeout(() => {
        setIsUserEditing(false);
      }, 200);
    };
    
    document.addEventListener('settings-saved', handleGlobalSave);
    
    return () => {
      document.removeEventListener('settings-saved', handleGlobalSave);
    };
  }, []);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('PushNotificationPanel - Received settings:', settings);
      
      // The useGenericSettings hook returns the settings data
      const settingsObj = settings as Record<string, any>;
      
      console.log('PushNotificationPanel - Setting form values directly:', settingsObj);
      
      // Set form values directly
      form.setFieldsValue(settingsObj);
      console.log('PushNotificationPanel - Form values after set:', form.getFieldsValue());
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'push_notifications'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('PushNotificationPanel - changedValues:', changedValues);
    console.log('PushNotificationPanel - current form values:', form.getFieldsValue());
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
        {/* Main Configuration */}
        <Card 
          title={
            <span>
              <BellOutlined style={{ marginRight: 8 }} />
              General Configuration
            </span>
          } 
          style={{ marginBottom: 16 }}
          size="small"
        >
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
            <Switch />
          </Form.Item>
        </Card>

        {/* Service Configuration */}
        <Card 
          title={
            <span>
              <SettingOutlined style={{ marginRight: 8 }} />
              Service Configuration
            </span>
          } 
          style={{ marginBottom: 16 }}
          size="small"
        >
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
              prefix={<SettingOutlined />}
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
        </Card>

        {/* APNs Configuration */}
        <Card 
          title={
            <span>
              <AppleOutlined style={{ marginRight: 8 }} />
              Apple Push Notification Service (APNs)
            </span>
          } 
          style={{ marginBottom: 16 }}
          size="small"
        >
          <Form.Item
            name="apns_enabled"
            label={
              <span>
                Enable APNs&nbsp;
                <Tooltip title="Enable Apple Push Notification Service for iOS devices">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="apns_key_path"
            label={
              <span>
                APNs Key File Path&nbsp;
                <Tooltip title="Path to the APNs authentication key file (.p8)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: false, message: 'Please enter the APNs key file path' }
            ]}
          >
            <Input 
              placeholder="e.g., /path/to/AuthKey_XXXXXXXXXX.p8" 
              prefix={<KeyOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="apns_bundle_id"
            label={
              <span>
                Bundle ID&nbsp;
                <Tooltip title="Your app's bundle identifier (e.g., com.yourcompany.yourapp)">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: false, message: 'Please enter the bundle ID' },
              { 
                pattern: /^[a-zA-Z0-9.-]+$/, 
                message: 'Invalid bundle ID format' 
              }
            ]}
          >
            <Input 
              placeholder="e.g., com.yourcompany.yourapp" 
              prefix={<AppleOutlined />}
            />
          </Form.Item>
        </Card>

        {/* FCM Configuration */}
        <Card 
          title={
            <span>
              <AndroidOutlined style={{ marginRight: 8 }} />
              Firebase Cloud Messaging (FCM)
            </span>
          } 
          style={{ marginBottom: 16 }}
          size="small"
        >
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
            <Switch />
          </Form.Item>

          <Form.Item
            name="fcm_credentials_path"
            label={
              <span>
                FCM Service Account Key Path&nbsp;
                <Tooltip title="Path to the Firebase service account credentials JSON file">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: false, message: 'Please enter the FCM credentials file path' }
            ]}
          >
            <Input 
              placeholder="e.g., /path/to/firebase-service-account.json" 
              prefix={<FileTextOutlined />}
            />
          </Form.Item>
        </Card>
      </Form>
    </BaseSettingsPanel>
  );
};

export default PushNotificationPanel;