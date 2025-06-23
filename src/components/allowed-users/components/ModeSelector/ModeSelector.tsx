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
    label: 'Free - Public Relay',
    description: 'Open access with optional free tiers',
    color: '#1890ff'
  },
  paid: {
    label: 'Paid - Subscription Tiers', 
    description: 'Subscription-based access control',
    color: '#52c41a'
  },
  exclusive: {
    label: 'Free - Invite Only',
    description: 'Invite-only access with manual NPUB management',
    color: '#722ed1'
  },
  personal: {
    label: 'Free - Only Me',
    description: 'Personal relay for single user with unlimited access',
    color: '#fa541c'
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