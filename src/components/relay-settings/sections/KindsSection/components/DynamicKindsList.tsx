// src/components/relay-settings/sections/KindsSection/components/DynamicKindsList.tsx

import React from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { LiquidGlassCheckboxGroup, LiquidGlassCheckbox } from '@app/components/relay-settings/shared/LiquidGlassCheckbox/LiquidGlassCheckbox';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

interface DynamicKindsListProps {
  allowUnregisteredKinds: boolean;
  registeredKinds: number[];
  dynamicKinds: string[];
  selectedDynamicKinds: string[];
  onDynamicKindsChange: (values: string[]) => void;
  onRemoveKind: (kind: string) => void;
}

export const DynamicKindsList: React.FC<DynamicKindsListProps> = ({
  allowUnregisteredKinds,
  registeredKinds,
  dynamicKinds,
  selectedDynamicKinds,
  onDynamicKindsChange,
  onRemoveKind,
}) => {
  if (!dynamicKinds.length) {
    return null;
  }

  const handleChange = (checkedValues: CheckboxValueType[]) => {
    onDynamicKindsChange(checkedValues as string[]);
  };

  // Helper to extract kind number from string like "kind12345"
  const getKindNumber = (kindStr: string): number => {
    return parseInt(kindStr.replace('kind', ''), 10);
  };

  // Check if a dynamic kind is registered
  const isDynamicKindRegistered = (kindStr: string): boolean => {
    const kindNumber = getKindNumber(kindStr);
    return registeredKinds.includes(kindNumber);
  };

  return (
    <LiquidGlassCheckboxGroup
      style={{ paddingLeft: '1rem' }}
      className={`liquid-glass-checkbox custom-checkbox-group grid-checkbox-group large-label ${dynamicKinds.length ? 'dynamic-group ' : ''}`}
      value={selectedDynamicKinds}
      onChange={handleChange}
    >
      {dynamicKinds.map((kind) => {
        const isRegistered = isDynamicKindRegistered(kind);
        
        return (
          <div
            style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', alignItems: 'center' }}
            key={kind}
          >
            <div className="checkbox-container">
              <LiquidGlassCheckbox
                value={kind}
                disabled={!isRegistered && !allowUnregisteredKinds}
              />
              <S.CheckboxLabel
                isActive={isRegistered || allowUnregisteredKinds}
                style={{
                  fontSize: '1rem',
                  paddingRight: '.8rem',
                  paddingLeft: '.8rem',
                  opacity: (isRegistered || allowUnregisteredKinds) ? 1 : 0.6
                }}
              >
                {kind}
                {!isRegistered && <em> (Unregistered)</em>}
              </S.CheckboxLabel>
            </div>
            <BaseButton
              style={{ height: '2rem', width: '5rem', marginRight: '1rem' }}
              onClick={() => onRemoveKind(kind)}
            >
              Remove
            </BaseButton>
          </div>
        );
      })}
    </LiquidGlassCheckboxGroup>
  );
};

export default DynamicKindsList;
