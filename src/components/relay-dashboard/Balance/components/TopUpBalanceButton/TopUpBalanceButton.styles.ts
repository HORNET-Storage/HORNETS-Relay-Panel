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
  /* Liquid glass button styling with teal-cyan-green gradient */
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.25), /* from-teal-500/25 */
    rgba(6, 182, 212, 0.20),  /* via-cyan-500/20 */
    rgba(34, 197, 94, 0.25)   /* to-green-500/25 */
  ) !important;
  
  box-shadow:
    inset 0 2px 8px rgba(45, 212, 191, 0.30), /* shadow-inner with teal */
    0 0 25px rgba(6, 182, 212, 0.20);
    
  border: 1px solid rgba(45, 212, 191, 0.25) !important; /* border-teal-400/25 */
  
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
  
  /* Liquid shimmer effect with teal-cyan highlights */
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
      rgba(45, 212, 191, 0.20) 45%,
      rgba(6, 182, 212, 0.25) 50%,
      rgba(34, 197, 94, 0.20) 55%,
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
      rgba(20, 184, 166, 0.30), /* hover:from-teal-500/30 */
      rgba(6, 182, 212, 0.25),  /* hover:via-cyan-500/25 */
      rgba(34, 197, 94, 0.30)   /* hover:to-green-500/30 */
    ) !important;
    
    box-shadow:
      inset 0 3px 12px rgba(45, 212, 191, 0.35),
      0 0 35px rgba(6, 182, 212, 0.25);
      
    transform: translateY(-1px);
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.35), /* Active state with stronger teal */
      rgba(6, 182, 212, 0.30),
      rgba(34, 197, 94, 0.35)
    ) !important;
    box-shadow:
      inset 0 4px 15px rgba(45, 212, 191, 0.40),
      0 0 20px rgba(6, 182, 212, 0.20);
  }
  
  &:focus {
    outline: none;
    box-shadow:
      inset 0 2px 10px rgba(45, 212, 191, 0.30),
      0 0 35px rgba(6, 182, 212, 0.25),
      0 0 0 2px rgba(45, 212, 191, 0.35);
  }
  
  /* Icon styling with teal glow */
  .anticon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
    filter: drop-shadow(0 0 3px rgba(45, 212, 191, 0.4));
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow:
        inset 0 2px 8px rgba(45, 212, 191, 0.25),
        0 0 20px rgba(6, 182, 212, 0.15);
    }
  }
  
  /* Theme-specific adjustments for ghost variant */
  ${(props) =>
    props.type === 'ghost' &&
    css`
      background: linear-gradient(to bottom right,
        rgba(20, 184, 166, 0.15),
        rgba(6, 182, 212, 0.12),
        rgba(34, 197, 94, 0.15)
      ) !important;
      
      border: 1px solid rgba(45, 212, 191, 0.20) !important;
      color: rgba(220, 252, 231, 1) !important;
      
      &:hover {
        background: linear-gradient(to bottom right,
          rgba(20, 184, 166, 0.20),
          rgba(6, 182, 212, 0.15),
          rgba(34, 197, 94, 0.20)
        ) !important;
        
        color: #ffffff !important;
      }
    `};
`;
