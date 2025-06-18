import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';

export const Container = styled.div`
  width: 100%;
`;

export const TiersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const TiersTitle = styled.h3`
  margin: 0;
  color: var(--text-main-color);
  font-size: 16px;
  font-weight: 600;
`;

export const DataLimit = styled.span`
  font-weight: 500;
  color: var(--text-main-color);
`;

interface PriceProps {
  $isFree: boolean;
}

export const Price = styled.span<PriceProps>`
  font-weight: 600;
  color: ${({ $isFree }) => $isFree ? 'var(--success-color)' : 'var(--primary-color)'};
`;