// src/components/relay-settings/sections/NetworkSection/components/ProtocolSelect.tsx

import React from 'react';
import { Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

interface ProtocolSelectProps {
  selectedProtocols: string[];
  onChange: (protocols: string[]) => void;
}

export const ProtocolSelect: React.FC<ProtocolSelectProps> = ({
  selectedProtocols,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
      <S.LabelSpan style={{ marginBottom: '1rem' }}>
        {t('common.transportSetting')}
      </S.LabelSpan>
      <Checkbox.Group
        options={[
          { 
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2em', minWidth: '1.5rem' }}>
                  {selectedProtocols.includes('WebSocket') ? '✅' : '❌'}
                </span>
                <span style={{ fontSize: '.85rem' }}>WebSocket</span>
              </div>
            ), 
            value: 'WebSocket' 
          },
          { 
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2em', minWidth: '1.5rem' }}>
                  {selectedProtocols.includes('QUIC') ? '✅' : '❌'}
                </span>
                <span style={{ fontSize: '.85rem' }}>Libp2p QUIC</span>
              </div>
            ), 
            value: 'QUIC' 
          },
        ]}
        value={selectedProtocols}
        className="custom-checkbox-group"
        onChange={(checkedValues) => onChange(checkedValues as string[])}
        style={{
          display: 'grid',
          gridTemplateColumns: '10rem auto',
        }}
      />
    </div>
  );
};

export default ProtocolSelect;