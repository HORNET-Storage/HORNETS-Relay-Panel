import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Switch, Tooltip, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const QueryCachePanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings: saveQueryCacheSettings,
  } = useGenericSettings('query_cache');

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
      console.log('QueryCachePanel - Received settings:', settings);

      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(settings);
        console.log('QueryCachePanel - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'query_cache'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('QueryCachePanel - changedValues:', changedValues);
    console.log('QueryCachePanel - current form values:', form.getFieldsValue());
    updateSettings(changedValues);
  };

  const handlePanelSave = async () => {
    try {
      await saveQueryCacheSettings();
      setIsUserEditing(false);
      console.log('Query Cache settings saved successfully');
    } catch (error) {
      console.error('Error saving Query Cache settings:', error);
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
          name="cache_enabled"
          label={
            <span>
              Enable Query Cache&nbsp;
              <Tooltip title="Enable caching for queries to improve performance">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="max_cache_size"
          label={
            <span>
              Max Cache Size&nbsp;
              <Tooltip title="Maximum number of entries in the query cache">
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
            max={100000} 
            style={{ width: '100%' }} 
            onFocus={() => setIsUserEditing(true)}
            onKeyDown={() => setIsUserEditing(true)}
          />
        </Form.Item>

        <Form.Item
          name="cache_ttl"
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

        <Form.Item
          name="cleanup_interval"
          label={
            <span>
              Cleanup Interval (seconds)&nbsp;
              <Tooltip title="Interval between cache cleanup operations">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 10, message: 'Value must be at least 10' }
          ]}
        >
          <InputNumber 
            min={10} 
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
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Query caching improves performance by storing query results temporarily. The cache is automatically cleared according to the cleanup interval and TTL settings.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default QueryCachePanel;
