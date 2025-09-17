// src/components/relay-settings/sections/KindsSection/components/KindsList.tsx

import React from 'react';
import { LiquidGlassCheckboxGroup, LiquidGlassCheckbox } from '@app/components/relay-settings/shared/LiquidGlassCheckbox/LiquidGlassCheckbox';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { noteOptions, categories } from '@app/constants/relaySettings';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';

interface KindsListProps {
  selectedKinds: string[];
  isKindsActive: boolean;
  onKindsChange: (values: string[]) => void;
}

export const KindsList: React.FC<KindsListProps> = ({
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

  // All kinds in our list are registered kinds (we know about them)
  // The checkbox state determines if they're enabled or disabled
  
  return (
    <LiquidGlassCheckboxGroup
      className="liquid-glass-checkbox large-label"
      value={selectedKinds}
      onChange={(checkedValues) => onKindsChange(checkedValues as string[])}
      disabled={!isKindsActive}
    >
      {groupedNoteOptions.map((group) => (
        <div key={group.id} style={{ paddingBottom: '2rem' }}>
          <h3 className="checkboxHeader w-full">{group.name}</h3>
          <div className="custom-checkbox-group grid-checkbox-group large-label">
            {group.notes.map((note) => {
              return (
                <div
                  className="checkbox-container"
                  style={{
                    paddingLeft: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  key={note.kindString}
                >
                  <LiquidGlassCheckbox
                    value={note.kindString}
                    disabled={!isKindsActive}
                  />
                  <S.CheckboxLabel
                    isActive={isKindsActive}
                    style={{
                      paddingRight: '.8rem',
                      paddingLeft: '.8rem',
                      color: themeObject[theme].textMain
                    }}
                  >
                    {t(`kind${note.kind}`)} - {' '}
                    <span style={{ fontWeight: 'normal' }}>
                      {note.description}
                    </span>
                  </S.CheckboxLabel>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </LiquidGlassCheckboxGroup>
  );
};

export default KindsList;
