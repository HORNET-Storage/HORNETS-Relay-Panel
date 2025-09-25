import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Alert, Spin, Divider, Button } from 'antd';
import {
  QuestionCircleOutlined,
  SaveOutlined,
  RedoOutlined
} from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import { LiquidBlueButton } from '@app/components/common/LiquidBlueButton';
import * as S from './PushNotificationPanel.styles';
import * as UI from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

const defaultPushSettings = {
  enabled: false,
  service_worker_count: 10,
  service_queue_size: 1000,
  service_retry_attempts: 3,
  service_retry_delay: '1s',
  service_batch_size: 100,
  apns_enabled: false,
  apns_key_path: '',
  apns_bundle_id: '',
  fcm_enabled: false,
  fcm_credentials_path: ''
};

const PushNotificationPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings,
  } = useGenericSettings('push_notifications');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Listen for global save event and push notification specific save event
  useEffect(() => {
    const handleGlobalSave = () => {
      setTimeout(() => {
        setIsUserEditing(false);
      }, 200);
    };
    
    const handlePushNotificationSave = () => {
      setTimeout(() => {
        setIsUserEditing(false);
      }, 200);
    };
    
    document.addEventListener('settings-saved', handleGlobalSave);
    document.addEventListener('push-notifications-saved', handlePushNotificationSave);
    
    return () => {
      document.removeEventListener('settings-saved', handleGlobalSave);
      document.removeEventListener('push-notifications-saved', handlePushNotificationSave);
    };
  }, []);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      // The useGenericSettings hook returns the settings data
      const settingsObj = settings as Record<string, any>;
      
      // Set form values directly
      form.setFieldsValue(settingsObj);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'push_notifications'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    updateSettings(changedValues);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await saveSettings();
      setIsUserEditing(false);
    } catch (error) {
      console.error('Error saving push notification settings:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(defaultPushSettings);
    updateSettings(defaultPushSettings);
    setIsUserEditing(true);
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
        <UI.Card>
          <S.PanelWrapper>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleValuesChange}
              initialValues={settings || {}}
              onFinish={() => {
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
          <Switch />
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
            />
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
            />
          </Form.Item>
          
          {/* Reset and Save Buttons at bottom */}
          <Form.Item style={{ marginTop: '2rem', marginBottom: 0 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(82, 196, 255, 0.2)'
            }}>
              <Button
                icon={<RedoOutlined />}
                onClick={handleReset}
                disabled={loading || saveLoading}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff'
                }}
              >
                Reset
              </Button>
              <LiquidBlueButton
                variant="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saveLoading}
                disabled={loading}
              >
                Save
              </LiquidBlueButton>
            </div>
          </Form.Item>
            </Form>
          </S.PanelWrapper>
        </UI.Card>
      </Spin>
    </>
  );
};

export default PushNotificationPanel;