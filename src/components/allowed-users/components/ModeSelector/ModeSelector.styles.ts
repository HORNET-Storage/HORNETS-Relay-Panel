import styled from 'styled-components';
import { Button } from 'antd';
import { media } from '@app/styles/themes/constants';

export const Container = styled.div`
  width: 100%;
`;

export const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  ${media.md} {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 0.75rem;
  }
`;

interface ModeButtonProps {
  $isActive: boolean;
  $color: string;
}

export const ModeButton = styled(Button)<ModeButtonProps>`
  height: 80px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;

  ${({ $isActive, $color }) => $isActive && `
    background-color: ${$color} !important;
    border-color: ${$color} !important;
    box-shadow: 0 4px 12px ${$color}33;
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  ${media.md} {
    height: 70px;
  }
`;

export const ModeDescription = styled.div`
  padding: 1rem;
  background: var(--background-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color-base);
`;

export const DescriptionText = styled.p`
  margin: 0;
  color: var(--text-main-color);
  font-size: 14px;
  line-height: 1.5;
`;