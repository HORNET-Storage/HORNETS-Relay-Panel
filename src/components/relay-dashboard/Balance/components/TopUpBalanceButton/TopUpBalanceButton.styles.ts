import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import styled, { css, keyframes } from 'styled-components';

/* Liquid shimmer animation */
const liquidShimmer = keyframes`
  0% {
    background-position: -200% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

export const TopUpButton = styled(BaseButton)`
  /* Liquid glass button styling matching the spec */
  background: linear-gradient(to bottom right,
    rgba(37, 99, 235, 0.18), /* from-blue-600/18 */
    rgba(6, 182, 212, 0.10)  /* to-cyan-600/10 */
  ) !important;
  
  box-shadow:
    inset 0 2px 8px rgba(59, 130, 246, 0.25), /* shadow-inner shadow-blue-500/25 */
    0 0 20px rgba(59, 130, 246, 0.15);
    
  border: 1px solid rgba(59, 130, 246, 0.20) !important; /* border-blue-500/20 */
  
  color: #ffffff !important; /* text-white */
  
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
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
  
  /* Liquid shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(59, 130, 246, 0.15) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    animation: ${liquidShimmer} 3s ease-in-out infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover {
    background: linear-gradient(to bottom right,
      rgba(37, 99, 235, 0.20), /* hover:from-blue-600/20 */
      rgba(6, 182, 212, 0.12)  /* hover:to-cyan-600/12 */
    ) !important;
    
    box-shadow:
      inset 0 3px 10px rgba(59, 130, 246, 0.30), /* hover:shadow-blue-500/30 */
      0 0 30px rgba(59, 130, 246, 0.20);
      
    transform: translateY(-1px);
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 4px 12px rgba(59, 130, 246, 0.35),
      0 0 15px rgba(59, 130, 246, 0.15);
  }
  
  &:focus {
    outline: none;
    box-shadow:
      inset 0 2px 8px rgba(59, 130, 246, 0.25),
      0 0 30px rgba(59, 130, 246, 0.20),
      0 0 0 2px rgba(59, 130, 246, 0.30);
  }
  
  /* Icon styling if present */
  .anticon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
    filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.3));
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow:
        inset 0 2px 8px rgba(59, 130, 246, 0.25),
        0 0 20px rgba(59, 130, 246, 0.15);
    }
  }
  
  /* Theme-specific adjustments */
  ${(props) =>
    props.type === 'ghost' &&
    css`
      background: linear-gradient(to bottom right,
        rgba(37, 99, 235, 0.12),
        rgba(6, 182, 212, 0.08)
      ) !important;
      
      border: 1px solid rgba(59, 130, 246, 0.15) !important;
      color: rgba(219, 234, 254, 1) !important;
      
      &:hover {
        background: linear-gradient(to bottom right,
          rgba(37, 99, 235, 0.16),
          rgba(6, 182, 212, 0.10)
        ) !important;
        
        color: #ffffff !important;
      }
    `};
`;
