import React from 'react';
import { Card, Space, Typography } from 'antd';
import useBlockedPubkeys from '@app/hooks/useBlockedPubkeys';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ReloadOutlined } from '@ant-design/icons';
import { BlockedPubkeysTable } from './components/BlockedPubkeysTable';
import { BlockPubkeyForm } from './components/BlockPubkeyForm';
import * as S from './BlockedPubkeys.styles';

const { Title, Text } = Typography;

export const BlockedPubkeys: React.FC = () => {
  const {
    blockedPubkeys,
    count,
    loading,
    fetchBlockedPubkeys,
    addBlockedPubkey,
    removeBlockedPubkey,
  } = useBlockedPubkeys();

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4}>Blocked Pubkeys</Title>
            <Text type="secondary">
              Manage users who are blocked from connecting to your relay
            </Text>
          </div>
          <BaseButton 
            icon={<ReloadOutlined />} 
            onClick={fetchBlockedPubkeys}
            loading={loading}
          >
            Refresh
          </BaseButton>
        </div>
        
        <BlockPubkeyForm onSubmit={addBlockedPubkey} disabled={loading} />
        
        <BlockedPubkeysTable 
          blockedPubkeys={blockedPubkeys}
          loading={loading}
          onUnblock={removeBlockedPubkey}
        />
      </Space>
    </Card>
  );
};
