import React, { useState } from 'react';
import { Tabs, Card, Button, Input, Table, Space, Modal, Form, Select, Upload, message, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
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
}

export const NPubManagement: React.FC<NPubManagementProps> = ({
  settings,
  mode
}) => {
  const [activeTab, setActiveTab] = useState('read');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [addForm] = Form.useForm<AddNpubFormData>();

  const readNpubs = useAllowedUsersNpubs('read');
  const writeNpubs = useAllowedUsersNpubs('write');
  const { validateNpub } = useAllowedUsersValidation();

  const currentNpubs = activeTab === 'read' ? readNpubs : writeNpubs;
  const tierOptions = settings.tiers.map(tier => ({
    label: `${tier.data_limit} (${tier.price === '0' ? 'Free' : `${tier.price} sats`})`,
    value: tier.data_limit
  }));

  const handleAddNpub = async () => {
    try {
      const values = await addForm.validateFields();
      await currentNpubs.addNpub(values.npub, values.tier);
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      // Form validation failed or API error
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      message.error('Please enter NPUBs to import');
      return;
    }

    const lines = bulkText.split('\n').filter(line => line.trim());
    const npubsData: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.includes(':')) {
        // Format: npub:tier
        npubsData.push(trimmedLine);
      } else {
        // Just npub, use first tier as default
        const defaultTier = settings.tiers[0]?.data_limit || 'basic';
        npubsData.push(`${trimmedLine}:${defaultTier}`);
      }
    }

    await currentNpubs.bulkImport(npubsData);
    setIsBulkModalVisible(false);
    setBulkText('');
  };

  const handleExport = () => {
    const data = currentNpubs.npubs.map(npub => `${npub.npub}:${npub.tier}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-npubs.txt`;
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
      title: 'Added',
      dataIndex: 'added_at',
      key: 'added_at',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Are you sure you want to remove this NPUB?"
          onConfirm={() => currentNpubs.removeNpub(record.npub)}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      )
    }
  ];

  const tabItems = [
    {
      key: 'read',
      label: `Read Access (${readNpubs.total})`,
      children: (
        <S.TabContent>
          <S.TabHeader>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                Add NPUB
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
                disabled={readNpubs.npubs.length === 0}
              >
                Export
              </Button>
            </Space>
          </S.TabHeader>
          
          <Table
            columns={columns}
            dataSource={readNpubs.npubs}
            loading={readNpubs.loading}
            pagination={{
              current: readNpubs.page,
              pageSize: readNpubs.pageSize,
              total: readNpubs.total,
              onChange: readNpubs.changePage,
              showSizeChanger: false
            }}
            rowKey="npub"
          />
        </S.TabContent>
      )
    },
    {
      key: 'write',
      label: `Write Access (${writeNpubs.total})`,
      children: (
        <S.TabContent>
          <S.TabHeader>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                Add NPUB
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
                disabled={writeNpubs.npubs.length === 0}
              >
                Export
              </Button>
            </Space>
          </S.TabHeader>
          
          <Table
            columns={columns}
            dataSource={writeNpubs.npubs}
            loading={writeNpubs.loading}
            pagination={{
              current: writeNpubs.page,
              pageSize: writeNpubs.pageSize,
              total: writeNpubs.total,
              onChange: writeNpubs.changePage,
              showSizeChanger: false
            }}
            rowKey="npub"
          />
        </S.TabContent>
      )
    }
  ];

  return (
    <S.Container>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {/* Add NPUB Modal */}
      <Modal
        title={`Add NPUB to ${activeTab === 'read' ? 'Read' : 'Write'} List`}
        open={isAddModalVisible}
        onOk={handleAddNpub}
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

      {/* Bulk Import Modal */}
      <Modal
        title={`Bulk Import ${activeTab === 'read' ? 'Read' : 'Write'} NPUBs`}
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
            <li><code>npub1...</code> (will use default tier)</li>
            <li><code>npub1...:tier_name</code> (specify tier)</li>
          </ul>
          
          <Input.TextArea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="npub1abc123...&#10;npub1def456...:premium&#10;npub1ghi789..."
            rows={10}
          />
        </S.BulkImportContainer>
      </Modal>
    </S.Container>
  );
};