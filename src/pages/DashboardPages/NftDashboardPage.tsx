import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import { TrendingCreators } from '@app/components/relay-dashboard/trending-creators/TrendingCreators';
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
    <BaseRow>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <BaseRow gutter={[60, 60]}>
          <BaseCol span={24}>
            <TrendingCreators />
          </BaseCol>

          <BaseCol span={12}>
            <VisitorsPieChart />
          </BaseCol>

          <BaseCol span={12}>
            <LineRaceChart />
          </BaseCol>
          <BaseCol span={12}>
            <ActivityCard />
          </BaseCol>
          <BaseCol span={12}>
            <BarAnimationDelayChart />
          </BaseCol>
        </BaseRow>
        <References />
      </S.LeftSideCol>

      <S.RightSideCol xl={8} xxl={7}>
        <div id="balance">
          <Balance />
        </div>
        <S.Space />
        <div id="total-earning">
          <TotalEarning />
        </div>
        <S.Space />
        <div id="activity-story">
          <ActivityStory />
        </div>
      </S.RightSideCol>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow gutter={[20, 24]}>
      <BaseCol span={24}>
        <TrendingCreators />
      </BaseCol>

      <BaseCol span={24}>
        <VisitorsPieChart />
      </BaseCol>

      <BaseCol span={24}>
        <LineRaceChart />
      </BaseCol>
      <BaseCol span={24}>
        <ActivityCard />
      </BaseCol>
      <BaseCol span={24}>
        <BarAnimationDelayChart />
      </BaseCol>
      <S.Space />
      {/* <BaseCol span={24}>
        <button onClick={goToBalancePage}>View Balance and Earnings</button>
      </BaseCol> */}
    </BaseRow>
  );

  return (
    <>
      <PageTitle>Relay Dashboard</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default MedicalDashboardPage;

// import React from 'react';
// import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
// import { References } from '@app/components/common/References/References';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { TrendingCreators } from '@app/components/relay-dashboard/trending-creators/TrendingCreators';
// import { RecentlyAddedNft } from '@app/components/relay-dashboard/recently-added/RecentlyAddedNft';
// import { TrendingCollections } from '@app/components/relay-dashboard/trending-collections/TrendingCollections';
// import { VisitorsPieChart } from '@app/components/charts/VisitorsPieChart';
// import { LineRaceChart } from '@app/components/charts/LineRaceChart/LineRaceChart';
// import { BarAnimationDelayChart } from '@app/components/charts/BarAnimationDelayChart/BarAnimationDelayChart';
// import { ActivityCard } from '@app/components/medical-dashboard/activityCard/ActivityCard';
// import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
// import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
// import { ActivityStory } from '@app/components/relay-dashboard/activityStory/ActivityStory';
// import { RecentActivity } from '@app/components/relay-dashboard/recentActivity/RecentActivity';
// import * as S from './DashboardPage.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

// const MedicalDashboardPage: React.FC = () => {
//   const { isDesktop } = useResponsive();

//   const desktopLayout = (
//     <BaseRow>
//       <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
//         <BaseRow gutter={[60, 60]}>
//           <BaseCol span={24}>
//             <TrendingCreators />
//           </BaseCol>

//           <BaseCol span={12}>
//             <VisitorsPieChart />
//           </BaseCol>

//           <BaseCol span={12}>
//             <LineRaceChart />
//           </BaseCol>
//           <BaseCol span={12}>
//             <ActivityCard />
//           </BaseCol>
//           <BaseCol span={12}>
//             <BarAnimationDelayChart />
//           </BaseCol>
//         </BaseRow>
//         <References />
//       </S.LeftSideCol>

//       <S.RightSideCol xl={8} xxl={7}>
//         <div id="balance">
//           <Balance />
//         </div>
//         <S.Space />
//         <div id="total-earning">
//           <TotalEarning />
//         </div>
//         <S.Space />
//         <S.ScrollWrapper id="activity-story">
//           <ActivityStory />
//         </S.ScrollWrapper>
//       </S.RightSideCol>
//     </BaseRow>
//   );

//   const mobileAndTabletLayout = (
//     <BaseRow gutter={[20, 24]}>
//       <BaseCol span={24}>
//         <TrendingCreators />
//       </BaseCol>

//       <BaseCol span={24}>
//         <VisitorsPieChart />
//       </BaseCol>

//       <BaseCol span={24}>
//         <LineRaceChart />
//       </BaseCol>
//       <BaseCol span={24}>
//         <ActivityCard />
//       </BaseCol>
//       <BaseCol span={24}>
//         <BarAnimationDelayChart />
//       </BaseCol>
//       <S.Space />
//       <BaseCol span={24}>
//         <div id="balance">
//           <Balance />
//         </div>
//       </BaseCol>
//       <S.Space />
//       <BaseCol span={24}>
//         <div id="total-earning">
//           <TotalEarning />
//         </div>
//       </BaseCol>

//       <S.Space />
//       <S.ScrollWrapper id="activity-story">
//         <ActivityStory />
//       </S.ScrollWrapper>
//     </BaseRow>
//   );

//   return (
//     <>
//       <PageTitle>NFT Dashboard</PageTitle>
//       {isDesktop ? desktopLayout : mobileAndTabletLayout}
//     </>
//   );
// };

// export default MedicalDashboardPage;
