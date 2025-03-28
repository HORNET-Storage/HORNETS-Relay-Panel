import React, { forwardRef } from 'react';
import { Badge, BadgeProps } from 'antd';

// This component wraps Ant Design's Badge component with proper ref forwarding
// to fix the findDOMNode deprecation warnings in React StrictMode

export const RefForwardingBadge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  return (
    <span ref={ref}>
      <Badge {...props} />
    </span>
  );
});

RefForwardingBadge.displayName = 'RefForwardingBadge';

export default RefForwardingBadge;
