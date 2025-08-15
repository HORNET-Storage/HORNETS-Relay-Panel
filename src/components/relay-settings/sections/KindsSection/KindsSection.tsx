// src/components/relay-settings/sections/KindsSection/KindsSection.tsx

import React from 'react';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { KindsList } from './components/KindsList';
import { AddKindForm } from './components/AddKindForm';
import { DynamicKindsList } from './components/DynamicKindsList';

export interface KindsSectionProps {
  allowUnregisteredKinds: boolean;
  registeredKinds: number[];
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
  allowUnregisteredKinds,
  registeredKinds,
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
  const header = 'Event Kinds Configuration';

  return (
    <CollapsibleSection header={header}>
      <S.Card>
        <div className="flex-col w-full">
          <div className="switch-container">
            <BaseSwitch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked={isKindsActive}
              onChange={() => onKindsActiveChange(!isKindsActive)}
            />
          </div>

          <KindsList
            selectedKinds={selectedKinds}
            isKindsActive={isKindsActive}
            onKindsChange={onKindsChange}
          />

          <AddKindForm
            onAddKind={onAddKind}
          />

          <DynamicKindsList
            allowUnregisteredKinds={allowUnregisteredKinds}
            registeredKinds={registeredKinds}
            dynamicKinds={dynamicKinds}
            selectedDynamicKinds={selectedDynamicKinds}
            onDynamicKindsChange={onDynamicKindsChange}
            onRemoveKind={onRemoveKind}
          />
        </div>
      </S.Card>
    </CollapsibleSection>
  );
};

export default KindsSection;
