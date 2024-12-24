// src/components/relay-settings/sections/SubscriptionSection/SubscriptionSection.tsx

import React from 'react';
import { Collapse } from 'antd';
import styled from 'styled-components';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import SubscriptionTiersManager from '@app/components/SubscriptionTiersManager';
import { SubscriptionTier } from '@app/constants/relaySettings';
import { CollapsibleSection } from '../../shared/CollapsibleSection';
const StyledPanel = styled(Collapse.Panel)``;

interface SubscriptionSectionProps {
  tiers: SubscriptionTier[];
  onChange: (tiers: SubscriptionTier[]) => void;
  freeTierEnabled: boolean;
  freeTierLimit: string;
  onFreeTierChange: (enabled: boolean, limit: string) => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  tiers,
  onChange,
  freeTierEnabled,
  freeTierLimit,
  onFreeTierChange,
}) => {
  return (
    <CollapsibleSection header="Subscription Tiers">
        <S.Card>
          <SubscriptionTiersManager
            tiers={tiers || []}
            onChange={onChange}
            freeTierEnabled={freeTierEnabled}
            freeTierLimit={freeTierLimit}
            onFreeTierChange={onFreeTierChange}
          />
        </S.Card>
    </CollapsibleSection>
  );
};

export default SubscriptionSection;