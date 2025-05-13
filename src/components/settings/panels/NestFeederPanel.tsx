import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Button, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const NestFeederPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings: saveNestFeederSettings,
  } = useGenericSettings('nest_feeder');

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
      console.log('NestFeederPanel - Received settings:', settings);
      
      // Transform property names to match form field names
      // The API returns properties without the prefix, but the form expects prefixed names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        nest_feeder_enabled: settingsObj.enabled,
        nest_feeder_url: settingsObj.url,
        nest_feeder_timeout: typeof settingsObj.timeout === 'string' 
          ? parseInt(settingsObj.timeout) 
          : settingsObj.timeout,
        nest_feeder_cache_size: typeof settingsObj.cache_size === 'string' 
          ? parseInt(settingsObj.cache_size) 
          : settingsObj.cache_size,
        nest_feeder_cache_ttl: typeof settingsObj.cache_ttl === 'string' 
          ? parseInt(settingsObj.cache_ttl) 
          : settingsObj.cache_ttl
      };
      
      console.log('NestFeederPanel - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('NestFeederPanel - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'nest_feeder'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('NestFeederPanel - changedValues:', changedValues);
    console.log('NestFeederPanel - current form values:', form.getFieldsValue());
    updateSettings(changedValues);
  };

  const handlePanelSave = async () => {
    try {
      await saveNestFeederSettings();
      setIsUserEditing(false);
      console.log('Nest Feeder settings saved successfully');
    } catch (error) {
      console.error('Error saving Nest Feeder settings:', error);
    }
  };

  return (
    <BaseSettingsPanel
      loading={loading}
      error={error}
      extra={
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={handlePanelSave}
          disabled={loading}
        >
          Save
        </Button>
      }
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
          name="nest_feeder_enabled"
          label={
            <span>
              Enable Nest Feeder&nbsp;
              <Tooltip title="Enable automatic Nest Feeder service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="nest_feeder_url"
          label={
            <span>
              Nest Feeder URL&nbsp;
              <Tooltip title="URL of the Nest Feeder service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the Nest Feeder URL' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}
        >
          <Input placeholder="https://nest-feeder.example.com" />
        </Form.Item>

        <Form.Item
          name="nest_feeder_timeout"
          label={
            <span>
              Timeout (seconds)&nbsp;
              <Tooltip title="Maximum time to wait for a response from the Nest Feeder service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber 
            min={1} 
            style={{ width: '100%' }}
            onFocus={() => setIsUserEditing(true)}
            onKeyDown={() => setIsUserEditing(true)}
          />
        </Form.Item>

        <Form.Item
          name="nest_feeder_cache_size"
          label={
            <span>
              Cache Size&nbsp;
              <Tooltip title="Maximum number of entries to store in the Nest Feeder cache">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 100, message: 'Value must be at least 100' }
          ]}
        >
          <InputNumber 
            min={100} 
            style={{ width: '100%' }}
            onFocus={() => setIsUserEditing(true)}
            onKeyDown={() => setIsUserEditing(true)}
          />
        </Form.Item>

        <Form.Item
          name="nest_feeder_cache_ttl"
          label={
            <span>
              Cache TTL (seconds)&nbsp;
              <Tooltip title="Time to live for cache entries in seconds">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber 
            min={1} 
            style={{ width: '100%' }}
            onFocus={() => setIsUserEditing(true)}
            onKeyDown={() => setIsUserEditing(true)}
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
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Nest Feeder service helps with content discovery and recommendation. The cache improves performance by storing frequently accessed data.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default NestFeederPanel;
