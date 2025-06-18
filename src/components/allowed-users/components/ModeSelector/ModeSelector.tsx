import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { AllowedUsersMode } from '@app/types/allowedUsers.types';
import * as S from './ModeSelector.styles';

interface ModeSelectorProps {
  currentMode: AllowedUsersMode;
  onModeChange: (mode: AllowedUsersMode) => void;
  disabled?: boolean;
}

const MODE_INFO = {
  free: {
    label: 'Free Mode',
    description: 'Open access with optional free tiers',
    color: '#1890ff'
  },
  paid: {
    label: 'Paid Mode', 
    description: 'Subscription-based access control',
    color: '#52c41a'
  },
  exclusive: {
    label: 'Exclusive Mode',
    description: 'Invite-only access with manual NPUB management',
    color: '#722ed1'
  }
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  disabled = false
}) => {
  return (
    <S.Container>
      <S.ModeGrid>
        {(Object.keys(MODE_INFO) as AllowedUsersMode[]).map((mode) => {
          const info = MODE_INFO[mode];
          const isActive = currentMode === mode;
          
          return (
            <Tooltip key={mode} title={info.description}>
              <S.ModeButton
                type={isActive ? 'primary' : 'default'}
                size="large"
                onClick={() => onModeChange(mode)}
                disabled={disabled}
                $isActive={isActive}
                $color={info.color}
              >
                {info.label}
              </S.ModeButton>
            </Tooltip>
          );
        })}
      </S.ModeGrid>
      
      <S.ModeDescription>
        <S.DescriptionText>
          <strong>{MODE_INFO[currentMode].label}:</strong> {MODE_INFO[currentMode].description}
        </S.DescriptionText>
      </S.ModeDescription>
    </S.Container>
  );
};