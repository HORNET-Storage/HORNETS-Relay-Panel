import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';
import { media } from '@app/styles/themes/constants';

/* Liquid shimmer animation - matches SendButton */
const liquidShimmer = keyframes`
  0% {
    background-position: -200% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

export const Container = styled.div`
  width: 100%;
`;

export const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  ${media.md} {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 0.75rem;
  }
`;

interface ModeButtonProps {
  $isActive: boolean;
  $color: string;
}

export const ModeButton = styled(Button)<ModeButtonProps>`
  height: 80px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  position: relative;
  overflow: hidden;
  
  /* Liquid glass styling matching SendButton theme */
  ${({ $isActive }) => $isActive ? `
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.35), /* Active teal */
      rgba(6, 182, 212, 0.30),  /* Active cyan */
      rgba(34, 197, 94, 0.35)   /* Active green */
    ) !important;
    
    box-shadow:
      inset 0 3px 12px rgba(45, 212, 191, 0.40),
      0 0 40px rgba(6, 182, 212, 0.30),
      0 0 60px rgba(34, 197, 94, 0.25) !important;
      
    border: 1px solid rgba(45, 212, 191, 0.35) !important;
  ` : `
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.15), /* Inactive teal */
      rgba(6, 182, 212, 0.12),  /* Inactive cyan */
      rgba(34, 197, 94, 0.15)   /* Inactive green */
    ) !important;
    
    box-shadow:
      inset 0 2px 8px rgba(45, 212, 191, 0.20),
      0 0 20px rgba(6, 182, 212, 0.15);
      
    border: 1px solid rgba(45, 212, 191, 0.20) !important;
  `}
  
  color: ${({ $isActive }) => $isActive ? '#ffffff' : 'rgba(220, 252, 231, 0.9)'} !important;
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
  
  /* Liquid shimmer effect - shows on hover */
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
    transform: translateY(-2px);
    
    ${({ $isActive }) => $isActive ? `
      background: linear-gradient(to bottom right,
        rgba(20, 184, 166, 0.40), /* Hover active teal */
        rgba(6, 182, 212, 0.35),  /* Hover active cyan */
        rgba(34, 197, 94, 0.40)   /* Hover active green */
      ) !important;
      
      box-shadow:
        inset 0 4px 15px rgba(45, 212, 191, 0.45),
        0 0 50px rgba(6, 182, 212, 0.35),
        0 0 70px rgba(34, 197, 94, 0.30) !important;
        
      border-color: rgba(45, 212, 191, 0.45) !important;
    ` : `
      background: linear-gradient(to bottom right,
        rgba(20, 184, 166, 0.25), /* Hover inactive teal */
        rgba(6, 182, 212, 0.20),  /* Hover inactive cyan */
        rgba(34, 197, 94, 0.25)   /* Hover inactive green */
      ) !important;
      
      box-shadow:
        inset 0 3px 10px rgba(45, 212, 191, 0.30),
        0 0 35px rgba(6, 182, 212, 0.25),
        0 0 45px rgba(34, 197, 94, 0.20) !important;
        
      border-color: rgba(45, 212, 191, 0.30) !important;
    `}
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: none;
    box-shadow:
      inset 0 2px 10px rgba(45, 212, 191, 0.30),
      0 0 35px rgba(6, 182, 212, 0.25),
      0 0 0 2px rgba(45, 212, 191, 0.35) !important;
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }

  ${media.md} {
    height: 70px;
  }
`;

export const ModeDescription = styled.div`
  padding: 1rem;
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.08),
    rgba(6, 182, 212, 0.06),
    rgba(34, 197, 94, 0.08)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(45, 212, 191, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
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
      rgba(255, 255, 255, 0.05) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(45, 212, 191, 0.25);
    box-shadow:
      inset 0 2px 8px rgba(45, 212, 191, 0.15),
      0 0 20px rgba(6, 182, 212, 0.15);
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.10),
      rgba(6, 182, 212, 0.08),
      rgba(34, 197, 94, 0.10)
    );
  }
`;

export const DescriptionText = styled.p`
  margin: 0;
  color: rgba(220, 252, 231, 0.95);
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  z-index: 1;
`;