// src/components/relay-settings/sections/NetworkSection/components/FileStorageToggle.tsx

import React from 'react';
import { LiquidToggle } from '@app/components/common/LiquidToggle';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <LiquidToggle
          checked={isActive}
          onChange={onChange}
        />
        <span style={{ fontSize: '.85rem' }}>
          {isActive ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  );
};

export default FileStorageToggle;