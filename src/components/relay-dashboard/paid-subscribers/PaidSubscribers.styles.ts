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
  color: #ffffff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  /* Match liquid glass styling of Send/Receive buttons */
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.25), /* from-teal-500/25 */
    rgba(6, 182, 212, 0.20),  /* via-cyan-500/20 */
    rgba(34, 197, 94, 0.25)   /* to-green-500/25 */
  ) !important;
  
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 212, 191, 0.25) !important;
  
  box-shadow:
    inset 0 2px 8px rgba(45, 212, 191, 0.30),
    0 0 15px rgba(6, 182, 212, 0.20);
  
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Glass overlay effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.10) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
  
  &:hover {
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.30),
      rgba(6, 182, 212, 0.25),
      rgba(34, 197, 94, 0.30)
    ) !important;
    
    border-color: rgba(45, 212, 191, 0.35) !important;
    transform: translateY(-2px);
    
    box-shadow:
      inset 0 3px 12px rgba(45, 212, 191, 0.35),
      0 0 25px rgba(6, 182, 212, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.35),
      rgba(6, 182, 212, 0.30),
      rgba(34, 197, 94, 0.35)
    ) !important;
  }
  
  /* Icon glow effect */
  .anticon {
    filter: drop-shadow(0 0 3px rgba(45, 212, 191, 0.4));
  }
  
  @media only screen and ${media.xl} {
    width: 32px;
    height: 32px;
    min-width: 32px;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 0.625rem;
  align-items: center;
  padding-right: 12px;
  
  @media only screen and ${media.xl} {
    gap: 0.625rem;
    padding-right: 16px;
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
  border-radius: 7px;
  overflow: hidden;
  background: var(--additional-background-color);
  border: 1px solid var(--border-nft-color);
  
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