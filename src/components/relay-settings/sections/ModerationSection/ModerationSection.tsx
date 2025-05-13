// src/components/relay-settings/sections/ModerationSection/ModerationSection.tsx

import React from 'react';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { ModerationModeSelect } from './components/ModerationModeSelect';

export interface ModerationSectionProps {
  moderationMode: string;
  onModerationModeChange: (mode: string) => void;
}

export const ModerationSection: React.FC<ModerationSectionProps> = ({
  moderationMode,
  onModerationModeChange,
}) => {
  return (
    <CollapsibleSection header="Moderation Settings">
      <S.Card>
        <BaseCol span={24}>
          <ModerationModeSelect 
            moderationMode={moderationMode}
            onChange={onModerationModeChange}
          />
          
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#c5d3e0' }}>
              Moderation mode determines how events with media are handled while pending moderation.
              <br />
              <br />
              <strong>Strict Mode:</strong> Events with media are not queryable while pending moderation, except by their authors.
              <br />
              <strong>Passive Mode:</strong> Events with media are queryable by everyone while pending moderation.
            </p>
          </div>
        </BaseCol>
      </S.Card>
    </CollapsibleSection>
  );
};

export default ModerationSection;
