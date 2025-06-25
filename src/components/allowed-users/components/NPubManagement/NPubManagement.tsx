import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Space, Modal, Form, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useAllowedUsersNpubs, useAllowedUsersValidation } from '@app/hooks/useAllowedUsers';
import { AllowedUsersSettings, AllowedUsersMode } from '@app/types/allowedUsers.types';
import * as S from './NPubManagement.styles';

interface NPubManagementProps {
  settings: AllowedUsersSettings;
  mode: AllowedUsersMode;
}

interface AddNpubFormData {
  npub: string;
  tier: string;
  readAccess: boolean;
  writeAccess: boolean;
}

interface UnifiedUser {
  npub: string;
  tier: string;
  readAccess: boolean;
  writeAccess: boolean;
  added_at: string;
}

export const NPubManagement: React.FC<NPubManagementProps> = ({
  settings,
  mode
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [unifiedUsers, setUnifiedUsers] = useState<UnifiedUser[]>([]);
  const [editingUser, setEditingUser] = useState<UnifiedUser | null>(null);
  const [addForm] = Form.useForm<AddNpubFormData>();
  const [editForm] = Form.useForm<AddNpubFormData>();

  const readNpubs = useAllowedUsersNpubs('read');
  const writeNpubs = useAllowedUsersNpubs('write');
  const { validateNpub } = useAllowedUsersValidation();

  // Merge read and write NPUBs into unified list
  useEffect(() => {
    const allNpubs = new Map<string, UnifiedUser>();

    // Add read NPUBs
    readNpubs.npubs.forEach(npub => {
      allNpubs.set(npub.npub, {
        npub: npub.npub,
        tier: npub.tier || settings.tiers[0]?.name || 'basic',
        readAccess: true,
        writeAccess: false,
        added_at: npub.added_at
      });
    });

    // Add write NPUBs (merge with existing or create new)
    writeNpubs.npubs.forEach(npub => {
      const existing = allNpubs.get(npub.npub);
      if (existing) {
        existing.writeAccess = true;
        // Preserve the tier from read access, or use write tier, or fallback
        existing.tier = existing.tier || npub.tier || settings.tiers[0]?.name || 'basic';
      } else {
        allNpubs.set(npub.npub, {
          npub: npub.npub,
          tier: npub.tier || settings.tiers[0]?.name || 'basic',
          readAccess: false,
          writeAccess: true,
          added_at: npub.added_at
        });
      }
    });

    setUnifiedUsers(Array.from(allNpubs.values()));
  }, [readNpubs.npubs, writeNpubs.npubs, settings.tiers]);
  const tierOptions = settings.tiers.map(tier => {
    const displayFormat = tier.unlimited 
      ? 'unlimited' 
      : `${(tier.monthly_limit_bytes / 1073741824).toFixed(tier.monthly_limit_bytes % 1073741824 === 0 ? 0 : 1)} GB per month`;
    
    return {
      label: `${tier.name} - ${displayFormat} (${tier.price_sats === 0 ? 'Free' : `${tier.price_sats} sats`})`,
      value: tier.name
    };
  });

  const handleAddNpub = async () => {
    try {
      const values = await addForm.validateFields();
      
      // Add to read list if read access is enabled
      if (values.readAccess) {
        await readNpubs.addNpub(values.npub, values.tier);
      }
      
      // Add to write list if write access is enabled
      if (values.writeAccess) {
        await writeNpubs.addNpub(values.npub, values.tier);
      }
      
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      // Form validation failed or API error
    }
  };

  const handleToggleAccess = async (npub: string, type: 'read' | 'write', enabled: boolean) => {
    const user = unifiedUsers.find(u => u.npub === npub);
    if (!user) return;

    // Ensure we have a valid tier - fallback to first available tier if undefined
    const tierToUse = user.tier || settings.tiers[0]?.name || 'basic';

    try {
      if (type === 'read') {
        if (enabled) {
          await readNpubs.addNpub(npub, tierToUse);
        } else {
          await readNpubs.removeNpub(npub);
        }
      } else {
        if (enabled) {
          await writeNpubs.addNpub(npub, tierToUse);
        } else {
          await writeNpubs.removeNpub(npub);
        }
      }
    } catch (error) {
      message.error(`Failed to update ${type} access`);
    }
  };

  const handleEditUser = (user: UnifiedUser) => {
    setEditingUser(user);
    setIsEditModalVisible(true);
    // Set form values after modal is visible
    setTimeout(() => {
      editForm.setFieldsValue({
        npub: user.npub,
        tier: user.tier,
        readAccess: user.readAccess,
        writeAccess: user.writeAccess
      });
    }, 0);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const originalUser = editingUser!;
      
      // Check what actually changed
      const readChanged = originalUser.readAccess !== values.readAccess;
      const writeChanged = originalUser.writeAccess !== values.writeAccess;
      const tierChanged = originalUser.tier !== values.tier;
      
      // Handle read access changes
      if (readChanged || (tierChanged && values.readAccess)) {
        if (values.readAccess) {
          // Remove old entry if exists and re-add with new tier
          if (originalUser.readAccess) {
            await readNpubs.removeNpub(values.npub);
          }
          await readNpubs.addNpub(values.npub, values.tier);
        } else {
          // Remove read access
          await readNpubs.removeNpub(values.npub);
        }
      }
      
      // Handle write access changes
      if (writeChanged || (tierChanged && values.writeAccess)) {
        if (values.writeAccess) {
          // Remove old entry if exists and re-add with new tier
          if (originalUser.writeAccess) {
            await writeNpubs.removeNpub(values.npub);
          }
          await writeNpubs.addNpub(values.npub, values.tier);
        } else {
          // Remove write access
          await writeNpubs.removeNpub(values.npub);
        }
      }
      
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
      // Remove from both lists
      await Promise.all([
        readNpubs.removeNpub(npub).catch(() => { /* Ignore errors if not in list */ }),
        writeNpubs.removeNpub(npub).catch(() => { /* Ignore errors if not in list */ })
      ]);
    } catch (error) {
      message.error('Failed to remove user');
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      message.error('Please enter NPUBs to import');
      return;
    }

    const lines = bulkText.split('\n').filter(line => line.trim());
    const defaultTier = settings.tiers[0]?.name || 'basic';

    try {
      for (const line of lines) {
        const trimmedLine = line.trim();
        const parts = trimmedLine.split(':');
        
        const npub = parts[0];
        const tier = parts[1] || defaultTier;
        const permissions = parts[2] || 'r'; // default to read only
        
        const hasReadAccess = permissions.includes('r');
        const hasWriteAccess = permissions.includes('w');

        // Add to read list if read access
        if (hasReadAccess) {
          try {
            await readNpubs.addNpub(npub, tier);
          } catch (error) {
            // Might already exist, continue
          }
        }

        // Add to write list if write access  
        if (hasWriteAccess) {
          try {
            await writeNpubs.addNpub(npub, tier);
          } catch (error) {
            // Might already exist, continue
          }
        }
      }
      
      message.success('Bulk import completed');
      setIsBulkModalVisible(false);
      setBulkText('');
    } catch (error) {
      message.error('Bulk import failed');
    }
  };

  const handleExport = () => {
    const data = unifiedUsers.map(user => {
      let permissions = '';
      if (user.readAccess) permissions += 'r';
      if (user.writeAccess) permissions += 'w';
      return `${user.npub}:${user.tier}:${permissions}`;
    }).join('\n');
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'allowed-users.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      title: 'Read Access',
      key: 'readAccess',
      align: 'center' as const,
      render: (_: any, record: UnifiedUser) => (
        <S.StyledSwitch
          checked={record.readAccess}
          onChange={(checked: boolean) => handleToggleAccess(record.npub, 'read', checked)}
          loading={readNpubs.loading}
          size="small"
        />
      )
    },
    {
      title: 'Write Access',
      key: 'writeAccess',
      align: 'center' as const,
      render: (_: any, record: UnifiedUser) => (
        <S.StyledSwitch
          checked={record.writeAccess}
          onChange={(checked: boolean) => handleToggleAccess(record.npub, 'write', checked)}
          loading={writeNpubs.loading}
          size="small"
        />
      )
    },
    {
      title: 'Added',
      dataIndex: 'added_at',
      key: 'added_at',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UnifiedUser) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
            title="Edit user"
          />
          <Popconfirm
            title="Are you sure you want to remove this user completely?"
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
          <Button
            icon={<UploadOutlined />}
            onClick={() => setIsBulkModalVisible(true)}
          >
            Bulk Import
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={unifiedUsers.length === 0}
          >
            Export
          </Button>
        </Space>
      </S.TabHeader>
      
      <Table
        columns={columns}
        dataSource={unifiedUsers}
        loading={readNpubs.loading || writeNpubs.loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} users`
        }}
        rowKey="npub"
      />

      {/* Add User Modal */}
      <Modal
        title="Add User"
        open={isAddModalVisible}
        onOk={handleAddNpub}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" initialValues={{ readAccess: true, writeAccess: false }}>
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

          <Form.Item
            label="Permissions"
            style={{ marginBottom: 0 }}
          >
            <Space direction="vertical">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main-color)' }}>
                <Form.Item name="readAccess" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <S.StyledSwitch size="small" />
                </Form.Item>
                <span>Read Access</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main-color)' }}>
                <Form.Item name="writeAccess" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <S.StyledSwitch size="small" />
                </Form.Item>
                <span>Write Access</span>
              </div>
            </Space>
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
          initialValues={{ 
            npub: editingUser?.npub || '',
            tier: editingUser?.tier || '',
            readAccess: editingUser?.readAccess || false,
            writeAccess: editingUser?.writeAccess || false
          }}
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

          <Form.Item
            label="Permissions"
            style={{ marginBottom: 0 }}
          >
            <Space direction="vertical">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main-color)' }}>
                <Form.Item name="readAccess" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <S.StyledSwitch size="small" />
                </Form.Item>
                <span>Read Access</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main-color)' }}>
                <Form.Item name="writeAccess" valuePropName="checked" style={{ marginBottom: 0 }}>
                  <S.StyledSwitch size="small" />
                </Form.Item>
                <span>Write Access</span>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        title="Bulk Import Users"
        open={isBulkModalVisible}
        onOk={handleBulkImport}
        onCancel={() => {
          setIsBulkModalVisible(false);
          setBulkText('');
        }}
        width={600}
      >
        <S.BulkImportContainer>
          <p>Enter NPUBs, one per line. Format options:</p>
          <ul>
            <li><code>npub1...</code> (will use default tier and read access only)</li>
            <li><code>npub1...:tier_name</code> (specify tier, read access only)</li>
            <li><code>npub1...:tier_name:rw</code> (specify tier with read+write access)</li>
          </ul>
          
          <Input.TextArea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="npub1abc123...&#10;npub1def456...:premium&#10;npub1ghi789...:basic:rw"
            rows={10}
          />
        </S.BulkImportContainer>
      </Modal>
    </S.Container>
  );
};