// src/components/relay-settings/sections/NetworkSection/NetworkSection.tsx

import React from 'react';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { ProtocolSelect } from './components/ProtocolSelect';
import { FileStorageToggle } from './components/FileStorageToggle';

export interface NetworkSectionProps {
  protocols: string[];
  isFileStorageActive: boolean;
  onProtocolsChange: (protocols: string[]) => void;
  onFileStorageChange: (active: boolean) => void;
}

export const NetworkSection: React.FC<NetworkSectionProps> = ({
  protocols,
  isFileStorageActive,
  onProtocolsChange,
  onFileStorageChange,
}) => {
  return (
    <CollapsibleSection header="Network Rules">
      <S.Card>
        <BaseCol span={24}>
          <ProtocolSelect 
            selectedProtocols={protocols}
            onChange={onProtocolsChange}
          />

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '1rem 0',
            boxShadow: '0 1px 3px rgba(255, 255, 255, 0.05)'
          }} />

          <FileStorageToggle
            isActive={isFileStorageActive}
            onChange={onFileStorageChange}
          />
        </BaseCol>
      </S.Card>
    </CollapsibleSection>
  );
};

export default NetworkSection;