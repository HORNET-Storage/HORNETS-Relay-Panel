import React from 'react';
import { BadgeProps } from 'antd';
import * as S from './LiquidBlueBadge.styles';

export interface LiquidBlueBadgeProps extends BadgeProps {
  variant?: 'default' | 'tab';
}

export const LiquidBlueBadge: React.FC<LiquidBlueBadgeProps> = ({ 
  variant = 'default',
  className,
  ...props 
}) => {
  const BadgeComponent = variant === 'tab' ? S.TabBadge : S.StyledLiquidBadge;
  
  return (
    <BadgeComponent 
      className={`${className || ''} ${variant === 'default' ? 'notification-badge' : ''}`}
      {...props}
    />
  );
};