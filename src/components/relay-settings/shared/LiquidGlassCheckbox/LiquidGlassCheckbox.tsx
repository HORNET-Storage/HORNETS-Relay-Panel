// src/components/relay-settings/shared/LiquidGlassCheckbox/LiquidGlassCheckbox.tsx

import styled, { keyframes } from 'styled-components';
import { Checkbox } from 'antd';

// Liquid pulse animation for checked state
const liquidPulse = keyframes`
  0%, 100% {
    box-shadow:
      inset 0 2px 6px rgba(16, 185, 129, 0.3),
      0 0 20px rgba(52, 211, 153, 0.35),
      0 0 30px rgba(34, 197, 94, 0.25);
  }
  50% {
    box-shadow:
      inset 0 2px 8px rgba(16, 185, 129, 0.4),
      0 0 25px rgba(52, 211, 153, 0.45),
      0 0 35px rgba(34, 197, 94, 0.35);
  }
`;

// Styled checkbox group with liquid glass theme
export const LiquidGlassCheckboxGroup = styled(Checkbox.Group)`
  &.liquid-glass-checkbox .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin: 0.25rem 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background: rgba(16, 185, 129, 0.05);
      border-radius: 4px;
    }
  }

  &.liquid-glass-checkbox .ant-checkbox {
    .ant-checkbox-inner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(52, 211, 153, 0.3);
      background: rgba(16, 185, 129, 0.08);
      border-radius: 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      
      &::after {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
    
    &:hover .ant-checkbox-inner {
      border-color: rgba(52, 211, 153, 0.5);
      background: rgba(16, 185, 129, 0.12);
      box-shadow: 0 0 15px rgba(52, 211, 153, 0.2);
    }
    
    &.ant-checkbox-checked .ant-checkbox-inner {
      background: linear-gradient(135deg,
        rgba(16, 185, 129, 0.6),
        rgba(52, 211, 153, 0.5),
        rgba(34, 197, 94, 0.6)
      );
      border-color: rgba(52, 211, 153, 0.6);
      box-shadow:
        inset 0 2px 6px rgba(16, 185, 129, 0.3),
        0 0 20px rgba(52, 211, 153, 0.35),
        0 0 30px rgba(34, 197, 94, 0.25);
      animation: ${liquidPulse} 2s ease-in-out infinite;
      
      &::after {
        border-color: #ffffff;
        border-width: 2px;
        opacity: 1;
      }
    }
    
    &.ant-checkbox-checked:hover .ant-checkbox-inner {
      background: linear-gradient(135deg,
        rgba(16, 185, 129, 0.7),
        rgba(52, 211, 153, 0.6),
        rgba(34, 197, 94, 0.7)
      );
      box-shadow:
        inset 0 2px 8px rgba(16, 185, 129, 0.4),
        0 0 25px rgba(52, 211, 153, 0.45),
        0 0 35px rgba(34, 197, 94, 0.35);
    }
    
    &:focus-visible .ant-checkbox-inner {
      outline: 2px solid rgba(52, 211, 153, 0.4);
      outline-offset: 2px;
    }
    
    &.ant-checkbox-disabled .ant-checkbox-inner {
      opacity: 0.4;
      background: rgba(100, 100, 100, 0.05);
      border-color: rgba(150, 150, 150, 0.2);
    }
  }
`;

// Single checkbox with liquid glass theme
export const LiquidGlassCheckbox = styled(Checkbox)`
  &.ant-checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ant-checkbox-inner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(52, 211, 153, 0.3);
    background: rgba(16, 185, 129, 0.08);
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    
    &::after {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
  
  &:hover .ant-checkbox-inner {
    border-color: rgba(52, 211, 153, 0.5);
    background: rgba(16, 185, 129, 0.12);
    box-shadow: 0 0 15px rgba(52, 211, 153, 0.2);
  }
  
  &.ant-checkbox-wrapper-checked .ant-checkbox-inner {
    background: linear-gradient(135deg,
      rgba(16, 185, 129, 0.6),
      rgba(52, 211, 153, 0.5),
      rgba(34, 197, 94, 0.6)
    );
    border-color: rgba(52, 211, 153, 0.6);
    box-shadow:
      inset 0 2px 6px rgba(16, 185, 129, 0.3),
      0 0 20px rgba(52, 211, 153, 0.35),
      0 0 30px rgba(34, 197, 94, 0.25);
    animation: ${liquidPulse} 2s ease-in-out infinite;
    
    .ant-checkbox-inner::after {
      border-color: #ffffff;
      border-width: 2px;
      opacity: 1;
    }
  }
  
  &.ant-checkbox-wrapper-checked:hover .ant-checkbox-inner {
    background: linear-gradient(135deg,
      rgba(16, 185, 129, 0.7),
      rgba(52, 211, 153, 0.6),
      rgba(34, 197, 94, 0.7)
    );
    box-shadow:
      inset 0 2px 8px rgba(16, 185, 129, 0.4),
      0 0 25px rgba(52, 211, 153, 0.45),
      0 0 35px rgba(34, 197, 94, 0.35);
  }
  
  &.ant-checkbox-wrapper-disabled .ant-checkbox-inner {
    opacity: 0.4;
    background: rgba(100, 100, 100, 0.05);
    border-color: rgba(150, 150, 150, 0.2);
  }
`;