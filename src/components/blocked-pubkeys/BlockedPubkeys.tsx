import React, { useState, FC } from 'react';
import { Space, Typography, Table, TableProps } from 'antd';
import useBlockedPubkeys from '@app/hooks/useBlockedPubkeys';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ReloadOutlined } from '@ant-design/icons';
import { BlockedPubkeysTable } from './components/BlockedPubkeysTable';
import { FlaggedPubkeysTable } from './components/FlaggedPubkeysTable';
import { BlockPubkeyForm } from './components/BlockPubkeyForm';
import { useModerationStats } from '@app/hooks/useModerationStats';
import { LockFilled } from '@ant-design/icons';
import styled from 'styled-components';
import * as S from './BlockedPubkeys.styles';

const { Title, Text } = Typography;

export function createStyledTable<T extends object = any>() {
  const GenericTable: FC<TableProps<T>> = (props) => <Table {...props} />;

  const StyledTable = styled(GenericTable)`
    border-radius: 12px;

    & .ant-table-thead .ant-table-cell {
      background-color: var(--secondary-background-color);
    }

    .ant-table-tbody {
      background-color: var(--layout-sider-bg-color);
    }
    .ant-table-placeholder .ant-table-cell {
      background-color: var(--layout-sider-bg-color);
      transition: none;
    }
    .ant-table-placeholder .ant-table-cell:hover {
      background-color: var(--layout-sider-bg-color);
    }
  `;
  return StyledTable;
}
export const BlockedPubkeys: React.FC = () => {
  const [activeView, setActiveView] = useState<'blocked' | 'flagged'>('blocked');
  const { blockedPubkeys, count, loading, fetchBlockedPubkeys, addBlockedPubkey, removeBlockedPubkey } =
    useBlockedPubkeys();
  const { fetchStats, loading: statsLoading } = useModerationStats();

  // Refresh all data
  const handleRefresh = () => {
    fetchBlockedPubkeys();
    fetchStats();
  };

  return (
    <S.BaseColRoot>
      <S.CardRoot>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                Access Control <LockFilled />
              </Title>
              <Text style={{ color: 'var(--text-light-color)' }}>
                Control access to your relay and manage flagged pubkeys
              </Text>
            </div>
            <BaseButton icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading || statsLoading}>
              Refresh
            </BaseButton>
          </div>

          {activeView === 'blocked' && <BlockPubkeyForm onSubmit={addBlockedPubkey} disabled={loading} />}

          <S.NavContainer>
            <S.NavLink active={activeView === 'blocked'} onClick={() => setActiveView('blocked')}>
              Blocked Access
            </S.NavLink>
            <S.NavLink active={activeView === 'flagged'} onClick={() => setActiveView('flagged')}>
              Flagged Access
            </S.NavLink>
          </S.NavContainer>

          {activeView === 'blocked' ? (
            <BlockedPubkeysTable blockedPubkeys={blockedPubkeys} loading={loading} onUnblock={removeBlockedPubkey} />
          ) : (
            <FlaggedPubkeysTable blockedPubkeys={blockedPubkeys} onBlock={addBlockedPubkey} disabled={loading} />
          )}
        </Space>
      </S.CardRoot>
    </S.BaseColRoot>
  );
};
