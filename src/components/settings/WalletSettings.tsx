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
      form.setFieldsValue(settings);
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
          <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            Note: The wallet API key is stored securely and used to authenticate with the wallet service.
            Make sure to keep your API key confidential and never share it with others.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default WalletSettings;
