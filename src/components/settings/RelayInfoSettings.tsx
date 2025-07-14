import React, { useEffect } from 'react';
import { Form, Input, Select, Tooltip } from 'antd';
import {
  QuestionCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import IconUpload from '@app/components/common/IconUpload';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import * as S from './Settings.styles';
const { Option } = Select;
const { TextArea } = Input;

const RelayInfoSettings: React.FC = () => {
  const { settings, loading, error, fetchSettings, updateSettings, saveSettings } = useGenericSettings('relay_info');
  const [form] = Form.useForm();

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      const currentOrigin = window.location.origin;
      const expectedDefaultIcon = `${currentOrigin}/logo-dark-192.png`;
      
      // Check if relay icon is empty and set default bee logo
      const updatedSettings = { ...settings };
      let shouldUpdateBackend = false;
      
      if (!updatedSettings.relayicon || updatedSettings.relayicon.trim() === '') {
        updatedSettings.relayicon = expectedDefaultIcon;
        shouldUpdateBackend = true;
      } else if (updatedSettings.relayicon.endsWith('/logo-dark-192.png')) {
        // Check if the domain has changed from what's stored
        const storedIcon = updatedSettings.relayicon;
        if (storedIcon !== expectedDefaultIcon) {
          updatedSettings.relayicon = expectedDefaultIcon;
          shouldUpdateBackend = true;
        }
      }
      
      form.setFieldsValue(updatedSettings);
      
      // Automatically update backend if domain changed
      if (shouldUpdateBackend) {
        updateSettings({ relayicon: expectedDefaultIcon });
        // Auto-save the change to persist it
        setTimeout(() => {
          saveSettings();
        }, 100);
      }
    }
  }, [settings, form, updateSettings, saveSettings]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'relay_info'>>) => {
    // If relay icon is being cleared, set it to default
    if (changedValues.relayicon !== undefined && (!changedValues.relayicon || changedValues.relayicon.trim() === '')) {
      changedValues.relayicon = `${window.location.origin}/logo-dark-192.png`;
    }
    updateSettings(changedValues);
  };

  // const onUploadIcon = (url: string) => {
  //   // use as onUploadIcon prop in Upload Component
  //   setImage(url);
  // };

  // Common NIPs that relays might support
  const nipOptions = [
    { value: 1, label: 'NIP-01: Basic protocol flow' },
    { value: 2, label: 'NIP-02: Contact list' },
    { value: 4, label: 'NIP-04: Encrypted Direct Messages' },
    { value: 5, label: 'NIP-05: Mapping Nostr keys to DNS identifiers' },
    { value: 9, label: 'NIP-09: Event deletion' },
    { value: 11, label: 'NIP-11: Relay information document' },
    { value: 12, label: 'NIP-12: Generic tag queries' },
    { value: 15, label: 'NIP-15: End of Stored Events Notice' },
    { value: 16, label: 'NIP-16: Event Treatment' },
    { value: 20, label: 'NIP-20: Command Results' },
    { value: 22, label: 'NIP-22: Event created_at Limits' },
    { value: 26, label: 'NIP-26: Delegated Event Signing' },
    { value: 28, label: 'NIP-28: Public Chat' },
    { value: 33, label: 'NIP-33: Parameterized Replaceable Events' },
    { value: 40, label: 'NIP-40: Expiration Timestamp' },
    { value: 42, label: 'NIP-42: Authentication' },
    { value: 50, label: 'NIP-50: Search Capability' },
    { value: 56, label: 'NIP-56: Reporting' },
    { value: 65, label: 'NIP-65: Relay List Metadata' },
    { value: 78, label: 'NIP-78: Application-specific data' },
  ];

  return (
    <BaseSettingsForm
      title="Relay Information Settings"
      loading={loading}
      error={error}
      onSave={saveSettings}
      onReset={fetchSettings}
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange} initialValues={settings || {}}>
        <Form.Item
          name="relayname"
          label={
            <span>
              Relay Name&nbsp;
              <Tooltip title="The name of your relay">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please enter the relay name' }]}
        >
          <S.InputFieldWithPrefix prefix={<InfoCircleOutlined />} placeholder="My Nostr Relay" />
        </Form.Item>
        <Form.Item
          name="relayicon"
          label={
            <span>
              Relay Icon&nbsp;
              <Tooltip title="URL to an icon representing your relay (will be shown in relay lists). You can paste a URL or upload an image file.">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <IconUpload
            placeholder="https://example.com/relay-icon.png"
            maxSize={5}
          />
        </Form.Item>
        <Form.Item
          name="relaydescription"
          label={
            <span>
              Description&nbsp;
              <Tooltip title="A brief description of your relay">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <TextArea placeholder="A Nostr relay for..." autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>

        <Form.Item
          name="relaycontact"
          label={
            <span>
              Contact Information&nbsp;
              <Tooltip title="Contact information for the relay administrator">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <S.InputFieldWithPrefix prefix={<UserOutlined />} placeholder="admin@example.com" />
        </Form.Item>

        <Form.Item
          name="relaypubkey"
          label={
            <span>
              Public Key&nbsp;
              <Tooltip title="The public key of the relay">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please enter the relay public key' }]}
        >
          <S.InputFieldWithPrefix prefix={<KeyOutlined />} placeholder="npub..." />
        </Form.Item>

        <Form.Item
          name="relaydhtkey"
          label={
            <span>
              DHT Key&nbsp;
              <Tooltip title="The DHT key for the relay (if applicable)">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <S.InputFieldWithPrefix prefix={<KeyOutlined />} placeholder="DHT key" />
        </Form.Item>

        <Form.Item
          name="relaysoftware"
          label={
            <span>
              Relay Software&nbsp;
              <Tooltip title="The software used to run the relay (read-only)">
                <QuestionCircleOutlined />
              </Tooltip>
              &nbsp;(Read-only)
            </span>
          }
        >
          <S.InputField placeholder="HORNETS Relay" disabled />
        </Form.Item>

        <Form.Item
          name="relayversion"
          label={
            <span>
              Version&nbsp;
              <Tooltip title="The version of the relay software (read-only)">
                <QuestionCircleOutlined />
              </Tooltip>
              &nbsp;(Read-only)
            </span>
          }
        >
          <S.InputField placeholder="1.0.0" disabled />
        </Form.Item>
        <S.StyledOption>
          <Form.Item
            name="relaysupportednips"
            label={
              <span>
                Supported NIPs&nbsp;
                <Tooltip title="Nostr Implementation Possibilities (NIPs) supported by this relay">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
          >
            <Select
              mode="tags"
              placeholder="Select or type custom NIP numbers (e.g. 1, 42, 999)"
              style={{ width: '100%' }}
              tokenSeparators={[',', ' ']}
              filterOption={(input, option) => {
                if (!option?.children) return false;
                return option.children.toString().toLowerCase().includes(input.toLowerCase());
              }}
              onChange={(values: (string | number)[]) => {
                // Convert all values to numbers, filtering out invalid ones
                const numberValues = values
                  .map((val: string | number) => {
                    const num = Number(val);
                    return isNaN(num) ? null : num;
                  })
                  .filter((val: number | null): val is number => val !== null);
                // Update the form field with number values
                form.setFieldsValue({ relaysupportednips: numberValues });
              }}
            >
              {nipOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </S.StyledOption>

        <Form.Item>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9em',
              padding: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderLeft: '3px solid rgba(82, 196, 255, 0.8)',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> This information will be publicly available to
            clients connecting to your relay. It helps users understand the capabilities and ownership of your relay.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default RelayInfoSettings;
