import styled, { keyframes } from 'styled-components';
import { Badge } from 'antd';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.7);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.3), 0 0 20px rgba(6, 182, 212, 0.5);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.7);
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
    /* Liquid glass morphism matching our theme */
    background: linear-gradient(135deg,
      rgba(20, 184, 166, 0.85),  /* teal */
      rgba(6, 182, 212, 0.80),   /* cyan */
      rgba(45, 212, 191, 0.85)   /* turquoise */
    );
    border: 1px solid rgba(45, 212, 191, 0.3);
    box-shadow:
      0 0 8px rgba(45, 212, 191, 0.5),
      0 0 16px rgba(6, 182, 212, 0.3),
      inset 0 0 4px rgba(255, 255, 255, 0.2);
    animation: ${pulse} 2s ease-in-out infinite;
    font-weight: 700;
    color: rgba(0, 20, 30, 0.95);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    position: relative;
    overflow: hidden;
    
    /* Glass overlay for depth */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.12) 0%,
        transparent 100%
      );
      pointer-events: none;
    }
  }
  
  & .ant-badge-dot {
    background: radial-gradient(circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(45, 212, 191, 0.85) 40%,
      rgba(6, 182, 212, 0.8) 100%
    );
    width: 10px;
    height: 10px;
    border: 1px solid rgba(45, 212, 191, 0.4);
    box-shadow:
      0 0 8px rgba(45, 212, 191, 0.6),
      0 0 16px rgba(6, 182, 212, 0.4);
    animation: ${pulse} 2s ease-in-out infinite;
    backdrop-filter: blur(4px);
  }
  
  & .ant-badge-count-sm {
    background: linear-gradient(135deg,
      rgba(20, 184, 166, 0.82),
      rgba(6, 182, 212, 0.78),
      rgba(45, 212, 191, 0.82)
    );
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    padding: 0 5px;
    border: 1px solid rgba(45, 212, 191, 0.25);
    box-shadow:
      0 0 6px rgba(45, 212, 191, 0.4),
      0 0 12px rgba(6, 182, 212, 0.25);
    animation: ${glow} 2s ease-in-out infinite;
    color: rgba(0, 20, 30, 0.9);
    font-weight: 600;
    backdrop-filter: blur(4px);
  }
  
  &.notification-badge {
    & .ant-badge-count {
      right: 6px;
      top: -12px;
    }
  }
`;

// Tab badge with more subtle animation for inline use
export const TabBadge = styled(Badge)`
  & .ant-badge-count {
    background: linear-gradient(135deg,
      rgba(20, 184, 166, 0.75),
      rgba(45, 212, 191, 0.70),
      rgba(6, 182, 212, 0.75)
    );
    border: 1px solid rgba(45, 212, 191, 0.2);
    box-shadow:
      0 0 4px rgba(45, 212, 191, 0.35),
      inset 0 0 3px rgba(255, 255, 255, 0.15);
    color: rgba(0, 20, 30, 0.85);
    font-weight: 600;
    animation: ${glow} 3s ease-in-out infinite;
    backdrop-filter: blur(3px);
  }
  
  & .ant-badge-count-sm {
    background: linear-gradient(135deg,
      rgba(20, 184, 166, 0.72),
      rgba(45, 212, 191, 0.68),
      rgba(6, 182, 212, 0.72)
    );
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 10px;
    padding: 0 4px;
    border: 1px solid rgba(45, 212, 191, 0.18);
    box-shadow:
      0 0 4px rgba(45, 212, 191, 0.3);
    color: rgba(0, 20, 30, 0.8);
    font-weight: 600;
    animation: ${glow} 3s ease-in-out infinite;
    backdrop-filter: blur(3px);
  }
`;