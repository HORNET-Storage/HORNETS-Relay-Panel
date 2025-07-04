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
`;

export const CardWrapper = styled.div`
  margin: 0 0.40625rem;
  width: min-content;
  @media only screen and ${media.xl} {
    margin: 0 0.625rem;
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

  @media only screen and ${media.xl} {
    gap: 0.625rem;
  }
`;