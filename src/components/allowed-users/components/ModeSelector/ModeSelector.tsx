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
  'only-me': {
    label: 'Only Me',
    subtitle: '[Free]',
    description: 'Personal relay for single user with unlimited access',
    color: '#fa541c'
  },
  'invite-only': {
    label: 'Invite Only',
    subtitle: '[Free]',
    description: 'Invite-only access with manual NPUB management',
    color: '#722ed1'
  },
  'public': {
    label: 'Public Relay',
    subtitle: '[Free]',
    description: 'Open access with optional free tiers',
    color: '#1890ff'
  },
  'subscription': {
    label: 'Subscription',
    subtitle: '[Paid]',
    description: 'Subscription-based access control',
    color: '#52c41a'
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
        {(['only-me', 'invite-only', 'public', 'subscription'] as AllowedUsersMode[]).map((mode) => {
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
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '2px',
                  lineHeight: '1.2'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{info.label}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '400' }}>{info.subtitle}</div>
                </div>
              </S.ModeButton>
            </Tooltip>
          );
        })}
      </S.ModeGrid>
      
      <S.ModeDescription>
        <S.DescriptionText>
          <strong>{MODE_INFO[currentMode]?.label || 'Unknown Mode'}:</strong> {MODE_INFO[currentMode]?.description || 'No description available'}
        </S.DescriptionText>
      </S.ModeDescription>
    </S.Container>
  );
};
