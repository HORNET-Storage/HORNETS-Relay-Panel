import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Tooltip, Button, Space, Divider, Collapse } from 'antd';
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
import { SettingsGroupType, XNostrNitterInstance, XNostrNitterSettings, XNostrIntervalSettings } from '@app/types/settings.types';
import type { XNostrSettings as XNostrSettingsType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import styled from 'styled-components';

const { Panel } = Collapse;

const NitterInstanceContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
`;

const XNostrSettingsComponent: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings: updateSettingsGeneric,
    saveSettings,
  } = useGenericSettings('xnostr');
  
  // Create a typed wrapper for updateSettings
  const updateSettings = (updatedSettings: Partial<SettingsGroupType<'xnostr'>>) => {
    updateSettingsGeneric(updatedSettings);
  };

  const [form] = Form.useForm();
  const [nitterInstances, setNitterInstances] = useState<XNostrNitterInstance[]>([]);
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('XNostrSettings - Received settings:', settings);
      
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
        // Handle nested objects
        xnostr_verification_intervals: settingsObj.verification_intervals || {},
        // Don't set nitter instances here, we'll handle them separately
      };
      
      console.log('XNostrSettings - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('XNostrSettings - Form values after set:', form.getFieldsValue());
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
  const handleValuesChange = (changedValues: Record<string, any>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    
    // Don't use updateSettings directly with form values
    // Instead, update the form values and let the form handle the state
    
    // We'll handle specific nested object updates in the other functions
    // This function is just for the form's onValuesChange callback
    
    // For simple fields, we can update them directly
    const simpleChanges: Partial<XNostrSettingsType> = {};
    
    // Only include simple fields (not nested objects)
    if ('xnostr_enabled' in changedValues) {
      simpleChanges.xnostr_enabled = changedValues.xnostr_enabled;
    }
    if ('xnostr_browser_path' in changedValues) {
      simpleChanges.xnostr_browser_path = changedValues.xnostr_browser_path;
    }
    if ('xnostr_browser_pool_size' in changedValues) {
      simpleChanges.xnostr_browser_pool_size = changedValues.xnostr_browser_pool_size;
    }
    if ('xnostr_check_interval' in changedValues) {
      simpleChanges.xnostr_check_interval = changedValues.xnostr_check_interval;
    }
    if ('xnostr_concurrency' in changedValues) {
      simpleChanges.xnostr_concurrency = changedValues.xnostr_concurrency;
    }
    if ('xnostr_temp_dir' in changedValues) {
      simpleChanges.xnostr_temp_dir = changedValues.xnostr_temp_dir;
    }
    if ('xnostr_update_interval' in changedValues) {
      simpleChanges.xnostr_update_interval = changedValues.xnostr_update_interval;
    }
    
    // Only update if we have changes
    if (Object.keys(simpleChanges).length > 0) {
      updateSettings(simpleChanges);
    }
  };

  // Add a new nitter instance
  const handleAddNitterInstance = () => {
    setIsUserEditing(true); // Mark that user is currently editing
    
    const newInstance: XNostrNitterInstance = {
      priority: nitterInstances.length + 1,
      url: ''
    };
    
    const newInstances = [...nitterInstances, newInstance];
    setNitterInstances(newInstances);
    
    // Update settings with new instances
    const updatedSettings = { ...settings };
    if (!updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter = {
        failure_threshold: 3,
        recovery_threshold: 2,
        requests_per_minute: 10,
        instances: []
      };
    }
    updatedSettings.xnostr_nitter.instances = newInstances;
    updateSettings(updatedSettings);
  };

  // Remove a nitter instance
  const handleRemoveNitterInstance = (index: number) => {
    setIsUserEditing(true); // Mark that user is currently editing
    
    const newInstances = [...nitterInstances];
    newInstances.splice(index, 1);
    
    // Update priorities
    newInstances.forEach((instance, idx) => {
      instance.priority = idx + 1;
    });
    
    setNitterInstances(newInstances);
    
    // Update settings with new instances
    const updatedSettings = { ...settings };
    if (updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter.instances = newInstances;
      updateSettings(updatedSettings);
    }
  };

  // Update a nitter instance
  const handleUpdateNitterInstance = (index: number, field: keyof XNostrNitterInstance, value: number | string | null) => {
    setIsUserEditing(true); // Mark that user is currently editing
    
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
    
    // Update settings with new instances
    const updatedSettings = { ...settings };
    if (updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter.instances = newInstances;
      updateSettings(updatedSettings);
    }
  };

  // Update nitter settings
  const handleNitterSettingsChange = (field: keyof XNostrNitterSettings, value: number | null) => {
    setIsUserEditing(true); // Mark that user is currently editing
    
    // Handle null values from InputNumber
    if (value === null) {
      value = 0; // Default to 0 for null number values
    }
    const updatedSettings = { ...settings };
    if (!updatedSettings.xnostr_nitter) {
      updatedSettings.xnostr_nitter = {
        failure_threshold: 3,
        recovery_threshold: 2,
        requests_per_minute: 10,
        instances: nitterInstances
      };
    }
    
    updatedSettings.xnostr_nitter = {
      ...updatedSettings.xnostr_nitter,
      [field]: value
    };
    updateSettings(updatedSettings);
  };

  // Update verification interval settings
  const handleIntervalSettingsChange = (field: keyof XNostrIntervalSettings, value: number | null) => {
    setIsUserEditing(true); // Mark that user is currently editing
    
    // Handle null values from InputNumber
    if (value === null) {
      value = 0; // Default to 0 for null number values
    }
    const updatedSettings = { ...settings };
    if (!updatedSettings.xnostr_verification_intervals) {
      updatedSettings.xnostr_verification_intervals = {
        follower_update_interval_days: 7,
        full_verification_interval_days: 30,
        max_verification_attempts: 5
      };
    }
    
    updatedSettings.xnostr_verification_intervals = {
      ...updatedSettings.xnostr_verification_intervals,
      [field]: value
    };
    updateSettings(updatedSettings);
  };

  // Modified save function to reset the editing flag
  const handleSave = async () => {
    await saveSettings();
    setIsUserEditing(false); // Reset after saving
  };

  return (
    <BaseSettingsForm
      title="XNostr Settings"
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
          label={
            <span>
              Failure Threshold&nbsp;
              <Tooltip title="Number of failures before a Nitter instance is considered down">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <InputNumber
            value={settings?.xnostr_nitter?.failure_threshold || 3}
            onChange={(value) => handleNitterSettingsChange('failure_threshold', value)}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Recovery Threshold&nbsp;
              <Tooltip title="Number of successful requests before a Nitter instance is considered recovered">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <InputNumber
            value={settings?.xnostr_nitter?.recovery_threshold || 2}
            onChange={(value) => handleNitterSettingsChange('recovery_threshold', value)}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Requests Per Minute&nbsp;
              <Tooltip title="Maximum number of requests per minute to a Nitter instance">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <InputNumber
            value={settings?.xnostr_nitter?.requests_per_minute || 10}
            onChange={(value) => handleNitterSettingsChange('requests_per_minute', value)}
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
          label={
            <span>
              Follower Update Interval (days)&nbsp;
              <Tooltip title="Number of days between follower updates">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <InputNumber
            value={settings?.xnostr_verification_intervals?.follower_update_interval_days || 7}
            onChange={(value) => handleIntervalSettingsChange('follower_update_interval_days', value)}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Full Verification Interval (days)&nbsp;
              <Tooltip title="Number of days between full verifications">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <InputNumber
            value={settings?.xnostr_verification_intervals?.full_verification_interval_days || 30}
            onChange={(value) => handleIntervalSettingsChange('full_verification_interval_days', value)}
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              Max Verification Attempts&nbsp;
              <Tooltip title="Maximum number of verification attempts before giving up">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <InputNumber
            value={settings?.xnostr_verification_intervals?.max_verification_attempts || 5}
            onChange={(value) => handleIntervalSettingsChange('max_verification_attempts', value)}
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
    </BaseSettingsForm>
  );
};

// Export the component as a named export and as the default export
export { XNostrSettingsComponent as XNostrSettings };
export default XNostrSettingsComponent;
