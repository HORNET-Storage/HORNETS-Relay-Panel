import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import ImageModerationSettings from './ImageModerationSettings';
import ContentFilterSettings from './ContentFilterSettings';
import OllamaSettings from './OllamaSettings';
import WalletSettings from './WalletSettings';
import GeneralSettings from './GeneralSettings';
import RelayInfoSettings from './RelayInfoSettings';
import PushNotificationPanel from './panels/PushNotificationPanel';
import * as S from '@app/pages/DashboardPages/DashboardPage.styles';
import * as PageStyles from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '@app/components/relay-settings/shared/CollapsibleSection/CollapsibleSection';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';

const SettingsPage: React.FC = () => {
  return (
    <S.DashboardWrapper>
      <PageTitle>Advanced Settings</PageTitle>
      <BaseRow>
        <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
          <PageStyles.HeadingContainer>
            <PageStyles.LabelSpan>Advanced Settings</PageStyles.LabelSpan>
          </PageStyles.HeadingContainer>
          
          <CollapsibleSection header="General Settings">
            <GeneralSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Image Moderation">
            <ImageModerationSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Content Filter">
            <ContentFilterSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Ollama Settings">
            <OllamaSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Relay Info">
            <RelayInfoSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Wallet Settings">
            <WalletSettings />
          </CollapsibleSection>

          <CollapsibleSection header="Push Notifications">
            <PushNotificationPanel />
          </CollapsibleSection>
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
};

export default SettingsPage;
