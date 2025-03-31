import React, { useState } from 'react';
import { Table, Input, Button, Modal, Tooltip, Space, Badge, Spin } from 'antd';
import { DeleteOutlined, CopyOutlined, SearchOutlined, FlagOutlined } from '@ant-design/icons';
import { BlockedPubkey } from '@app/api/blockedPubkeys.api';
import { useModerationStats } from '@app/hooks/useModerationStats';

interface BlockedPubkeysTableProps {
  blockedPubkeys: BlockedPubkey[];
  loading: boolean;
  onUnblock: (pubkey: string) => Promise<void>;
}

export const BlockedPubkeysTable: React.FC<BlockedPubkeysTableProps> = ({
  blockedPubkeys,
  loading,
  onUnblock,
}) => {
  const [searchText, setSearchText] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentPubkey, setCurrentPubkey] = useState('');
  const { getFlagCountsForPubkeys, loading: statsLoading } = useModerationStats();
  
  // Get flag counts for all pubkeys in the table
  const pubkeyFlagCounts = getFlagCountsForPubkeys(blockedPubkeys.map(bp => bp.pubkey));

  // Handle pubkey copy
  const handleCopy = (pubkey: string) => {
    // Strip the "blocked_pubkey:" prefix if it exists for better UX
    const cleanPubkey = pubkey.replace('blocked_pubkey:', '');
    navigator.clipboard.writeText(cleanPubkey);
  };

  // Handle unblock confirmation
  const showConfirmModal = (pubkey: string) => {
    setCurrentPubkey(pubkey);
    setConfirmModalVisible(true);
  };

  const handleUnblock = async () => {
    await onUnblock(currentPubkey);
    setConfirmModalVisible(false);
  };

  // Filter pubkeys based on search
  const filteredPubkeys = blockedPubkeys.filter(item => 
    item.pubkey.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.reason && item.reason.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Format pubkey for display (truncate)
  const formatPubkey = (pubkey: string) => {
    // Strip the prefix first for consistent display
    const cleanPubkey = pubkey.replace('blocked_pubkey:', '');
    if (cleanPubkey.length <= 12) return cleanPubkey;
    return `${cleanPubkey.substring(0, 6)}...${cleanPubkey.substring(cleanPubkey.length - 6)}`;
  };

  const columns = [
    {
      title: 'Pubkey',
      dataIndex: 'pubkey',
      key: 'pubkey',
      render: (pubkey: string) => (
        <Space>
          {formatPubkey(pubkey)}
          <Tooltip title="Copy full pubkey">
            <Button 
              icon={<CopyOutlined />} 
              type="text" 
              size="small" 
              onClick={() => handleCopy(pubkey)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Blocked At',
      dataIndex: 'blocked_at',
      key: 'blocked_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Flag Count',
      key: 'flagCount',
      render: (_: any, record: BlockedPubkey) => {
        const count = pubkeyFlagCounts[record.pubkey] || 0;
        return (
          <Space>
            {statsLoading ? (
              <Spin size="small" />
            ) : (
              <>
                <Badge 
                  count={count} 
                  showZero 
                  color={count > 10 ? 'red' : count > 5 ? 'orange' : 'blue'} 
                  style={{ marginRight: '5px' }}
                />
                <FlagOutlined style={{ color: count > 0 ? undefined : '#d9d9d9' }} />
              </>
            )}
          </Space>
        );
      },
      sorter: (a: BlockedPubkey, b: BlockedPubkey) => 
        (pubkeyFlagCounts[a.pubkey] || 0) - (pubkeyFlagCounts[b.pubkey] || 0),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: BlockedPubkey) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => showConfirmModal(record.pubkey)}
        >
          Unblock
        </Button>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Input
          placeholder="Search pubkeys or reasons"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>

      <Table
        dataSource={filteredPubkeys}
        columns={columns}
        rowKey="pubkey"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} blocked pubkeys`,
        }}
        locale={{ emptyText: 'No blocked pubkeys' }}
      />

      <Modal
        title="Confirm Unblock"
        open={confirmModalVisible}
        onOk={handleUnblock}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Unblock"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to unblock this pubkey?</p>
        <p><strong>{currentPubkey.replace('blocked_pubkey:', '')}</strong></p>
      </Modal>
    </>
  );
};
