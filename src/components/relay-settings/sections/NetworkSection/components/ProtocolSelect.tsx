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
          { label: 'WebSocket', value: 'WebSocket', style: { fontSize: '.85rem' } },
          { label: 'Libp2p QUIC', value: 'QUIC', style: { fontSize: '.85rem' } },
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