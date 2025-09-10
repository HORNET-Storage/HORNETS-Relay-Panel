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
  border-radius: 50%;
  width: 32px;
  height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15),
                0 0 20px rgba(0, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media only screen and ${media.xl} {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding-right: 1.5rem;
  
  @media only screen and ${media.xl} {
    gap: 0.75rem;
    padding-right: 2rem;
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
  position: relative;
  padding-bottom: 12px;
  
  /* Add padding to align splide track with title */
  .splide__track {
    padding: 0 1.5rem;
    
    @media only screen and ${media.xl} {
      padding: 0 2rem;
    }
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
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.5rem 12px 1.5rem;

  @media only screen and ${media.xl} {
    gap: 0.625rem;
    padding: 0 2rem 12px 2rem;
  }
`;