import React from 'react';
import { ButtonProps } from 'antd';
import * as S from './LiquidBlueButton.styles';

export interface LiquidBlueButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const LiquidBlueButton: React.FC<LiquidBlueButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  return (
    <S.StyledLiquidButton $variant={variant} {...props}>
      {children}
    </S.StyledLiquidButton>
  );
};

export default LiquidBlueButton;