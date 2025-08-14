// src/components/relay-settings/sections/KindsSection/components/KindsList.tsx

import React from 'react';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { noteOptions, categories } from '@app/constants/relaySettings';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';

interface KindsListProps {
  allowUnregisteredKinds: boolean;
  registeredKinds: number[];
  selectedKinds: string[];
  isKindsActive: boolean;
  onKindsChange: (values: string[]) => void;
}

export const KindsList: React.FC<KindsListProps> = ({
  allowUnregisteredKinds,
  registeredKinds,
  selectedKinds,
  isKindsActive,
  onKindsChange,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { t } = useTranslation();

  const groupedNoteOptions = categories.map((category) => ({
    ...category,
    notes: noteOptions.filter((note) => note.category === category.id),
  }));

  // Helper to check if a kind is registered
  const isRegisteredKind = (kindNumber: number) => {
    return registeredKinds.includes(kindNumber);
  };

  // Helper to get status icon for a kind
  const getKindStatusIcon = (kindNumber: number, isSelected: boolean) => {
    const isRegistered = isRegisteredKind(kindNumber);
    
    if (isRegistered) {
      return isSelected ? '✅' : '❌';
    } else {
      return allowUnregisteredKinds ? '⚠️' : '🚫';
    }
  };

  return (
    <BaseCheckbox.Group
      className="large-label"
      value={selectedKinds}
      onChange={(checkedValues) => onKindsChange(checkedValues as string[])}
      disabled={!isKindsActive}
    >
      {groupedNoteOptions.map((group) => (
        <div key={group.id} style={{ paddingBottom: '2rem' }}>
          <h3 className="checkboxHeader w-full">{group.name}</h3>
          <div className="custom-checkbox-group grid-checkbox-group large-label">
            {group.notes.map((note) => {
              const isRegistered = isRegisteredKind(note.kind);
              const isSelected = selectedKinds.includes(note.kindString);
              const statusIcon = getKindStatusIcon(note.kind, isSelected);
              
              return (
                <div className="checkbox-container" style={{ paddingLeft: '1rem' }} key={note.kindString}>
                  <span style={{ marginRight: '0.5rem', fontSize: '1.2em' }}>{statusIcon}</span>
                  <BaseCheckbox
                    value={note.kindString}
                    disabled={!isKindsActive || !isRegistered}
                  />
                  <S.CheckboxLabel
                    isActive={isKindsActive && isRegistered}
                    style={{
                      paddingRight: '.8rem',
                      paddingLeft: '.8rem',
                      color: isRegistered ? themeObject[theme].textMain : themeObject[theme].textSecondary,
                      opacity: isRegistered ? 1 : 0.6
                    }}
                  >
                    {t(`kind${note.kind}`)} - {' '}
                    <span style={{ fontWeight: 'normal' }}>
                      {note.description}
                      {!isRegistered && <em> (Unregistered)</em>}
                    </span>
                  </S.CheckboxLabel>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </BaseCheckbox.Group>
  );
};

export default KindsList;
