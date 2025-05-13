import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Button, Space, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { 
  QuestionCircleOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  TwitterOutlined,
  FolderOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType, XNostrNitterInstance } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';
import styled from 'styled-components';

const NitterInstanceContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const XNostrPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings: saveXNostrSettings,
  } = useGenericSettings('xnostr');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [nitterInstances, setNitterInstances] = useState<XNostrNitterInstance[]>([]);
  
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
      console.log('XNostrPanel - Received settings:', settings);
      
      // Transform property names to match form field names
      // The API returns properties without the prefix, but the form expects prefixed names
      const settingsObj = settings as Record<string, any>;
      
      // Create a transformed settings object with prefixed property names
      const formValues = {
        xnostr_enabled: settingsObj.enabled,
        xnostr_browser_path: settingsObj.browser_path,
        xnostr_browser_pool_size: typeof settingsObj.browser_pool_size === 'string' 
          ? parseInt(settingsObj.browser_pool_size) 
          : settingsObj.browser_pool_size,
        xnostr_check_interval: typeof settingsObj.check_interval === 'string' 
          ? parseInt(settingsObj.check_interval) 
          : settingsObj.check_interval,
        xnostr_concurrency: typeof settingsObj.concurrency === 'string' 
          ? parseInt(settingsObj.concurrency) 
          : settingsObj.concurrency,
        xnostr_temp_dir: settingsObj.temp_dir,
        xnostr_update_interval: typeof settingsObj.update_interval === 'string' 
          ? parseInt(settingsObj.update_interval) 
          : settingsObj.update_interval,
        // Handle nested objects - verification intervals
        xnostr_verification_intervals_follower_update_interval_days: 
          settingsObj.verification_intervals?.follower_update_interval_days || 7,
        xnostr_verification_intervals_full_verification_interval_days: 
          settingsObj.verification_intervals?.full_verification_interval_days || 30,
        xnostr_verification_intervals_max_verification_attempts: 
          settingsObj.verification_intervals?.max_verification_attempts || 5,
        // Handle nested objects - nitter settings
        xnostr_nitter_failure_threshold: 
          settingsObj.nitter?.failure_threshold || 3,
        xnostr_nitter_recovery_threshold: 
          settingsObj.nitter?.recovery_threshold || 2,
        xnostr_nitter_requests_per_minute: 
          settingsObj.nitter?.requests_per_minute || 10,
      };
      
      console.log('XNostrPanel - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('XNostrPanel - Form values after set:', form.getFieldsValue());
      }, 100);

      // Set nitter instances
      if (settingsObj.nitter?.instances) {
        setNitterInstances(settingsObj.nitter.instances);
      } else {
        setNitterInstances([]);
      }
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<Record<string, any>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('XNostrPanel - changedValues:', changedValues);
    console.log('XNostrPanel - current form values:', form.getFieldsValue());

    // Create a partial settings object from the changed values
    const updatedSettings: Partial<SettingsGroupType<'xnostr'>> = {};
    
    // Handle simple fields
    if ('xnostr_enabled' in changedValues) {
      updatedSettings.xnostr_enabled = changedValues.xnostr_enabled;
    }
    if ('xnostr_browser_path' in changedValues) {
      updatedSettings.xnostr_browser_path = changedValues.xnostr_browser_path;
    }
    if ('xnostr_browser_pool_size' in changedValues) {
      updatedSettings.xnostr_browser_pool_size = changedValues.xnostr_browser_pool_size;
    }
    if ('xnostr_check_interval' in changedValues) {
      updatedSettings.xnostr_check_interval = changedValues.xnostr_check_interval;
    }
    if ('xnostr_concurrency' in changedValues) {
      updatedSettings.xnostr_concurrency = changedValues.xnostr_concurrency;
    }
    if ('xnostr_temp_dir' in changedValues) {
      updatedSettings.xnostr_temp_dir = changedValues.xnostr_temp_dir;
    }
    if ('xnostr_update_interval' in changedValues) {
      updatedSettings.xnostr_update_interval = changedValues.xnostr_update_interval;
    }

    // Handle nested verification intervals object
    if (
      'xnostr_verification_intervals_follower_update_interval_days' in changedValues ||
      'xnostr_verification_intervals_full_verification_interval_days' in changedValues ||
      'xnostr_verification_intervals_max_verification_attempts' in changedValues
    ) {
      // Get current form values for verification intervals
      const formValues = form.getFieldsValue();
      updatedSettings.xnostr_verification_intervals = {
        follower_update_interval_days: formValues.xnostr_verification_intervals_follower_update_interval_days,
        full_verification_interval_days: formValues.xnostr_verification_intervals_full_verification_interval_days,
        max_verification_attempts: formValues.xnostr_verification_intervals_max_verification_attempts
      };
    }

    // Handle nested nitter settings object
    if (
      'xnostr_nitter_failure_threshold' in changedValues ||
      'xnostr_nitter_recovery_threshold' in changedValues ||
      'xnostr_nitter_requests_per_minute' in changedValues
    ) {
      // Get current form values for nitter settings
      const formValues = form.getFieldsValue();
      
      // We need to preserve the current instances when updating other nitter settings
      const currentInstances = settings?.xnostr_nitter?.instances || nitterInstances;
      
      updatedSettings.xnostr_nitter = {
        failure_threshold: formValues.xnostr_nitter_failure_threshold,
        recovery_threshold: formValues.xnostr_nitter_recovery_threshold,
        requests_per_minute: formValues.xnostr_nitter_requests_per_minute,
        instances: currentInstances
      };
    }
    
    // Only update if we have changes
    if (Object.keys(updatedSettings).length > 0) {
      updateSettings(updatedSettings);
    }
  };

  // Add a new nitter instance
  const handleAddNitterInstance = () => {
    const newInstance: XNostrNitterInstance = {
      priority: nitterInstances.length + 1,
      url: ''
    };
    
    const newInstances = [...nitterInstances, newInstance];
    setNitterInstances(newInstances);
    setIsUserEditing(true);
    
    // Update settings with new instances
    const updatedSettings: Partial<SettingsGroupType<'xnostr'>> = settings ? { ...settings } : {};
    // Initialize xnostr_nitter if needed
    if (!updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter = {
        failure_threshold: form.getFieldValue('xnostr_nitter_failure_threshold') || 3,
        recovery_threshold: form.getFieldValue('xnostr_nitter_recovery_threshold') || 2,
        requests_per_minute: form.getFieldValue('xnostr_nitter_requests_per_minute') || 10,
        instances: []
      };
    }
    // Ensure xnostr_nitter is defined before setting instances
    if (updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter.instances = newInstances;
    }
    updateSettings(updatedSettings);
  };

  // Remove a nitter instance
  const handleRemoveNitterInstance = (index: number) => {
    const newInstances = [...nitterInstances];
    newInstances.splice(index, 1);
    
    // Update priorities
    newInstances.forEach((instance, idx) => {
      instance.priority = idx + 1;
    });
    
    setNitterInstances(newInstances);
    setIsUserEditing(true);
    
    // Update settings with new instances
    const updatedSettings: Partial<SettingsGroupType<'xnostr'>> = settings ? { ...settings } : {};
    if (updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter.instances = newInstances;
      updateSettings(updatedSettings);
    }
  };

  // Update a nitter instance
  const handleUpdateNitterInstance = (index: number, field: keyof XNostrNitterInstance, value: number | string | null) => {
    const newInstances = [...nitterInstances];
    
    // Handle null values from InputNumber
    if (value === null && field === 'priority') {
      value = 0; // Default to 0 for null number values
    }
    
    // Use a more specific type assertion based on the field
    if (field === 'priority') {
      newInstances[index].priority = value as number;
    } else if (field === 'url') {
      newInstances[index].url = value as string;
    }
    
    setNitterInstances(newInstances);
    setIsUserEditing(true);
    
    // Update settings with new instances
    const updatedSettings: Partial<SettingsGroupType<'xnostr'>> = settings ? { ...settings } : {};
    if (updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter.instances = newInstances;
      updateSettings(updatedSettings);
    }
  };

  const handlePanelSave = async () => {
    try {
      await saveXNostrSettings();
      setIsUserEditing(false);
      console.log('XNostr settings saved successfully');
    } catch (error) {
      console.error('Error saving XNostr settings:', error);
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
        {/* General XNostr Settings */}
        <Form.Item
          name="xnostr_enabled"
          label={
            <span>
              Enable XNostr&nbsp;
              <Tooltip title="Enable XNostr Twitter verification">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="xnostr_browser_path"
          label={
            <span>
              Browser Path&nbsp;
              <Tooltip title="Path to the browser executable for XNostr verification">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input 
            prefix={<FolderOutlined />}
            placeholder="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" 
          />
        </Form.Item>

        <Form.Item
          name="xnostr_browser_pool_size"
          label={
            <span>
              Browser Pool Size&nbsp;
              <Tooltip title="Number of browser instances to keep in the pool">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="xnostr_temp_dir"
          label={
            <span>
              Temporary Directory&nbsp;
              <Tooltip title="Directory to store temporary files for XNostr verification">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input 
            prefix={<FolderOutlined />}
            placeholder="/tmp/xnostr-verification" 
          />
        </Form.Item>

        <Form.Item
          name="xnostr_check_interval"
          label={
            <span>
              Check Interval (seconds)&nbsp;
              <Tooltip title="Interval between verification checks">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber 
            prefix={<ClockCircleOutlined />}
            min={1} 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="xnostr_concurrency"
          label={
            <span>
              Concurrency&nbsp;
              <Tooltip title="Number of concurrent verification processes">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber 
            prefix={<TeamOutlined />}
            min={1} 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="xnostr_update_interval"
          label={
            <span>
              Update Interval (hours)&nbsp;
              <Tooltip title="Interval between updates in hours">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumber 
            prefix={<ClockCircleOutlined />}
            min={1} 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Divider orientation="left">Nitter Settings</Divider>

        {/* Nitter Settings */}
        <Form.Item
          name="xnostr_nitter_failure_threshold"
          label={
            <span>
              Failure Threshold&nbsp;
              <Tooltip title="Number of failures before a Nitter instance is considered down">
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
          />
        </Form.Item>

        <Form.Item
          name="xnostr_nitter_recovery_threshold"
          label={
            <span>
              Recovery Threshold&nbsp;
              <Tooltip title="Number of successful requests before a Nitter instance is considered recovered">
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
          />
        </Form.Item>

        <Form.Item
          name="xnostr_nitter_requests_per_minute"
          label={
            <span>
              Requests Per Minute&nbsp;
              <Tooltip title="Maximum number of requests per minute to a Nitter instance">
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
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Nitter Instances&nbsp;
              <Tooltip title="List of Nitter instances to use for Twitter verification">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          {nitterInstances.map((instance, index) => (
            <NitterInstanceContainer key={index}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="Priority"
                  style={{ marginBottom: 8 }}
                >
                  <InputNumber
                    value={instance.priority}
                    onChange={(value) => handleUpdateNitterInstance(index, 'priority', value)}
                    min={1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                
                <Form.Item
                  label="URL"
                  style={{ marginBottom: 8 }}
                >
                  <Input
                    value={instance.url}
                    onChange={(e) => handleUpdateNitterInstance(index, 'url', e.target.value)}
                    placeholder="https://nitter.net/"
                    prefix={<TwitterOutlined />}
                  />
                </Form.Item>
                
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveNitterInstance(index)}
                >
                  Remove Instance
                </Button>
              </Space>
            </NitterInstanceContainer>
          ))}
          
          <Button
            type="dashed"
            onClick={handleAddNitterInstance}
            style={{ width: '100%' }}
            icon={<PlusOutlined />}
          >
            Add Nitter Instance
          </Button>
        </Form.Item>

        <Divider orientation="left">Verification Intervals</Divider>

        {/* Verification Interval Settings */}
        <Form.Item
          name="xnostr_verification_intervals_follower_update_interval_days"
          label={
            <span>
              Follower Update Interval (days)&nbsp;
              <Tooltip title="Number of days between follower updates">
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
          />
        </Form.Item>

        <Form.Item
          name="xnostr_verification_intervals_full_verification_interval_days"
          label={
            <span>
              Full Verification Interval (days)&nbsp;
              <Tooltip title="Number of days between full verifications">
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
          />
        </Form.Item>

        <Form.Item
          name="xnostr_verification_intervals_max_verification_attempts"
          label={
            <span>
              Max Verification Attempts&nbsp;
              <Tooltip title="Maximum number of verification attempts before giving up">
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
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> XNostr is used for Twitter verification of Nostr profiles. It requires a browser to be installed and accessible.
            The Nitter instances are used to scrape Twitter profiles when the Twitter API is not available.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default XNostrPanel;
