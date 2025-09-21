import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { media } from '@app/styles/themes/constants';
import { BaseDivider } from '@app/components/common/BaseDivider/BaseDivider';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

export const NoticesOverlayMenu = styled.div`
  max-width: 100%;

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
    background-color: rgba(255, 255, 255, 0.3);
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
  
  &.ant-btn-ghost {
    color: #00ffff;
    border-color: rgba(0, 255, 255, 0.3);
    background: rgba(0, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    
    &:hover:not(:disabled) {
      color: #00ffff !important;
      border-color: rgba(0, 255, 255, 0.5) !important;
      background: rgba(0, 255, 255, 0.1) !important;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }
    
    &:active {
      background: rgba(0, 255, 255, 0.15) !important;
    }
  }
  
  &.ant-btn-link {
    color: #00ffff;
    
    a {
      color: #00ffff;
      
      &:hover {
        color: #40ffff;
      }
    }
    
    &:hover:not(:disabled) {
      color: #40ffff !important;
    }
  }
`;

export const Text = styled(BaseTypography.Text)`
  display: block;
  text-align: center;
`;
export const TransactionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: .5rem;
  margin-bottom: .5rem;
  gap: 3rem;
`;
export const RootNotification = styled(BaseNotification)`
width: 100%;

`;
export const NotificationsWrapper = styled(BaseSpace)`
   .ant-space.ant-space-horizontal {
    width: 100%;
  }
`;
export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
