import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import { PaidSubscribers } from '@app/components/relay-dashboard/paid-subscribers/PaidSubscribers';
import { VisitorsPieChart } from '@app/components/charts/VisitorsPieChart';
import { LineRaceChart } from '@app/components/charts/LineRaceChart/LineRaceChart';
import { BarAnimationDelayChart } from '@app/components/charts/BarAnimationDelayChart/BarAnimationDelayChart';
import { ActivityCard } from '@app/components/medical-dashboard/activityCard/ActivityCard';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';
import { useNavigate } from 'react-router-dom';
import * as S from './DashboardPage.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const MedicalDashboardPage: React.FC = () => {
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  // const goToBalancePage = () => {
  //   navigate('/balance');
  // };

  const desktopLayout = (
    <S.DashboardWrapper>
      <BaseRow>
        <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
          <BaseRow gutter={[60, 30]}>
            <BaseCol span={24}>
              <div className="glass-panel">
                <PaidSubscribers />
              </div>
            </BaseCol>

            <BaseCol span={12}>
              <div className="glass-panel">
                <VisitorsPieChart />
              </div>
            </BaseCol>

            <BaseCol span={12}>
              <div className="glass-panel">
                <LineRaceChart />
              </div>
            </BaseCol>
            <BaseCol span={12}>
              <div className="glass-panel">
                <ActivityCard />
              </div>
            </BaseCol>
            <BaseCol span={12}>
              <div className="glass-panel">
                <BarAnimationDelayChart />
              </div>
            </BaseCol>
          </BaseRow>
          <References />
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
    </S.DashboardWrapper>
  );

  const mobileAndTabletLayout = (
    <S.DashboardWrapper>
      <BaseRow gutter={[20, 16]}>
        <BaseCol span={24}>
          <div className="glass-panel">
            <PaidSubscribers />
          </div>
        </BaseCol>

        <BaseCol span={24}>
          <div className="glass-panel">
            <VisitorsPieChart />
          </div>
        </BaseCol>

        <BaseCol span={24}>
          <div className="glass-panel">
            <LineRaceChart />
          </div>
        </BaseCol>
        <BaseCol span={24}>
          <div className="glass-panel">
            <ActivityCard />
          </div>
        </BaseCol>
        <BaseCol span={24}>
          <div className="glass-panel">
            <BarAnimationDelayChart />
          </div>
        </BaseCol>
        <S.Space />
        {/* <BaseCol span={24}>
          <button onClick={goToBalancePage}>View Balance and Earnings</button>
        </BaseCol> */}
      </BaseRow>
    </S.DashboardWrapper>
  );

  return (
    <>
      <PageTitle>Relay Dashboard</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default MedicalDashboardPage;