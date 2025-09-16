import styled, { keyframes } from 'styled-components';
import { Badge } from 'antd';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.5);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
    transform: scale(1);
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
    background: linear-gradient(135deg, #00ffff 0%, #06b6d4 100%);
    border: none;
    box-shadow: 
      0 0 12px rgba(0, 255, 255, 0.6),
      0 0 24px rgba(0, 255, 255, 0.4),
      inset 0 0 8px rgba(255, 255, 255, 0.3);
    animation: ${pulse} 2s ease-in-out infinite;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  
  & .ant-badge-dot {
    background: radial-gradient(circle, #ffffff 0%, #00ffff 40%, #06b6d4 100%);
    width: 10px;
    height: 10px;
    box-shadow: 
      0 0 8px rgba(0, 255, 255, 0.8),
      0 0 16px rgba(0, 255, 255, 0.6),
      0 0 24px rgba(0, 255, 255, 0.4);
    animation: ${pulse} 2s ease-in-out infinite;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  & .ant-badge-count-sm {
    background: linear-gradient(135deg, #00ffff 0%, #06b6d4 100%);
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    padding: 0 5px;
    box-shadow: 
      0 0 8px rgba(0, 255, 255, 0.5),
      0 0 16px rgba(0, 255, 255, 0.3);
    animation: ${glow} 2s ease-in-out infinite;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
  }
  
  &.notification-badge {
    & .ant-badge-count {
      right: -3px;
      top: -3px;
    }
  }
`;

// Tab badge with more subtle animation for inline use
export const TabBadge = styled(Badge)`
  & .ant-badge-count {
    background: linear-gradient(135deg, #00ffff 0%, #14b8a6 100%);
    border: none;
    box-shadow: 
      0 0 6px rgba(0, 255, 255, 0.5),
      inset 0 0 4px rgba(255, 255, 255, 0.2);
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    animation: ${glow} 3s ease-in-out infinite;
  }
  
  & .ant-badge-count-sm {
    background: linear-gradient(135deg, #00ffff 0%, #14b8a6 100%);
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 10px;
    padding: 0 4px;
    box-shadow: 
      0 0 6px rgba(0, 255, 255, 0.4);
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    animation: ${glow} 3s ease-in-out infinite;
  }
`;