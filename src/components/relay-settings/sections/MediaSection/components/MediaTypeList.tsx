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
  mode: string;
}

export const MediaTypeList: React.FC<MediaTypeListProps> = ({
  formats,
  selectedFormats,
  onChange,
  isActive,
  mode,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const options = formats.map((format) => ({
    label: (
      <S.CheckboxLabel
        style={{
          color: themeObject[theme].textMain
        }}
        isActive={true}
      >
        {format.ext.toUpperCase()}
      </S.CheckboxLabel>
    ),
    value: format.mime
  }));

  return (
    <BaseCheckbox.Group
      className={`custom-checkbox-group grid-checkbox-group ${mode === 'blacklist' ? 'blacklist-mode-active' : ''}`}
      options={options}
      value={selectedFormats}
      onChange={(checkedValues) => onChange(checkedValues as string[])}
      disabled={mode !== 'whitelist' ? false : !isActive}
    />
  );
};

export default MediaTypeList;
