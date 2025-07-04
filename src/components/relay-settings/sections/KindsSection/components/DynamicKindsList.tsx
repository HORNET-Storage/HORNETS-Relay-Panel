// src/components/relay-settings/sections/KindsSection/components/DynamicKindsList.tsx

import React from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

interface DynamicKindsListProps {
  dynamicKinds: string[];
  selectedDynamicKinds: string[];
  onDynamicKindsChange: (values: string[]) => void;
  onRemoveKind: (kind: string) => void;
  mode: string;
}

export const DynamicKindsList: React.FC<DynamicKindsListProps> = ({
  dynamicKinds,
  selectedDynamicKinds,
  onDynamicKindsChange,
  onRemoveKind,
  mode,
}) => {
  if (!dynamicKinds.length) {
    return null;
  }

  const handleChange = (checkedValues: CheckboxValueType[]) => {
    onDynamicKindsChange(checkedValues as string[]);
  };

  return (
    <BaseCheckbox.Group
      style={{ paddingLeft: '1rem' }}
      className={`custom-checkbox-group grid-checkbox-group large-label ${dynamicKinds.length ? 'dynamic-group ' : ''}${mode === 'blacklist' ? 'blacklist-mode-active ' : ''}`}
      value={selectedDynamicKinds}
      onChange={handleChange}
    >
      {dynamicKinds.map((kind) => (
        <div
          style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', alignItems: 'center' }}
          key={kind}
        >
          <div className="checkbox-container">
            <BaseCheckbox
              className={mode === 'blacklist' ? 'blacklist-mode-active' : ''}
              value={kind}
            />
            <S.CheckboxLabel
              isActive={true}
              style={{ fontSize: '1rem', paddingRight: '.8rem', paddingLeft: '.8rem' }}
            >
              {kind}
            </S.CheckboxLabel>
          </div>
          <BaseButton
            style={{ height: '2rem', width: '5rem', marginRight: '1rem' }}
            onClick={() => onRemoveKind(kind)}
          >
            Remove
          </BaseButton>
        </div>
      ))}
    </BaseCheckbox.Group>
  );
};

export default DynamicKindsList;
