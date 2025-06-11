import React, { useState } from 'react';
import { Input, Button,  Modal } from 'antd';
import { StopOutlined, SearchOutlined } from '@ant-design/icons';
import { useModerationStats, UserStat } from '@app/hooks/useModerationStats';
import { BlockedPubkey } from '@app/api/blockedPubkeys.api';

import * as S from '../BlockedPubkeys.styles';

interface FlaggedPubkeysTableProps {
  blockedPubkeys: BlockedPubkey[]; // Already blocked pubkeys to filter out
  onBlock: (pubkey: string, reason?: string) => Promise<void>;
  disabled?: boolean;
}

export const FlaggedPubkeysTable: React.FC<FlaggedPubkeysTableProps> = ({
  blockedPubkeys,
  onBlock,
  disabled = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [currentPubkey, setCurrentPubkey] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const { stats, loading: statsLoading } = useModerationStats();
  
  // Filter out already blocked pubkeys and return the rest
  const flaggedUsers = stats?.by_user.filter(
    user => !blockedPubkeys.some(bp => 
      bp.pubkey === user.pubkey || 
      bp.pubkey === `blocked_pubkey:${user.pubkey}` ||
      user.pubkey === `blocked_pubkey:${bp.pubkey}`
    )
  ) || [];
  
  // Format pubkey for display (truncate)
  const formatPubkey = (pubkey: string) => {
    // Strip the prefix first for consistent display
    const cleanPubkey = pubkey.replace('blocked_pubkey:', '');
    if (cleanPubkey.length <= 12) return cleanPubkey;
    return `${cleanPubkey.substring(0, 6)}...${cleanPubkey.substring(cleanPubkey.length - 6)}`;
  };
  
  // Filter by search
  const filteredPubkeys = flaggedUsers.filter(
    item => item.pubkey.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // Show block modal with default reason
  const showBlockModal = (pubkey: string, flagCount: number) => {
    setCurrentPubkey(pubkey);
    setBlockReason(`Blocked due to high flag count (${flagCount} flags)`);
    setBlockModalVisible(true);
  };
  
  // Handle block confirmation with custom reason
  const handleConfirmBlock = async () => {
    await onBlock(currentPubkey, blockReason);
    setBlockModalVisible(false);
  };
  
  const columns = [
    {
      title: 'Pubkey',
      dataIndex: 'pubkey',
      key: 'pubkey',
      render: (pubkey: string) => formatPubkey(pubkey),
    },
    {
      title: 'Flag Count',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => (
        <S.FlagCountContainer>
          <S.CircularBadge 
            color={count > 10 ? 'var(--error-color)' : count > 5 ? 'var(--warning-color)' : 'var(--primary-color)'}
          >
            {count}
          </S.CircularBadge>
        </S.FlagCountContainer>
      ),
      sorter: (a: UserStat, b: UserStat) => a.count - b.count,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserStat) => (
        <Button
          type="primary"
          danger
          icon={<StopOutlined />}
          onClick={() => showBlockModal(record.pubkey, record.count)}
          disabled={disabled}
        >
          Block
        </Button>
      ),
    },
  ];
  
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Input
          placeholder="Search pubkeys"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      
      <S.TableContainer>
        <S.TableRoot
          dataSource={filteredPubkeys}
          columns={columns}
          rowKey="pubkey"
          loading={statsLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} flagged pubkeys`,
          }}
          locale={{ emptyText: statsLoading ?<S.EmptyList>Loading... </S.EmptyList>: <S.EmptyList>No flagged pubkeys found</S.EmptyList> }}
        />
      </S.TableContainer> 
      
      {/* Block Confirmation Modal */}
      <Modal
        title="Block Pubkey"
        open={blockModalVisible}
        onOk={handleConfirmBlock}
        onCancel={() => setBlockModalVisible(false)}
        okText="Block"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to block this pubkey?</p>
        <p><strong>{formatPubkey(currentPubkey)}</strong></p>
        <div style={{ marginTop: '16px' }}>
          <p>Reason:</p>
          <Input.TextArea
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Enter reason for blocking"
            rows={3}
          />
        </div>
      </Modal>
    </>
  );
};
