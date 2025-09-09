import styled from 'styled-components';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BREAKPOINTS, media } from '@app/styles/themes/constants';

export const StoriesModal = styled(BaseModal)`
  @media only screen and (max-width: ${BREAKPOINTS.md - 0.02}px) {
    top: 0;
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close {
    z-index: 999999;
    top: 1rem;

    color: var(--text-secondary-color);
  }
`;

export const ArrowBtn = styled(BaseButton)`
  color: var(--text-nft-light-color);
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
              0 0 15px rgba(0, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.3), transparent);
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.4);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15),
                0 0 25px rgba(0, 255, 255, 0.3);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  @media only screen and ${media.xl} {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: -1.75rem;
  
  @media only screen and ${media.xl} {
    bottom: -2rem;
  }
  
  & > * {
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
    }
  }
`;

export const CardWrapper = styled.div`
  margin: 0 0.40625rem;
  width: min-content;
  position: relative;
  
  @media only screen and ${media.xl} {
    margin: 0 0.625rem;
  }
`;

export const ComponentWrapper = styled.div`
  padding-bottom: 5rem;
  position: relative;
  
  @media only screen and ${media.xl} {
    padding-bottom: 6rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--text-light-color);
  font-size: 1rem;
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0;
  min-height: 120px;

  @media only screen and ${media.xl} {
    gap: 0.625rem;
    min-height: 140px;
  }
`;