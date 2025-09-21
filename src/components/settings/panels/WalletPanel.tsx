import React, { useEffect, useState } from 'react';
import { Form, Input, Tooltip, Button, Alert, Spin } from 'antd';
import { QuestionCircleOutlined, LockOutlined, WalletOutlined, SaveOutlined } from '@ant-design/icons';
import { LiquidBlueButton } from '@app/components/common/LiquidBlueButton';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';

const WalletPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings: saveWalletSettings,
  } = useGenericSettings('wallet');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);
  
  // Listen for save button click
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
      console.log('WalletPanel - Received settings:', settings);
      
      // The useGenericSettings hook now returns properly prefixed field names
      // so we can use the settings directly without transformation
      const settingsObj = settings as Record<string, any>;
      
      console.log('WalletPanel - Setting form values directly:', settingsObj);
      
      // Set form values directly since they're already properly prefixed
      form.setFieldsValue(settingsObj);
      console.log('WalletPanel - Form values after set:', form.getFieldsValue());
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'wallet'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('WalletPanel - changedValues:', changedValues);
    console.log('WalletPanel - current form values:', form.getFieldsValue());
    updateSettings(changedValues);
  };

  const handlePanelSave = async () => {
    try {
      await saveWalletSettings();
      setIsUserEditing(false);
      console.log('Wallet settings saved successfully');
    } catch (error) {
      console.error('Error saving Wallet settings:', error);
    }
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
      
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <LiquidBlueButton
          variant="primary"
          icon={<SaveOutlined />}
          onClick={handlePanelSave}
          disabled={loading}
        >
          Save
        </LiquidBlueButton>
      </div>
      
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
        <Form.Item
          name="wallet_name"
          label={
            <span>
              Wallet Name&nbsp;
              <Tooltip title="Name of the wallet service to use">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter a wallet name' }
          ]}
        >
          <Input 
            prefix={<WalletOutlined />} 
            placeholder="Enter wallet name" 
          />
        </Form.Item>

        <Form.Item
          name="wallet_api_key"
          label={
            <span>
              API Key&nbsp;
              <Tooltip title="API key for the wallet service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the wallet API key' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter API key"
          />
        </Form.Item>

        <Form.Item>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9em',
            padding: '0.75rem 0 0.75rem 0.75rem',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)'
          }}>
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> The wallet API key is stored securely and used to authenticate with the wallet service.
            Make sure to keep your API key confidential and never share it with others.
          </p>
        </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default WalletPanel;
