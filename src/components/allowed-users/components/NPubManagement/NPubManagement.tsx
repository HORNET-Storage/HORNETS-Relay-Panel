import React, { useState } from 'react';
import { Button, Input, Table, Space, Modal, Form, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAllowedUsersList, useAllowedUsersValidation } from '@app/hooks/useAllowedUsers';
import { AllowedUsersSettings, AllowedUsersMode, AllowedUser } from '@app/types/allowedUsers.types';
import * as S from './NPubManagement.styles';

interface NPubManagementProps {
  settings: AllowedUsersSettings;
  mode: AllowedUsersMode;
}

interface AddUserFormData {
  npub: string;
  tier: string;
}

export const NPubManagement: React.FC<NPubManagementProps> = ({
  settings,
  mode
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AllowedUser | null>(null);
  const [addForm] = Form.useForm<AddUserFormData>();
  const [editForm] = Form.useForm<AddUserFormData>();

  const { users, loading, addUser, removeUser, pagination } = useAllowedUsersList();
  const { validateNpub } = useAllowedUsersValidation();

  const tierOptions = settings.tiers.map(tier => {
    const displayFormat = tier.unlimited 
      ? 'unlimited' 
      : `${(tier.monthly_limit_bytes / 1073741824).toFixed(tier.monthly_limit_bytes % 1073741824 === 0 ? 0 : 1)} GB per month`;
    
    return {
      label: `${tier.name} - ${displayFormat} (${tier.price_sats === 0 ? 'Free' : `${tier.price_sats} sats`})`,
      value: tier.name
    };
  });

  const handleAddUser = async () => {
    try {
      const values = await addForm.validateFields();
      await addUser(values.npub, values.tier);
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      // Form validation failed or API error
    }
  };

  const handleEditUser = (user: AllowedUser) => {
    setEditingUser(user);
    setIsEditModalVisible(true);
    // Set form values after modal is visible
    setTimeout(() => {
      editForm.setFieldsValue({
        npub: user.npub,
        tier: user.tier
      });
    }, 0);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingUser) return;
      
      // Remove the old user and add with new tier
      await removeUser(editingUser.npub);
      await addUser(values.npub, values.tier);
      
      setIsEditModalVisible(false);
      setEditingUser(null);
      editForm.resetFields();
    } catch (error) {
      console.error('Edit user error:', error);
      message.error('Failed to update user');
    }
  };

  const handleRemoveUser = async (npub: string) => {
    try {
      await removeUser(npub);
    } catch (error) {
      message.error('Failed to remove user');
    }
  };

  const columns = [
    {
      title: 'NPUB',
      dataIndex: 'npub',
      key: 'npub',
      render: (npub: string) => (
        <S.NpubText>{npub.slice(0, 16)}...{npub.slice(-8)}</S.NpubText>
      )
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => <S.TierTag>{tier}</S.TierTag>
    },
    {
      title: 'Added By',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy: string) => createdBy || 'admin'
    },
    {
      title: 'Date Added',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AllowedUser) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
            title="Edit user"
          />
          <Popconfirm
            title="Are you sure you want to remove this user?"
            onConfirm={() => handleRemoveUser(record.npub)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              title="Remove user"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <S.Container>
      <S.TabHeader>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Add User
          </Button>
        </Space>
      </S.TabHeader>
      
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total_items,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} users`
        }}
        rowKey="npub"
      />

      {/* Add User Modal */}
      <Modal
        title="Add User"
        open={isAddModalVisible}
        onOk={handleAddUser}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="npub"
            label="NPUB"
            rules={[
              { required: true, message: 'Please enter NPUB' },
              { validator: (_, value) => {
                const error = validateNpub(value);
                return error ? Promise.reject(error) : Promise.resolve();
              }}
            ]}
          >
            <Input placeholder="npub1..." />
          </Form.Item>

          <Form.Item
            name="tier"
            label="Tier"
            rules={[{ required: true, message: 'Please select a tier' }]}
          >
            <Select placeholder="Select tier" options={tierOptions} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
          editForm.resetFields();
        }}
        destroyOnClose
      >
        <Form 
          form={editForm} 
          layout="vertical"
        >
          <Form.Item
            name="npub"
            label="NPUB"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="tier"
            label="Tier"
            rules={[{ required: true, message: 'Please select a tier' }]}
          >
            <Select placeholder="Select tier" options={tierOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </S.Container>
  );
};
