import React, { useState } from 'react';
import { Card, Space, Typography } from 'antd';
import useBlockedPubkeys from '@app/hooks/useBlockedPubkeys';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ReloadOutlined } from '@ant-design/icons';
import { BlockedPubkeysTable } from './components/BlockedPubkeysTable';
import { FlaggedPubkeysTable } from './components/FlaggedPubkeysTable';
import { BlockPubkeyForm } from './components/BlockPubkeyForm';
import { useModerationStats } from '@app/hooks/useModerationStats';
import * as S from './BlockedPubkeys.styles';

const { Title, Text } = Typography;

export const BlockedPubkeys: React.FC = () => {
  const [activeView, setActiveView] = useState<'blocked' | 'flagged'>('blocked');
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
            <Title level={4}>Access Control</Title>
            <Text type="secondary">
              Control access to your relay and manage flagged pubkeys
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
        
        {activeView === 'blocked' && (
          <BlockPubkeyForm onSubmit={addBlockedPubkey} disabled={loading} />
        )}
        
        <S.NavContainer>
          <S.NavLink 
            active={activeView === 'blocked'} 
            onClick={() => setActiveView('blocked')}
          >
            Blocked Access
          </S.NavLink>
          <S.NavLink 
            active={activeView === 'flagged'} 
            onClick={() => setActiveView('flagged')}
          >
            Flagged Access
          </S.NavLink>
        </S.NavContainer>
        
        {activeView === 'blocked' ? (
          <BlockedPubkeysTable 
            blockedPubkeys={blockedPubkeys}
            loading={loading}
            onUnblock={removeBlockedPubkey}
          />
        ) : (
          <FlaggedPubkeysTable 
            blockedPubkeys={blockedPubkeys}
            onBlock={addBlockedPubkey}
            disabled={loading}
          />
        )}
      </Space>
    </Card>
  );
};
