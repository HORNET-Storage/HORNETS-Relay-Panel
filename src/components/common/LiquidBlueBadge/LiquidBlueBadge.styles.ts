import styled, { keyframes } from 'styled-components';
import { Badge } from 'antd';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
  }
`;

const glow = keyframes`
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
`;

export const StyledLiquidBadge = styled(Badge)`
  & .ant-badge-count {
    /* Liquid cyan badge with glass effect */
    background: rgba(0, 255, 255, 0.85);
    border: 1px solid rgba(0, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 255, 255, 0.3), 0 0 15px rgba(0, 255, 255, 0.2);
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }
  
  & .ant-badge-dot {
    background: rgba(0, 255, 255, 0.85);
    width: 10px;
    height: 10px;
    border: 1px solid rgba(0, 255, 255, 0.4);
    box-shadow: 0 2px 8px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.2);
  }
  
  & .ant-badge-count-sm {
    background: rgba(0, 255, 255, 0.8);
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    padding: 0 5px;
    border: 1px solid rgba(0, 255, 255, 0.25);
    box-shadow: 0 2px 6px rgba(0, 255, 255, 0.25), 0 0 10px rgba(0, 255, 255, 0.15);
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    backdrop-filter: blur(8px);
  }
  
  &.notification-badge {
    position: relative;
    display: inline-block;
    
    & .ant-badge-count {
      position: absolute;
      right: -8px;
      top: -8px;
      transform: none;
    }
    
    /* Ensure the wrapper doesn't shift when badge appears/disappears */
    & .ant-badge-count-sm {
      position: absolute;
      right: -8px;
      top: -8px;
    }
  }
`;

// Tab badge with more subtle animation for inline use
export const TabBadge = styled(Badge)`
  & .ant-badge-count {
    background: rgba(0, 255, 255, 0.75);
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 2px 4px rgba(0, 255, 255, 0.15);
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
  }
  
  & .ant-badge-count-sm {
    background: rgba(0, 255, 255, 0.7);
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 10px;
    padding: 0 4px;
    border: 1px solid rgba(0, 255, 255, 0.18);
    box-shadow: 0 2px 4px rgba(0, 255, 255, 0.1);
    color: rgba(0, 0, 0, 0.75);
    font-weight: 600;
  }
`;