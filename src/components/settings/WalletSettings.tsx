import React, { useEffect } from 'react';
import { Form, Input, Tooltip } from 'antd';
import { QuestionCircleOutlined, LockOutlined, WalletOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';

const WalletSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('wallet');

  const [form] = Form.useForm();

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      console.log('WalletSettings - Received settings:', settings);
      
      // Transform property names to match form field names
      // The API returns properties without the prefix, but the form expects prefixed names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        wallet_name: settingsObj.name,
        wallet_api_key: settingsObj.api_key
      };
      
      console.log('WalletSettings - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('WalletSettings - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'wallet'>>) => {
    updateSettings(changedValues);
  };

  return (
    <BaseSettingsForm
      title="Wallet Settings"
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
            padding: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderLeft: '3px solid rgba(82, 196, 255, 0.8)',
            borderRadius: '0 4px 4px 0'
          }}>
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> The wallet API key is stored securely and used to authenticate with the wallet service.
            Make sure to keep your API key confidential and never share it with others.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default WalletSettings;
