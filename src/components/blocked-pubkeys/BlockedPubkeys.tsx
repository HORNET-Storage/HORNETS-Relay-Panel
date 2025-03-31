import React, { useState } from 'react';
import { Card, Space, Typography, Tabs } from 'antd';
import useBlockedPubkeys from '@app/hooks/useBlockedPubkeys';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ReloadOutlined } from '@ant-design/icons';
import { BlockedPubkeysTable } from './components/BlockedPubkeysTable';
import { FlaggedPubkeysTable } from './components/FlaggedPubkeysTable';
import { BlockPubkeyForm } from './components/BlockPubkeyForm';
import { useModerationStats } from '@app/hooks/useModerationStats';
import * as S from './BlockedPubkeys.styles';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const BlockedPubkeys: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1'); // Default to blocked pubkeys tab
  const {
    blockedPubkeys,
    count,
    loading,
    fetchBlockedPubkeys,
    addBlockedPubkey,
    removeBlockedPubkey,
  } = useBlockedPubkeys();
  const { fetchStats, loading: statsLoading } = useModerationStats();

  // Refresh all data
  const handleRefresh = () => {
    fetchBlockedPubkeys();
    fetchStats();
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4}>Pubkey Management</Title>
            <Text type="secondary">
              Block users from connecting to your relay and view flagged pubkeys
            </Text>
          </div>
          <BaseButton 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading || statsLoading}
          >
            Refresh
          </BaseButton>
        </div>
        
        {activeTab === '1' && (
          <BlockPubkeyForm onSubmit={addBlockedPubkey} disabled={loading} />
        )}
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Blocked Pubkeys" key="1">
            <BlockedPubkeysTable 
              blockedPubkeys={blockedPubkeys}
              loading={loading}
              onUnblock={removeBlockedPubkey}
            />
          </TabPane>
          <TabPane tab="Flagged Pubkeys" key="2">
            <FlaggedPubkeysTable 
              blockedPubkeys={blockedPubkeys}
              onBlock={addBlockedPubkey}
              disabled={loading}
            />
          </TabPane>
        </Tabs>
      </Space>
    </Card>
  );
};
