// src/components/relay-settings/shared/SectionCard/SectionCard.tsx

import React, { ReactNode } from 'react';
import * as S from './SectionCard.styles';

export interface SectionCardProps {
  children: ReactNode;
  title?: string | ReactNode;
  extra?: ReactNode;
  info?: string | ReactNode;
  className?: string;
  padding?: boolean;
  bordered?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  children,
  title,
  extra,
  info,
  className = '',
  padding = false,
  bordered = false,
}) => {
  return (
    <S.CardWrapper className={className}>
      {(title || extra) && (
        <S.HeaderWrapper>
          {title && <S.Title>{title}</S.Title>}
          {extra && <div>{extra}</div>}
        </S.HeaderWrapper>
      )}

      <S.ContentWrapper 
        className={`${padding ? 'with-padding' : ''} ${bordered ? 'with-border' : ''}`}
      >
        {children}
      </S.ContentWrapper>

      {info && (
        <S.InfoCard>
          <small>{info}</small>
        </S.InfoCard>
      )}
    </S.CardWrapper>
  );
};

export default SectionCard;