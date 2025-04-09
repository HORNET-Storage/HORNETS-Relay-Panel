// src/components/relay-settings/sections/KindsSection/components/KindsList.tsx

import React from 'react';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { noteOptions, categories } from '@app/constants/relaySettings';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';

interface KindsListProps {
  mode: string;
  selectedKinds: string[];
  isKindsActive: boolean;
  onKindsChange: (values: string[]) => void;
}

export const KindsList: React.FC<KindsListProps> = ({
  mode,
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

  return (
    <BaseCheckbox.Group
      className="large-label"
      value={selectedKinds}
      onChange={(checkedValues) => onKindsChange(checkedValues as string[])}
      disabled={mode !== 'smart' ? false : !isKindsActive}
    >
      {groupedNoteOptions.map((group) => (
        <div key={group.id} style={{ paddingBottom: '2rem' }}>
          <h3 className="checkboxHeader w-full">{group.name}</h3>
          <div className="custom-checkbox-group grid-checkbox-group large-label">
            {group.notes.map((note) => (
              <div className="checkbox-container" style={{ paddingLeft: '1rem' }} key={note.kindString}>
                <BaseCheckbox
                  value={note.kindString}
                  className={mode === 'unlimited' ? 'blacklist-mode-active' : ''}
                  disabled={mode !== 'smart' ? false : !isKindsActive}
                />
                <S.CheckboxLabel
                  isActive={mode !== 'smart' ? true : isKindsActive}
                  style={{
                    paddingRight: '.8rem',
                    paddingLeft: '.8rem',
                    color: themeObject[theme].textMain
                  }}
                >
                  {t(`kind${note.kind}`)} - {' '}
                  <span style={{ fontWeight: 'normal' }}>{note.description}</span>
                </S.CheckboxLabel>
              </div>
            ))}
          </div>
        </div>
      ))}
    </BaseCheckbox.Group>
  );
};

export default KindsList;