import React from 'react';
import { Radio, Space, Typography } from 'antd';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface ModerationModeSelectProps {
  moderationMode: string;
  onChange: (mode: string) => void;
}

export const ModerationModeSelect: React.FC<ModerationModeSelectProps> = ({
  moderationMode,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <S.LabelSpan style={{ marginBottom: '1rem' }}>
        {t('Moderation Mode')}
      </S.LabelSpan>
      
      <Radio.Group 
        value={moderationMode} 
        onChange={(e) => onChange(e.target.value)}
        style={{ marginBottom: '1rem' }}
      >
        <Space direction="vertical">
          <Radio value="strict">
            <Text strong>Strict Mode</Text>
            <div>
              <Text style={{ color: '#c5d3e0' }}>
                Events with media are not queryable while pending moderation, except by their authors.
              </Text>
            </div>
          </Radio>
          
          <Radio value="passive">
            <Text strong>Passive Mode</Text>
            <div>
              <Text style={{ color: '#c5d3e0' }}>
                Events with media are queryable by everyone while pending moderation.
              </Text>
            </div>
          </Radio>
        </Space>
      </Radio.Group>
    </div>
  );
};

export default ModerationModeSelect;
