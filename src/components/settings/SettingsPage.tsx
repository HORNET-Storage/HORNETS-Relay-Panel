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
            <GeneralSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Image Moderation">
            <ImageModerationSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Content Filter">
            <ContentFilterSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Ollama">
            <OllamaSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Relay Info">
            <RelayInfoSettings />
          </CollapsibleSection>
          
          <CollapsibleSection header="Wallet">
            <WalletSettings />
          </CollapsibleSection>
        </BaseCol>
      </BaseRow>
    </DashboardWrapper>
  );
};

export default SettingsPage;
