import React, { useEffect, useState } from 'react';
import { Form, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import { InputField, InputNumberField } from './Settings.styles';

const { Option } = Select;

const OllamaSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('ollama');

  const [form] = Form.useForm();
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update form values when settings change, but only if user isn't actively editing
  useEffect(() => {
    if (settings && !isUserEditing) {
      console.log('OllamaSettings - Received settings:', settings);
      
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
      
      console.log('OllamaSettings - Transformed form values:', formValues);
      
      // Set form values with a slight delay to ensure the form is ready
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('OllamaSettings - Form values after set:', form.getFieldsValue());
      }, 100);
    }
  }, [settings, form, isUserEditing]);

  // Handle form value changes
  const handleValuesChange = (changedValues: Partial<SettingsGroupType<'ollama'>>) => {
    setIsUserEditing(true); // Mark that user is currently editing
    updateSettings(changedValues);
  };

  // Modified save function to reset the editing flag
  const handleSave = async () => {
    await saveSettings();
    setIsUserEditing(false); // Reset after saving
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

  return (
    <BaseSettingsForm
      title="Ollama Settings"
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
          <InputField placeholder="http://localhost:11434" />
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
            { required: true, message: 'Please enter a timeout value' },
            { type: 'number', min: 1, message: 'Value must be at least 1' }
          ]}
        >
          <InputNumberField min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default OllamaSettings;
