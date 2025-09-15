import styled from 'styled-components';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';

export const StyledNotificationPopover = styled(BasePopover)`
  // Disable all animations and transitions
  &.ant-popover {
    animation: none !important;
    transition: none !important;
  }
  
  .ant-popover-content {
    background: rgba(0, 255, 255, 0.03) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(0, 255, 255, 0.15) !important;
    box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    animation: none !important;
    transition: none !important;
  }
  
  .ant-popover-inner {
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    animation: none !important;
    transition: none !important;
  }
  
  .ant-popover-arrow {
    display: none !important;
  }
  
  // Override any motion or transition on the popover
  &.ant-popover-placement-bottomRight,
  &.ant-popover-placement-bottomLeft,
  &.ant-popover-placement-bottom {
    animation: none !important;
    transition: none !important;
    
    .ant-popover-content {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export const NotificationContent = styled.div`
  max-width: 400px;
  min-width: 320px;
  background: transparent !important;
  
  .ant-tabs {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  
  .ant-tabs-tab {
    color: rgba(255, 255, 255, 0.6) !important;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    
    &.ant-tabs-tab-active {
      color: rgba(255, 255, 255, 0.95) !important;
    }
  }
  
  .ant-tabs-ink-bar {
    background: rgba(255, 255, 255, 0.3) !important;
  }
  
  .ant-tabs-nav {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  
  .ant-tabs-content {
    background: transparent !important;
  }
`;