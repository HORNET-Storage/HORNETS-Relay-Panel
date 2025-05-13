import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Tooltip, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsPanel from '../BaseSettingsPanel';

const { Option } = Select;

const OllamaPanel: React.FC = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    saveSettings: saveOllamaSettings,
  } = useGenericSettings('ollama');

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
      console.log('OllamaPanel - Received settings:', settings);
      
      // Transform property names to match form field names
      // The API returns properties without the prefix, but the form expects prefixed names
      const settingsObj = settings as Record<string, any>;
      
      const formValues = {
        ollama_url: settingsObj.url,
        ollama_model: settingsObj.model,
        ollama_timeout: typeof settingsObj.timeout === 'string' 
          ? parseInt(settingsObj.timeout) 
          : settingsObj.timeout
      };
      
      console.log('OllamaPanel - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('OllamaPanel - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'ollama'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    console.log('OllamaPanel - changedValues:', changedValues);
    console.log('OllamaPanel - current form values:', form.getFieldsValue());
    updateSettings(changedValues);
  };

  // Common Ollama models
  const modelOptions = [
    { value: 'llama2', label: 'Llama 2' },
    { value: 'llama2:13b', label: 'Llama 2 (13B)' },
    { value: 'llama2:70b', label: 'Llama 2 (70B)' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'mistral:7b', label: 'Mistral (7B)' },
    { value: 'mixtral', label: 'Mixtral' },
    { value: 'mixtral:8x7b', label: 'Mixtral (8x7B)' },
    { value: 'phi', label: 'Phi' },
    { value: 'phi:2', label: 'Phi 2' },
    { value: 'gemma', label: 'Gemma' },
    { value: 'gemma:7b', label: 'Gemma (7B)' },
    { value: 'vicuna', label: 'Vicuna' },
    { value: 'vicuna:13b', label: 'Vicuna (13B)' },
    { value: 'orca-mini', label: 'Orca Mini' },
  ];

  const handlePanelSave = async () => {
    try {
      await saveOllamaSettings();
      setIsUserEditing(false);
      console.log('Ollama settings saved successfully');
    } catch (error) {
      console.error('Error saving Ollama settings:', error);
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
          name="ollama_url"
          label={
            <span>
              Ollama API URL&nbsp;
              <Tooltip title="URL of the Ollama API service">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please enter the Ollama API URL' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}
        >
          <Input placeholder="http://localhost:11434" />
        </Form.Item>

        <Form.Item
          name="ollama_model"
          label={
            <span>
              Ollama Model&nbsp;
              <Tooltip title="The model to use for Ollama requests">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            { required: true, message: 'Please select an Ollama model' }
          ]}
        >
          <Select
            placeholder="Select a model"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label?.toString() || '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {modelOptions.map(option => (
              <Option key={option.value} value={option.value} label={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ollama_timeout"
          label={
            <span>
              Timeout (seconds)&nbsp;
              <Tooltip title="Maximum time to wait for a response from the Ollama service">
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
            <span style={{ color: 'rgba(82, 196, 255, 1)' }}>Note:</span> Ollama provides AI model inference capabilities for the relay. Choose a model based on your performance needs and available resources.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsPanel>
  );
};

export default OllamaPanel;
