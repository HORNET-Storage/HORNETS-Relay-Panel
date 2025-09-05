import React from 'react';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import type { BaseSwitchProps } from '@app/components/common/BaseSwitch/BaseSwitch';

export interface LiquidToggleProps extends Omit<BaseSwitchProps, 'className'> {
  className?: string;
}

/**
 * LiquidToggle - A styled toggle switch matching the USD/Sats toggle appearance
 * Features a white knob with cyan/turquoise glow effect
 */
export const LiquidToggle: React.FC<LiquidToggleProps> = ({
  className = '',
  ...props
}) => {
  return (
    <BaseSwitch
      {...props}
      className={`balanceSwitch liquid-switch ${className}`}
    />
  );
};

export default LiquidToggle;