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

interface StyledLiquidButtonProps {
  $variant?: 'primary' | 'secondary' | 'ghost';
}

export const StyledLiquidButton = styled(BaseButton)<StyledLiquidButtonProps>`
  /* Liquid glass button styling with teal-cyan-green gradient */
  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'ghost':
        return css`
          background: linear-gradient(to bottom right,
            rgba(20, 184, 166, 0.15),
            rgba(6, 182, 212, 0.12),
            rgba(34, 197, 94, 0.15)
          ) !important;
          
          border: 1px solid rgba(45, 212, 191, 0.20) !important;
          color: rgba(220, 252, 231, 1) !important;
        `;
      case 'secondary':
        return css`
          background: linear-gradient(to bottom right,
            rgba(20, 184, 166, 0.20),
            rgba(6, 182, 212, 0.15),
            rgba(34, 197, 94, 0.20)
          ) !important;
          
          border: 1px solid rgba(45, 212, 191, 0.25) !important;
          color: rgba(220, 252, 231, 1) !important;
        `;
      case 'primary':
      default:
        return css`
          background: linear-gradient(to bottom right,
            rgba(20, 184, 166, 0.25),
            rgba(6, 182, 212, 0.20),
            rgba(34, 197, 94, 0.25)
          ) !important;
          
          border: 1px solid rgba(45, 212, 191, 0.25) !important;
          color: #ffffff !important;
        `;
    }
  }}
  
  box-shadow:
    inset 0 2px 8px rgba(45, 212, 191, 0.30),
    0 0 25px rgba(6, 182, 212, 0.20);
  
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-weight: 600;
  
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
  
  &:hover:not(:disabled) {
    ${({ $variant = 'primary' }) => {
      switch ($variant) {
        case 'ghost':
          return css`
            background: linear-gradient(to bottom right,
              rgba(20, 184, 166, 0.20),
              rgba(6, 182, 212, 0.15),
              rgba(34, 197, 94, 0.20)
            ) !important;
            
            color: #ffffff !important;
          `;
        case 'secondary':
          return css`
            background: linear-gradient(to bottom right,
              rgba(20, 184, 166, 0.25),
              rgba(6, 182, 212, 0.20),
              rgba(34, 197, 94, 0.25)
            ) !important;
            
            color: #ffffff !important;
          `;
        case 'primary':
        default:
          return css`
            background: linear-gradient(to bottom right,
              rgba(20, 184, 166, 0.30),
              rgba(6, 182, 212, 0.25),
              rgba(34, 197, 94, 0.30)
            ) !important;
          `;
      }
    }}
    
    box-shadow:
      inset 0 3px 12px rgba(45, 212, 191, 0.35),
      0 0 35px rgba(6, 182, 212, 0.25);
      
    transform: translateY(-1px);
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    
    ${({ $variant = 'primary' }) => {
      switch ($variant) {
        case 'ghost':
        case 'secondary':
          return css`
            background: linear-gradient(to bottom right,
              rgba(20, 184, 166, 0.30),
              rgba(6, 182, 212, 0.25),
              rgba(34, 197, 94, 0.30)
            ) !important;
          `;
        case 'primary':
        default:
          return css`
            background: linear-gradient(to bottom right,
              rgba(20, 184, 166, 0.35),
              rgba(6, 182, 212, 0.30),
              rgba(34, 197, 94, 0.35)
            ) !important;
          `;
      }
    }}
    
    box-shadow:
      inset 0 4px 15px rgba(45, 212, 191, 0.40),
      0 0 20px rgba(6, 182, 212, 0.20);
  }
  
  &:focus:not(:disabled) {
    outline: none;
    box-shadow:
      inset 0 2px 10px rgba(45, 212, 191, 0.30),
      0 0 35px rgba(6, 182, 212, 0.25),
      0 0 0 2px rgba(45, 212, 191, 0.35);
  }
  
  /* Icon styling with teal glow */
  .anticon {
    font-size: 1.1rem;
    margin-right: 0.4rem;
    filter: drop-shadow(0 0 3px rgba(45, 212, 191, 0.4));
    position: relative;
    z-index: 1;
  }
  
  /* Loading state */
  &.ant-btn-loading {
    opacity: 0.8;
    
    &::before {
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.05) 0%,
        transparent 100%
      );
    }
  }
  
  /* Disabled state */
  &:disabled,
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.10),
      rgba(6, 182, 212, 0.08),
      rgba(34, 197, 94, 0.10)
    ) !important;
    
    &:hover {
      transform: none;
      box-shadow:
        inset 0 2px 8px rgba(45, 212, 191, 0.25),
        0 0 20px rgba(6, 182, 212, 0.15);
    }
  }
  
  /* Ensure text is readable */
  span {
    position: relative;
    z-index: 1;
  }
`;