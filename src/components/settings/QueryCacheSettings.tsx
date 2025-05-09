import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Tooltip, Divider, InputNumber, Switch, Select } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import useGenericSettings from '@app/hooks/useGenericSettings';
import { SettingsGroupType } from '@app/types/settings.types';
import BaseSettingsForm from './BaseSettingsForm';
import styled from 'styled-components';

const KeyValueContainer = styled.div`
  margin-bottom: 16px;
`;

const QueryCacheSettings: React.FC = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings,
  } = useGenericSettings('query_cache');

  const [form] = Form.useForm();
  const [keyValuePairs, setKeyValuePairs] = useState<Array<{ key: string; value: any; type: string }>>([]);

  // Update form values when settings change
  useEffect(() => {
    if (settings) {
      // Convert settings object to array of key-value pairs
      const pairs = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        type: typeof value === 'boolean' ? 'boolean' : 
              typeof value === 'number' ? 'number' : 'string'
      }));
      setKeyValuePairs(pairs);
    }
  }, [settings]);

  // Handle form value changes
  const handleValuesChange = () => {
    // Convert key-value pairs to settings object
    const newSettings = keyValuePairs.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key.trim()] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    updateSettings(newSettings);
  };

  // Add a new key-value pair
  const handleAddPair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '', type: 'string' }]);
  };

  // Remove a key-value pair
  const handleRemovePair = (index: number) => {
    const newPairs = [...keyValuePairs];
    newPairs.splice(index, 1);
    setKeyValuePairs(newPairs);
    handleValuesChange();
  };

  // Update a key-value pair
  const handlePairChange = (index: number, field: 'key' | 'value' | 'type', value: string | number | boolean | null) => {
    const newPairs = [...keyValuePairs];
    
    if (field === 'type') {
      // Convert the value to the new type
      let convertedValue;
      switch (value) {
        case 'boolean':
          convertedValue = Boolean(newPairs[index].value);
          break;
        case 'number':
          convertedValue = Number(newPairs[index].value) || 0;
          break;
        case 'string':
          convertedValue = String(newPairs[index].value);
          break;
        default:
          convertedValue = newPairs[index].value;
      }
      newPairs[index].value = convertedValue;
    }
    
    newPairs[index][field] = value;
    setKeyValuePairs(newPairs);
    handleValuesChange();
  };

  // Render the value input based on the type
  const renderValueInput = (pair: { key: string; value: any; type: string }, index: number) => {
    switch (pair.type) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(pair.value)}
            onChange={(checked) => handlePairChange(index, 'value', checked)}
          />
        );
      case 'number':
        return (
          <InputNumber
            value={Number(pair.value)}
            onChange={(value) => handlePairChange(index, 'value', value ?? 0)}
            style={{ width: '100%' }}
          />
        );
      default:
        return (
          <Input
            value={String(pair.value)}
            onChange={(e) => handlePairChange(index, 'value', e.target.value)}
            placeholder="Value"
          />
        );
    }
  };

  return (
    <BaseSettingsForm
      title="Query Cache Settings"
      loading={loading}
      error={error}
      onSave={saveSettings}
      onReset={fetchSettings}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label={
            <span>
              Cache Configuration&nbsp;
              <Tooltip title="Configure key-value pairs for the query cache">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <p>
            Add custom configuration parameters for the query cache. These settings control how the relay caches query results.
          </p>
          
          <Divider />
          
          {keyValuePairs.map((pair, index) => (
            <KeyValueContainer key={index}>
              <Space style={{ width: '100%' }} align="baseline">
                <Form.Item
                  style={{ marginBottom: 0, width: '30%' }}
                >
                  <Input
                    value={pair.key}
                    onChange={(e) => handlePairChange(index, 'key', e.target.value)}
                    placeholder="Key"
                  />
                </Form.Item>
                
                <Form.Item
                  style={{ marginBottom: 0, width: '30%' }}
                >
                  {renderValueInput(pair, index)}
                </Form.Item>
                
                <Form.Item
                  style={{ marginBottom: 0, width: '20%' }}
                >
                  <Select
                    value={pair.type}
                    onChange={(value) => handlePairChange(index, 'type', value)}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="string">String</Select.Option>
                    <Select.Option value="number">Number</Select.Option>
                    <Select.Option value="boolean">Boolean</Select.Option>
                  </Select>
                </Form.Item>
                
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemovePair(index)}
                />
              </Space>
            </KeyValueContainer>
          ))}
          
          <Button
            type="dashed"
            onClick={handleAddPair}
            style={{ width: '100%' }}
            icon={<PlusOutlined />}
          >
            Add Parameter
          </Button>
        </Form.Item>

        <Form.Item>
          <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            Note: These settings affect how the relay caches query results. Improper configuration may impact performance.
            Consult the documentation for recommended values.
          </p>
        </Form.Item>
      </Form>
    </BaseSettingsForm>
  );
};

export default QueryCacheSettings;
