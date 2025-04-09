// src/components/relay-settings/sections/NetworkSection/components/FileStorageToggle.tsx

import React from 'react';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { useTranslation } from 'react-i18next';

interface FileStorageToggleProps {
  isActive: boolean;
  onChange: (checked: boolean) => void;
}

export const FileStorageToggle: React.FC<FileStorageToggleProps> = ({
  isActive,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <S.LabelSpan style={{ marginBottom: '1rem' }}>
        {t('File Storage')}
      </S.LabelSpan>
      <BaseCheckbox
        checked={isActive}
        onChange={(e) => onChange(e.target.checked)}
        style={{ fontSize: '.85rem' }}
      >
        Enable/Disable
      </BaseCheckbox>
    </div>
  );
};

export default FileStorageToggle;