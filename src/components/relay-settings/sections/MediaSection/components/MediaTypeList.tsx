// src/components/relay-settings/sections/MediaSection/components/MediaTypeList.tsx

import React from 'react';
import { LiquidGlassCheckboxGroup } from '@app/components/relay-settings/shared/LiquidGlassCheckbox/LiquidGlassCheckbox';
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
    return {
      label: (
        <S.CheckboxLabel
          style={{
            color: themeObject[theme].textMain,
            marginLeft: '0.5rem'
          }}
          isActive={true}
        >
          {format.ext.toUpperCase()}
        </S.CheckboxLabel>
      ),
      value: format.mime
    };
  });

  return (
    <LiquidGlassCheckboxGroup
      className="liquid-glass-checkbox custom-checkbox-group grid-checkbox-group"
      options={options}
      value={selectedFormats}
      onChange={(checkedValues) => onChange(checkedValues as string[])}
      disabled={!isActive}
    />
  );
};

export default MediaTypeList;
