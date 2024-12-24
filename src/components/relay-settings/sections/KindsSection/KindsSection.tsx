// src/components/relay-settings/sections/KindsSection/KindsSection.tsx

import React from 'react';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { KindsList } from './components/KindsList';
import { AddKindForm } from './components/AddKindForm';
import { DynamicKindsList } from './components/DynamicKindsList';
import { SectionCard } from '../../shared/SectionCard';

export interface KindsSectionProps {
  mode: string;
  isKindsActive: boolean;
  selectedKinds: string[];
  dynamicKinds: string[];
  selectedDynamicKinds: string[];
  onKindsActiveChange: (active: boolean) => void;
  onKindsChange: (values: string[]) => void;
  onDynamicKindsChange: (values: string[]) => void;
  onAddKind: (kind: string) => void;
  onRemoveKind: (kind: string) => void;
}

export const KindsSection: React.FC<KindsSectionProps> = ({
  mode,
  isKindsActive,
  selectedKinds,
  dynamicKinds,
  selectedDynamicKinds,
  onKindsActiveChange,
  onKindsChange,
  onDynamicKindsChange,
  onAddKind,
  onRemoveKind,
}) => {
  const header = mode !== 'smart' ? 'Blacklisted Kind Numbers' : 'Kind Numbers';

  return (
    <CollapsibleSection header={header}>
      <SectionCard padding={true}>
        <div className="flex-col w-full">
          {mode !== 'unlimited' && mode !== '' && (
            <div className="switch-container">
              <BaseSwitch
                checkedChildren="ON"
                unCheckedChildren="OFF"
                checked={isKindsActive}
                onChange={() => onKindsActiveChange(!isKindsActive)}
              />
            </div>
          )}

          <KindsList
            mode={mode}
            selectedKinds={selectedKinds}
            isKindsActive={isKindsActive}
            onKindsChange={onKindsChange}
          />

          <AddKindForm 
            mode={mode}
            onAddKind={onAddKind}
          />

          <DynamicKindsList
            mode={mode}
            dynamicKinds={dynamicKinds}
            selectedDynamicKinds={selectedDynamicKinds}
            onDynamicKindsChange={onDynamicKindsChange}
            onRemoveKind={onRemoveKind}
          />
        </div>
      </SectionCard>
    </CollapsibleSection>
  );
};

export default KindsSection;