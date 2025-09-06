import React from 'react';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import type { BaseSwitchProps } from '@app/components/common/BaseSwitch/BaseSwitch';

export interface LiquidToggleProps extends Omit<BaseSwitchProps, 'className'> {
  className?: string;
  variant?: 'balance' | 'network';
}

/**
 * LiquidToggle - A styled toggle switch
 * Features a white knob with emerald green glow effect for network/settings toggles
 */
export const LiquidToggle: React.FC<LiquidToggleProps> = ({
  className = '',
  variant = 'network',
  checkedChildren,
  unCheckedChildren,
  ...props
}) => {
  // For network variant, don't show any text
  const children = variant === 'network'
    ? { checkedChildren: '', unCheckedChildren: '' }
    : { checkedChildren, unCheckedChildren };

  const variantClass = variant === 'balance' ? 'balanceSwitch' : 'networkSwitch';
  
  return (
    <BaseSwitch
      {...props}
      {...children}
      className={`liquid-switch ${variantClass} ${className}`}
    />
  );
};

export default LiquidToggle;