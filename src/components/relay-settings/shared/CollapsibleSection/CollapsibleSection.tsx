// src/components/relay-settings/shared/CollapsibleSection/CollapsibleSection.tsx

import React, { ReactNode } from 'react';
import { CollapsePanelProps } from 'antd';
import * as S from './CollapsibleSection.styles';

export interface CollapsibleSectionProps extends Omit<CollapsePanelProps, 'header' | 'key'> {
  header: ReactNode;
  children: ReactNode;
  defaultActive?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  header,
  children,
  defaultActive = false,
  className = 'centered-header',
  ...rest
}) => {
  return (
    <S.StyledCollapse
      defaultActiveKey={defaultActive ? ['1'] : undefined}
      className={className}
      bordered={false}
    >
      <S.StyledPanel
        header={header}
        key="1"
        {...rest}
      >
        {children}
      </S.StyledPanel>
    </S.StyledCollapse>
  );
};

export default CollapsibleSection;