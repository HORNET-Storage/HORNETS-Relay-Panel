import React, { useState } from 'react';
import { Table, Input, Button, Space, Badge, Spin } from 'antd';
import { StopOutlined, SearchOutlined, FlagOutlined } from '@ant-design/icons';
import { useModerationStats, UserStat } from '@app/hooks/useModerationStats';
import { BlockedPubkey } from '@app/api/blockedPubkeys.api';

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
  
  const handleBlock = (pubkey: string) => {
    // Default reason
    const reason = "Blocked due to high flag count";
    onBlock(pubkey, reason);
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
        <Space>
          <Badge 
            count={count} 
            showZero 
            color={count > 10 ? 'red' : count > 5 ? 'orange' : 'blue'} 
            style={{ marginRight: '5px' }}
          />
          <FlagOutlined style={{ color: count > 0 ? undefined : '#d9d9d9' }} />
        </Space>
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
          onClick={() => handleBlock(record.pubkey)}
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
      
      <Table
        dataSource={filteredPubkeys}
        columns={columns}
        rowKey="pubkey"
        loading={statsLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} flagged pubkeys`,
        }}
        locale={{ emptyText: statsLoading ? 'Loading...' : 'No flagged pubkeys found' }}
      />
    </>
  );
};
