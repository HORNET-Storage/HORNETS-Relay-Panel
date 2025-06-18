import React, { useState } from 'react';
import { Button, Input, Table, Space, Modal, Form, InputNumber, Popconfirm, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AllowedUsersSettings, AllowedUsersMode, AllowedUsersTier } from '@app/types/allowedUsers.types';
import * as S from './TiersConfig.styles';

interface TiersConfigProps {
  settings: AllowedUsersSettings;
  mode: AllowedUsersMode;
  onSettingsChange: (settings: AllowedUsersSettings) => void;
  disabled?: boolean;
}

interface TierFormData {
  data_limit: string;
  price: string;
}

export const TiersConfig: React.FC<TiersConfigProps> = ({
  settings,
  mode,
  onSettingsChange,
  disabled = false
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm<TierFormData>();

  const isPaidMode = mode === 'paid';
  const isFreeMode = mode === 'free';

  const handleAddTier = () => {
    setEditingIndex(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTier = (index: number) => {
    setEditingIndex(index);
    const tier = settings.tiers[index];
    form.setFieldsValue({
      data_limit: tier.data_limit,
      price: tier.price
    });
    setIsModalVisible(true);
  };

  const handleDeleteTier = (index: number) => {
    const newTiers = settings.tiers.filter((_, i) => i !== index);
    const updatedSettings = {
      ...settings,
      tiers: newTiers
    };
    onSettingsChange(updatedSettings);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate price for paid mode
      if (isPaidMode && values.price === '0') {
        form.setFields([{
          name: 'price',
          errors: ['Paid mode cannot have free tiers']
        }]);
        return;
      }

      // Force price to "0" only for free mode, ensure it's always a string
      const tierPrice = isFreeMode ? '0' : String(values.price || '0');

      const newTier: AllowedUsersTier = {
        data_limit: values.data_limit,
        price: tierPrice
      };

      let newTiers: AllowedUsersTier[];
      if (editingIndex !== null) {
        newTiers = [...settings.tiers];
        newTiers[editingIndex] = newTier;
      } else {
        newTiers = [...settings.tiers, newTier];
      }

      const updatedSettings = {
        ...settings,
        tiers: newTiers
      };

      onSettingsChange(updatedSettings);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Form validation failed
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingIndex(null);
  };

  const columns = [
    {
      title: 'Data Limit',
      dataIndex: 'data_limit',
      key: 'data_limit',
      render: (text: string) => <S.DataLimit>{text}</S.DataLimit>
    },
    {
      title: 'Price (sats)',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => (
        <S.Price $isFree={price === '0'}>
          {price === '0' ? 'Free' : `${price} sats`}
        </S.Price>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTier(index)}
            disabled={disabled}
          />
          <Popconfirm
            title="Are you sure you want to delete this tier?"
            onConfirm={() => handleDeleteTier(index)}
            disabled={disabled}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={disabled}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <S.Container>
      {isPaidMode && (
        <Alert
          message="Paid Mode Active"
          description="All tiers must have a price greater than 0. Free tiers are not allowed in paid mode."
          type="warning"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#ffffff !important',
            border: '1px solid #ffd666 !important',
            color: '#1f1f1f !important'
          }}
        />
      )}
      
      {isFreeMode && (
        <Alert
          message="Free Mode Active"
          description="All tiers are automatically set to free (price = 0) regardless of input."
          type="success"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#ffffff !important',
            border: '1px solid #52c41a !important',
            color: '#1f1f1f !important'
          }}
        />
      )}
      
      {mode === 'exclusive' && (
        <Alert
          message="Exclusive Mode Active"
          description="Tiers can have any price. Users must be manually added to access lists."
          type="info"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#ffffff !important',
            border: '1px solid #1890ff !important',
            color: '#1f1f1f !important'
          }}
        />
      )}

      <S.TiersHeader>
        <S.TiersTitle>Subscription Tiers</S.TiersTitle>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddTier}
          disabled={disabled}
        >
          Add Tier
        </Button>
      </S.TiersHeader>

      <Table
        columns={columns}
        dataSource={settings.tiers.map((tier, index) => ({ ...tier, key: index }))}
        pagination={false}
        size="small"
        locale={{ emptyText: 'No tiers configured' }}
      />

      <Modal
        title={editingIndex !== null ? 'Edit Tier' : 'Add New Tier'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ price: '0' }}
        >
          <Form.Item
            name="data_limit"
            label="Data Limit"
            rules={[
              { required: true, message: 'Please enter data limit' },
              { 
                pattern: /^\d+\s*(MB|GB|TB)\s*per\s*(day|week|month|year)$/i,
                message: 'Format: "1 GB per month"'
              }
            ]}
          >
            <Input placeholder="e.g., 1 GB per month" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (sats)"
            rules={[
              { required: true, message: 'Please enter price' },
              { 
                validator: (_, value) => {
                  if (isPaidMode && value === '0') {
                    return Promise.reject('Paid mode cannot have free tiers');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="0 for free, or amount in sats"
              disabled={isFreeMode}
              value={isFreeMode ? 0 : undefined}
            />
          </Form.Item>

          {isPaidMode && (
            <Alert
              message="Note: Free tiers (price = 0) are not allowed in paid mode"
              type="warning"
              showIcon
            />
          )}
          
          {isFreeMode && (
            <Alert
              message="Note: Price will be automatically set to 0 (free) in free mode"
              type="success"
              showIcon
              style={{
                backgroundColor: '#ffffff !important',
                border: '1px solid #52c41a !important',
                color: '#1f1f1f !important'
              }}
            />
          )}
        </Form>
      </Modal>
    </S.Container>
  );
};