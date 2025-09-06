import styled, { keyframes } from 'styled-components';
import { Switch as AntdSwitch } from 'antd';

/* Liquid pulse animation for the toggle */
const liquidPulse = keyframes`
  0%, 100% {
    box-shadow: 
      inset 0 0 15px rgba(20, 184, 166, 0.6),
      inset 0 0 25px rgba(6, 182, 212, 0.4),
      0 0 35px rgba(34, 197, 94, 0.5),
      0 0 50px rgba(6, 182, 212, 0.3);
  }
  50% {
    box-shadow: 
      inset 0 0 20px rgba(20, 184, 166, 0.8),
      inset 0 0 30px rgba(6, 182, 212, 0.5),
      0 0 45px rgba(34, 197, 94, 0.6),
      0 0 65px rgba(6, 182, 212, 0.4);
  }
`;

/* Special USD glow animation */
const usdGlow = keyframes`
  0%, 100% {
    box-shadow:
      inset 0 0 20px rgba(52, 211, 153, 0.7),
      inset 0 0 30px rgba(16, 185, 129, 0.5),
      0 0 50px rgba(34, 197, 94, 0.6),
      0 0 70px rgba(6, 182, 212, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow:
      inset 0 0 25px rgba(52, 211, 153, 0.9),
      inset 0 0 35px rgba(16, 185, 129, 0.7),
      0 0 60px rgba(34, 197, 94, 0.8),
      0 0 80px rgba(6, 182, 212, 0.5);
    transform: scale(1.02);
  }
`;

/* Bitcoin orange pulse animation */
const btcPulse = keyframes`
  0%, 100% {
    box-shadow:
      inset 0 0 15px rgba(247, 147, 26, 0.5),
      inset 0 0 25px rgba(251, 176, 59, 0.3),
      0 0 35px rgba(245, 158, 11, 0.4),
      0 0 50px rgba(247, 147, 26, 0.25);
  }
  50% {
    box-shadow:
      inset 0 0 20px rgba(247, 147, 26, 0.6),
      inset 0 0 30px rgba(251, 176, 59, 0.4),
      0 0 45px rgba(245, 158, 11, 0.5),
      0 0 65px rgba(247, 147, 26, 0.35);
  }
`;

/* Shimmer effect for active state */
const shimmerWave = keyframes`
  0% {
    background-position: -200% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

export const Switch = styled(AntdSwitch)`
  /* Base unchecked state */
  &.ant-switch[aria-checked='false'] {
    background-image: linear-gradient(to right, var(--disabled-color), var(--disabled-color)),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  
  /* Enhanced liquid switch unchecked state - SATS (Bitcoin orange) */
  &.ant-switch[aria-checked='false'].balanceSwitch.sats-active {
    /* Shimmer overlay for SATS */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        105deg,
        transparent 30%,
        rgba(247, 147, 26, 0.25) 45%,
        rgba(251, 176, 59, 0.30) 50%,
        rgba(247, 147, 26, 0.25) 55%,
        transparent 70%
      );
      background-size: 200% 100%;
      animation: ${shimmerWave} 3s linear infinite;
      border-radius: 100px;
      pointer-events: none;
      z-index: 1;
    }
    
    background: linear-gradient(135deg,
      rgba(247, 147, 26, 0.28),  /* Bitcoin orange - more vibrant */
      rgba(251, 176, 59, 0.22),  /* Lighter orange */
      rgba(245, 158, 11, 0.28)   /* Amber orange */
    ) !important;
    border: 2px solid rgba(247, 147, 26, 0.35); /* Bitcoin orange border */
    height: 22px !important;  /* Set explicit height for proper knob centering */
    box-shadow:
      inset 0 3px 12px rgba(247, 147, 26, 0.35),
      inset 0 -2px 8px rgba(251, 176, 59, 0.25),
      0 0 40px rgba(245, 158, 11, 0.25),
      0 0 60px rgba(247, 147, 26, 0.20),
      0 4px 20px rgba(251, 176, 59, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    animation: ${btcPulse} 3s ease-in-out infinite;
    
    /* Glass layer */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg,
        rgba(247, 147, 26, 0.10) 0%,
        transparent 60%
      );
      border-radius: 100px;
      pointer-events: none;
    }
  }
  
  &.ant-switch[aria-checked='false'].modeSwitch {
    background-image: linear-gradient(to right, red, red),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  
  /* Enhanced liquid switch unchecked state when not sats-active (fallback) */
  &.ant-switch[aria-checked='false'].balanceSwitch:not(.sats-active) {
    background: linear-gradient(135deg,
      rgba(20, 184, 166, 0.15),  /* from-teal-500/15 - lighter for unchecked */
      rgba(6, 182, 212, 0.12),   /* via-cyan-500/12 */
      rgba(34, 197, 94, 0.15)    /* to-green-500/15 */
    ) !important;
    border: 2px solid rgba(45, 212, 191, 0.25); /* border-teal-400/25 */
    height: 22px !important;
    box-shadow:
      inset 0 2px 6px rgba(20, 184, 166, 0.20),
      inset 0 -1px 3px rgba(6, 182, 212, 0.15),
      0 0 20px rgba(34, 197, 94, 0.10);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    /* Glass layer */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg,
        rgba(6, 182, 212, 0.08) 0%,
        transparent 60%
      );
      border-radius: 100px;
      pointer-events: none;
    }
  }
  
  /* Enhanced liquid switch for all states */
  &.liquid-switch.balanceSwitch {
    position: relative;
    overflow: visible;
    border-radius: 100px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 22px !important;  /* Ensure consistent height */
    
    /* Liquid glass handle/knob - perfectly centered */
    .ant-switch-handle {
      width: 18px !important;
      height: 18px !important;
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(254, 243, 235, 0.90) 100% /* Orange tint for sats by default */
      ) !important;
      border: 1px solid rgba(247, 147, 26, 0.3);
      border-radius: 50%;
      box-shadow:
        0 2px 8px rgba(247, 147, 26, 0.3),
        0 0 20px rgba(251, 176, 59, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: absolute !important;
      top: 2px !important;  /* (22px - 18px) / 2 = 2px for perfect centering */
      inset-inline-start: 2px !important;
      
      /* Inner glow effect - no symbol */
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 60%;
        background: radial-gradient(circle,
          rgba(247, 147, 26, 0.25) 0%,
          transparent 70%
        );
        border-radius: 50%;
        pointer-events: none;
      }
    }
    
    /* Position adjustment for checked state */
    &.ant-switch-checked .ant-switch-handle {
      inset-inline-start: calc(100% - 20px) !important;
      top: 2px !important;  /* Keep consistent with unchecked state */
    }
    
    /* Hover state for unchecked SATS */
    &:not(.ant-switch-checked).sats-active:hover {
      background: linear-gradient(135deg,
        rgba(247, 147, 26, 0.32),
        rgba(251, 176, 59, 0.26),
        rgba(245, 158, 11, 0.32)
      ) !important;
      border-color: rgba(247, 147, 26, 0.45);
      box-shadow:
        inset 0 3px 10px rgba(247, 147, 26, 0.40),
        inset 0 -2px 5px rgba(251, 176, 59, 0.30),
        0 0 45px rgba(245, 158, 11, 0.35),
        0 0 65px rgba(247, 147, 26, 0.25);
        
      .ant-switch-handle {
        width: 18px !important;
        height: 18px !important;
        box-shadow:
          0 3px 10px rgba(247, 147, 26, 0.5),
          0 0 30px rgba(251, 176, 59, 0.3),
          inset 0 1px 3px rgba(255, 255, 255, 0.9);
      }
    }
    
    /* Hover state for unchecked non-SATS (fallback) */
    &:not(.ant-switch-checked):not(.sats-active):hover {
      background: linear-gradient(135deg,
        rgba(20, 184, 166, 0.20),
        rgba(6, 182, 212, 0.15),
        rgba(34, 197, 94, 0.20)
      ) !important;
      border-color: rgba(45, 212, 191, 0.35);
      box-shadow:
        inset 0 2px 5px rgba(20, 184, 166, 0.25),
        0 0 25px rgba(6, 182, 212, 0.15);
        
      .ant-switch-handle {
        width: 18px !important;
        height: 18px !important;
        box-shadow:
          0 3px 10px rgba(20, 184, 166, 0.4),
          0 0 30px rgba(6, 182, 212, 0.25),
          inset 0 1px 3px rgba(255, 255, 255, 0.9);
      }
    }
    
    /* CHECKED STATE - USD (Green) */
    &.ant-switch-checked.usd-active {
      background: linear-gradient(to bottom right,
        rgba(16, 185, 129, 0.35), /* Emerald green for money */
        rgba(52, 211, 153, 0.30),
        rgba(34, 197, 94, 0.35)
      ) !important;
      border: 2px solid rgba(52, 211, 153, 0.40);
      box-shadow:
        inset 0 3px 12px rgba(16, 185, 129, 0.40),
        inset 0 -2px 8px rgba(52, 211, 153, 0.30),
        0 0 40px rgba(34, 197, 94, 0.35),
        0 0 60px rgba(52, 211, 153, 0.25),
        0 4px 20px rgba(16, 185, 129, 0.20);
      animation: ${usdGlow} 2s ease-in-out infinite;
      
      /* Glass overlay for depth */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(6, 182, 212, 0.15) 20%,
          rgba(34, 197, 94, 0.20) 50%,
          rgba(6, 182, 212, 0.15) 80%,
          transparent 100%
        );
        border-radius: 100px;
        pointer-events: none;
      }
      
      /* Outer glow */
      &::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(180deg,
          rgba(20, 184, 166, 0.15) 0%,
          transparent 40%,
          transparent 60%,
          rgba(34, 197, 94, 0.10) 100%
        );
        border-radius: 100px;
        pointer-events: none;
        z-index: -1;
      }
      
      /* Enhanced handle when checked (USD) - Green tint */
      .ant-switch-handle {
        width: 18px !important;
        height: 18px !important;
        background: linear-gradient(135deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(236, 253, 245, 1) 100% /* Green-tinted for USD */
        ) !important;
        border: 1px solid rgba(52, 211, 153, 0.5);
        box-shadow:
          0 4px 15px rgba(16, 185, 129, 0.6),
          0 0 40px rgba(52, 211, 153, 0.45),
          0 0 60px rgba(34, 197, 94, 0.3),
          inset 0 1px 4px rgba(255, 255, 255, 1);
        position: absolute !important;
        top: 2px !important;  /* Keep consistent vertical centering */
        
        &::before {
          width: 80%;
          height: 80%;
          background: radial-gradient(circle,
            rgba(52, 211, 153, 0.4) 0%,
            rgba(16, 185, 129, 0.2) 50%,
            transparent 70%
          );
        }
      }
      
      /* Inner text glow */
      .ant-switch-inner {
        color: #ffffff;
        text-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
        font-weight: 600;
      }
    }
    
    /* Hover state for checked USD */
    &.ant-switch-checked.usd-active:hover {
      background: linear-gradient(to bottom right,
        rgba(16, 185, 129, 0.40),
        rgba(52, 211, 153, 0.35),
        rgba(34, 197, 94, 0.40)
      ) !important;
      border-color: rgba(52, 211, 153, 0.50);
      box-shadow:
        inset 0 3px 10px rgba(16, 185, 129, 0.50),
        inset 0 -2px 5px rgba(52, 211, 153, 0.40),
        0 0 50px rgba(34, 197, 94, 0.45),
        0 0 70px rgba(52, 211, 153, 0.35);
        
      .ant-switch-handle {
        width: 18px !important;
        height: 18px !important;
        box-shadow:
          0 4px 15px rgba(16, 185, 129, 0.7),
          0 0 50px rgba(52, 211, 153, 0.5),
          inset 0 1px 4px rgba(255, 255, 255, 1);
      }
    }
    
    
    /* Focus state */
    &:focus {
      box-shadow: 
        inset 0 2px 8px rgba(20, 184, 166, 0.35),
        0 0 40px rgba(6, 182, 212, 0.30),
        0 0 0 2px rgba(45, 212, 191, 0.30);
    }
    
    /* Loading state */
    &.ant-switch-loading {
      opacity: 0.7;
      
      .ant-switch-loading-icon {
        color: rgba(6, 182, 212, 0.8);
      }
    }
    
    /* Disabled state */
    &.ant-switch-disabled {
      opacity: 0.4;
      cursor: not-allowed;
      
      .ant-switch-handle {
        box-shadow: none;
      }
    }
  }
`;