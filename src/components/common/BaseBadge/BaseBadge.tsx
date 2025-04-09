import React from 'react';
import { BadgeProps, Badge } from 'antd';
import { mapBadgeStatus } from '@app/utils/utils';
import * as S from './BaseBadge.styles';
import { RefForwardingBadge } from '../RefForwardingBadge/RefForwardingBadge';

export type BaseBadgeProps = BadgeProps;

interface BaseBadgeInterface extends React.FC<BaseBadgeProps> {
  Ribbon: typeof Badge.Ribbon;
}

// Use the ref-forwarding badge component instead of the standard one
export const BaseBadge: BaseBadgeInterface = ({ status, children, count, ...props }) => {
  // Determine badge props based on status and count
  const badgeProps = status 
    ? (count ? { count, severity: mapBadgeStatus(status) } : { status }) 
    : { count };
  
  // Wrap the Badge in a div to avoid findDOMNode issues
  return (
    <div style={{ display: 'inline-flex' }}>
      <RefForwardingBadge {...badgeProps} {...props}>
        {children}
      </RefForwardingBadge>
    </div>
  );
};

BaseBadge.Ribbon = Badge.Ribbon;
