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
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';
import * as PageStyles from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import * as S from './BlockedPubkeys.styles';

const { Title, Text } = Typography;

export function createStyledTable<T extends object = any>() {
  const GenericTable: FC<TableProps<T>> = (props) => <Table {...props} />;

  const StyledTable = styled(GenericTable)`
    border-radius: 8px !important;
    overflow: hidden;

    & .ant-table {
      background: transparent;
    }

    & .ant-table-thead > tr > th {
      background: transparent;
      border-bottom: none;
    }
    
    & .ant-table-thead > tr > th:first-child {
      border-top-left-radius: 8px !important;
    }
    
    & .ant-table-thead > tr > th:last-child {
      border-top-right-radius: 8px !important;
    }

    & .ant-table-tbody > tr > td {
      border-bottom: none;
      background: transparent;
    }

    & .ant-table-tbody > tr:hover > td {
      background: rgba(255, 255, 255, 0.02);
    }

    .ant-table-placeholder .ant-table-cell {
      background: transparent;
      border-bottom: none;
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
    <DashboardWrapper>
      <PageTitle>Content Moderation</PageTitle>
      <BaseRow>
        <PageStyles.LeftSideCol xl={16} xxl={17}>
          <S.BaseColRoot>
            <S.CardRoot>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Title level={3}>
                      Content Moderation <LockFilled />
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
        </PageStyles.LeftSideCol>

        <PageStyles.RightSideCol xl={8} xxl={7}>
          <PageStyles.RightSideContentWrapper>
            <div id="balance" className="liquid-element">
              <Balance />
            </div>
            <PageStyles.Space />
            <div id="total-earning" className="liquid-element">
              <TotalEarning />
            </div>
            <PageStyles.Space />
            <div id="activity-story" className="liquid-element">
              <ActivityStory />
            </div>
          </PageStyles.RightSideContentWrapper>
        </PageStyles.RightSideCol>
      </BaseRow>
    </DashboardWrapper>
  );
};
