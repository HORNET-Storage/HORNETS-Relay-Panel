import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { media } from '@app/styles/themes/constants';
import { BaseDivider } from '@app/components/common/BaseDivider/BaseDivider';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';

export const NoticesOverlayMenu = styled.div`
  max-width: 15rem;

  @media only screen and ${media.md} {
    max-width: 25rem;
  }
`;

export const NotificationsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  margin-bottom: 15px;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-color);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 3px;
  }
`;

export const SplitDivider = styled(BaseDivider)`
  margin: 0 0.5rem;
`;

export const LinkBtn = styled(BaseButton)`
  &.ant-btn {
    padding: 0;
    font-size: 0.875rem;
    height: unset;
    line-height: unset;
  }
`;

export const Btn = styled(BaseButton)`
  width: 100%;
`;

export const Text = styled(BaseTypography.Text)`
  display: block;
  text-align: center;
`;
