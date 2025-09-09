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
  padding-bottom: 2.56rem;
  position: relative;
  
  @media only screen and ${media.xl} {
    padding-bottom: 3.07rem;
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