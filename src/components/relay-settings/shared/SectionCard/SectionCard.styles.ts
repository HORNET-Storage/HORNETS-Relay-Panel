// src/components/relay-settings/shared/SectionCard/SectionCard.styles.ts

import styled from 'styled-components';
import { BORDER_RADIUS, FONT_SIZE } from '@app/styles/themes/constants';

export const CardWrapper = styled.div`
  padding: 1rem .5rem;
  background: var(--background-color);
  border-radius: ${BORDER_RADIUS};
  margin-bottom: 1rem;
`;

export const InfoCard = styled.div`
  display: flex;
  gap: 0.625rem;
  padding: 1rem;
  background: var(--background-secondary-color);
  border-radius: ${BORDER_RADIUS};
  margin: 1rem 0;

  small {
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Title = styled.h6`
  font-size: ${FONT_SIZE.md};
  font-weight: 500;
  margin-bottom: 0;
`;

export const ContentWrapper = styled.div`

  &.with-padding {
    padding: 1rem 1.25rem;
  }

  &.with-border {
    border-top: 1px solid var(--border-color);
  }
`;