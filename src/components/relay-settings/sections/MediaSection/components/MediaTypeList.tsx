// src/components/relay-settings/sections/MediaSection/components/MediaTypeList.tsx

import React from 'react';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface MediaFormat {
  ext: string;
  mime: string;
}

interface MediaTypeListProps {
  formats: MediaFormat[];
  selectedFormats: string[];
  onChange: (values: string[]) => void;
  isActive: boolean;
}

export const MediaTypeList: React.FC<MediaTypeListProps> = ({
  formats,
  selectedFormats,
  onChange,
  isActive,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const options = formats.map((format) => {
    const isSelected = selectedFormats.includes(format.mime);
    const statusIcon = isSelected ? '✅' : '❌';
    
    return {
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2em', minWidth: '1.5rem' }}>{statusIcon}</span>
          <S.CheckboxLabel
            style={{
              color: themeObject[theme].textMain
            }}
            isActive={true}
          >
            {format.ext.toUpperCase()}
          </S.CheckboxLabel>
        </div>
      ),
      value: format.mime
    };
  });

  return (
    <BaseCheckbox.Group
      className="custom-checkbox-group grid-checkbox-group"
      options={options}
      value={selectedFormats}
      onChange={(checkedValues) => onChange(checkedValues as string[])}
      disabled={!isActive}
    />
  );
};

export default MediaTypeList;
