import React, { useState } from 'react';
import { Button, Modal, Tooltip, Space, Spin, TableColumnsType, Table } from 'antd';
import { DeleteOutlined, CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { BlockedPubkey } from '@app/api/blockedPubkeys.api';
import { useModerationStats } from '@app/hooks/useModerationStats';
import * as S from '../BlockedPubkeys.styles';
import { createStyledTable } from '../BlockedPubkeys';

interface BlockedPubkeysTableProps {
  blockedPubkeys: BlockedPubkey[];
  loading: boolean;
  onUnblock: (pubkey: string) => Promise<void>;
}
export const BlockedPubkeysTable: React.FC<BlockedPubkeysTableProps> = ({ blockedPubkeys, loading, onUnblock }) => {
  const [searchText, setSearchText] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentPubkey, setCurrentPubkey] = useState('');
  const { getFlagCountsForPubkeys, loading: statsLoading } = useModerationStats();
  const TableRoot = createStyledTable<BlockedPubkey>();

  // Get flag counts for all pubkeys in the table
  const pubkeyFlagCounts = getFlagCountsForPubkeys(blockedPubkeys.map((bp) => bp.pubkey));

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
  const filteredPubkeys = blockedPubkeys.filter(
    (item) =>
      item.pubkey.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.reason && item.reason.toLowerCase().includes(searchText.toLowerCase())),
  );

  // Format pubkey for display (truncate)
  const formatPubkey = (pubkey: string) => {
    // Strip the prefix first for consistent display
    const cleanPubkey = pubkey.replace('blocked_pubkey:', '');
    if (cleanPubkey.length <= 12) return cleanPubkey;
    return `${cleanPubkey.substring(0, 6)}...${cleanPubkey.substring(cleanPubkey.length - 6)}`;
  };

  const columns: TableColumnsType<BlockedPubkey> = [
    {
      title: 'Pubkey',
      dataIndex: 'pubkey',
      key: 'pubkey',
      render: (pubkey: string) => (
        <Space>
          {formatPubkey(pubkey)}
          <Tooltip title="Copy full pubkey">
            <Button icon={<CopyOutlined />} type="text" size="small" onClick={() => handleCopy(pubkey)} />
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
          <S.FlagCountContainer>
            {statsLoading ? (
              <Spin size="small" />
            ) : (
              <S.CircularBadge
                color={count > 10 ? 'var(--error-color)' : count > 5 ? 'var(--warning-color)' : 'var(--primary-color)'}
              >
                {count}
              </S.CircularBadge>
            )}
          </S.FlagCountContainer>
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
        <Button danger icon={<DeleteOutlined />} onClick={() => showConfirmModal(record.pubkey)}>
          Unblock
        </Button>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <S.InputRoot
          placeholder="Search pubkeys or reasons"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>

      <S.TableContainer>
        <TableRoot
          dataSource={filteredPubkeys}
          columns={columns}
          rowKey="pubkey"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} blocked pubkeys`,
          }}
          locale={{ emptyText: <S.EmptyList>No blocked pubkeys</S.EmptyList> }}
        />
      </S.TableContainer>

      <Modal
        title="Confirm Unblock"
        open={confirmModalVisible}
        onOk={handleUnblock}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Unblock"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to unblock this pubkey?</p>
        <p>
          <strong>{currentPubkey.replace('blocked_pubkey:', '')}</strong>
        </p>
      </Modal>
    </>
  );
};
