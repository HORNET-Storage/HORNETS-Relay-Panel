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
            name={['service', 'worker_count']}
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
            name={['service', 'queue_size']}
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
            name={['service', 'retry_max_attempts']}
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
            name={['service', 'retry_base_delay']}
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
            name={['apns', 'enabled']}
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
            <Switch />
          </Form.Item>

          <Form.Item
            name={['apns', 'key_file']}
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
                required: form.getFieldValue(['apns', 'enabled']), 
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
            name={['apns', 'key_id']}
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
                required: form.getFieldValue(['apns', 'enabled']), 
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
            name={['apns', 'team_id']}
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
                required: form.getFieldValue(['apns', 'enabled']), 
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
            name={['apns', 'topic']}
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
                required: form.getFieldValue(['apns', 'enabled']), 
                message: 'Please enter app bundle identifier when APNs is enabled' 
              }
            ]}
          >
            <Input 
              placeholder="com.your.app" 
              prefix={<AppleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name={['apns', 'production']}
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
            <Switch />
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
            name={['fcm', 'enabled']}
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
            name={['fcm', 'credentials_file']}
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
                required: form.getFieldValue(['fcm', 'enabled']), 
                message: 'Please enter FCM credentials file path when FCM is enabled' 
              }
            ]}
          >
            <Input 
              placeholder="path/to/fcm-credentials.json" 
              prefix={<FileTextOutlined />}
            />
          </Form.Item>
        </Card>

        <Form.Item>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9em',
            padding: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)',
            borderRadius: '0 4px 4px 0'
          }}>
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Push notification settings require appropriate credentials and configuration files to function properly. Ensure you have the necessary APNs or FCM credentials configured on your server.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default PushNotificationPanel;