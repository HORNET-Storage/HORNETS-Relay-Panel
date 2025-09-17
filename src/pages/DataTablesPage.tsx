import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tables } from '@app/components/tables/Tables/Tables';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';
const DataTablesPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <Tables />
      </S.LeftSideCol>
      <S.RightSideCol xl={8} xxl={7}>
        <S.RightSideContentWrapper>
          <div id="balance" className="liquid-element">
            <Balance />
          </div>
          <S.Space />
          <div id="total-earning" className="liquid-element">
            <TotalEarning />
          </div>
          <S.Space />
          <div id="activity-story" className="liquid-element">
            <ActivityStory />
          </div>
        </S.RightSideContentWrapper>
      </S.RightSideCol>
    </BaseRow>
  );

  return (
    <DashboardWrapper>
      <PageTitle>{t('Nostr Statistics')}</PageTitle>
      {isDesktop ? (
        desktopLayout
      ) : (
        <>
          <Tables />
        </>
      )}
    </DashboardWrapper>
  );
};

export default DataTablesPage;
