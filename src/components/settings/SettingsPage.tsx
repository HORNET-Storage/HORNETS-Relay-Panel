import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import ImageModerationSettings from './ImageModerationSettings';
import ContentFilterSettings from './ContentFilterSettings';
import OllamaSettings from './OllamaSettings';
import WalletSettings from './WalletSettings';
import GeneralSettings from './GeneralSettings';
import RelayInfoSettings from './RelayInfoSettings';
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';
import { CollapsibleSection } from '@app/components/relay-settings/shared/CollapsibleSection/CollapsibleSection';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

const SettingsPage: React.FC = () => {
  return (
    <DashboardWrapper>
      <PageTitle>Advanced Settings</PageTitle>
      
      <BaseRow>
        <BaseCol span={24}>
          <CollapsibleSection header="General Settings">
            <S.Card>
              <GeneralSettings />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Image Moderation">
            <S.Card>
              <ImageModerationSettings />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Content Filter">
            <S.Card>
              <ContentFilterSettings />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Ollama">
            <S.Card>
              <OllamaSettings />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Relay Info">
            <S.Card>
              <RelayInfoSettings />
            </S.Card>
          </CollapsibleSection>
          
          <CollapsibleSection header="Wallet">
            <S.Card>
              <WalletSettings />
            </S.Card>
          </CollapsibleSection>
        </BaseCol>
      </BaseRow>
    </DashboardWrapper>
  );
};

export default SettingsPage;
