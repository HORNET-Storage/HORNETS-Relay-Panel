// src/components/relay-settings/shared/SectionCard/SectionCard.styles.ts

import styled from 'styled-components';
import { BORDER_RADIUS, FONT_SIZE } from '@app/styles/themes/constants';

export const CardWrapper = styled.div`
  /* Liquid Glass Card Styling */
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${BORDER_RADIUS};
  margin-bottom: 1rem;

  /* Glass effect shadows */
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 2px 3px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.15);

  /* Smooth transitions */
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.15),
      inset 0 2px 3px rgba(255, 255, 255, 0.25),
      inset 0 -1px 2px rgba(0, 0, 0, 0.2);
  }
`;

export const InfoCard = styled.div`
  /* Liquid Glass Info Card */
  display: flex;
  gap: 0.625rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${BORDER_RADIUS};
  margin: 1rem 0;

  /* Glass effect */
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);

  /* Smooth transitions */
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-1px);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.12),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  small {
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25;
    color: rgba(255, 255, 255, 0.9);
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
    padding: 1rem 0;
  }

  &.with-border {
    border-top: 1px solid var(--border-color);
  }
`;