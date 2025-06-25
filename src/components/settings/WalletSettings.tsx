import React, { useEffect, useState } from 'react';
import { Form, Input, Tooltip } from 'antd';
import { QuestionCircleOutlined, LockOutlined, WalletOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import * as S from './Settings.styles';

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
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('WalletSettings - Received settings:', settings);
      
      // The useGenericSettings hook now returns properly prefixed field names
      // so we can use the settings directly without transformation
      const settingsObj = settings as Record<string, any>;
      
      console.log('WalletSettings - Setting form values directly:', settingsObj);
      
      // Set form values directly since they're already properly prefixed
      form.setFieldsValue(settingsObj);
      console.log('WalletSettings - Form values after set:', form.getFieldsValue());
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'wallet'>>) => {
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
      title="Wallet Settings"
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
          <S.InputField
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
