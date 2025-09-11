import { createGlobalStyle } from 'styled-components';
import { resetCss } from './resetCss';
import { BREAKPOINTS, FONT_SIZE, FONT_WEIGHT, media } from './themes/constants';
import {
  liquidBlueThemeVariables,
  commonThemeVariables,
  antOverrideCssVariables,
} from './themes/themeVariables';

export default createGlobalStyle`
  ${resetCss}

  // Always use liquid blue theme
  :root, 
  [data-theme='liquid-blue'] {
    ${liquidBlueThemeVariables}
    ${commonThemeVariables}
    ${antOverrideCssVariables}
  }

  // Apply liquid glass effect globally
  body {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(0, 255, 170, 0.08) 0%, transparent 50%),
                  radial-gradient(circle at 40% 20%, rgba(20, 184, 166, 0.06) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
    }
  }

  // Fix for modals in fullscreen mode - ensure they appear above fullscreen elements
  .ant-modal-root,
  .ant-modal-wrap,
  .ant-modal-mask {
    z-index: 2147483647 !important; // Maximum z-index value
  }

  // Ensure dropdown menus and popovers also work in fullscreen
  .ant-dropdown,
  .ant-popover,
  .ant-tooltip,
  .ant-select-dropdown,
  .ant-picker-dropdown {
    z-index: 2147483647 !important;
  }

  // Ensure notification container appears above fullscreen
  .ant-notification {
    z-index: 2147483647 !important;
  }

  // Message container should also be above fullscreen
  .ant-message {
    z-index: 2147483647 !important;
  }

  // Glass morphism effect for cards and panels (removed .ant-form to eliminate square containers)
  .ant-card,
  .ant-modal-content,
  .ant-collapse-item,
  .ant-table {
    background: rgba(0, 255, 255, 0.03) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.15) !important;
    box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1) !important;
  }

  // Apply glass morphism to notification dropdown popover
  .ant-popover-inner {
    background: rgba(0, 255, 255, 0.03) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(0, 255, 255, 0.15) !important;
    box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1) !important;
    border-radius: 12px !important;
  }

  .ant-popover-content {
    background: transparent !important;
  }

  .ant-popover-arrow {
    display: none !important;
  }

  // Style tabs in notification dropdown
  .ant-popover .ant-tabs {
    color: rgba(255, 255, 255, 0.95) !important;
  }
  
  .ant-popover .ant-tabs-tab {
    color: rgba(255, 255, 255, 0.7) !important;
    
    &:hover {
      color: rgba(255, 255, 255, 0.9) !important;
    }
    
    &.ant-tabs-tab-active {
      color: white !important;
    }
  }
  
  .ant-popover .ant-tabs-ink-bar {
    background: rgba(0, 255, 255, 0.6) !important;
  }
  
  .ant-popover .ant-tabs-nav {
    background: transparent !important;
    border-bottom: 1px solid rgba(0, 255, 255, 0.1) !important;
  }
  
  .ant-popover .ant-tabs-content {
    background: transparent !important;
  }

  // Hover effects with cyan glow
  .ant-btn:hover,
  .ant-menu-item:hover,
  .ant-card:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3) !important;
    border-color: rgba(0, 255, 255, 0.4) !important;
  }

  // Animated dropdown glow effect keyframes
  @keyframes dropdownGlowFadeIn {
    0% {
      opacity: 0;
      box-shadow:
        0 0 0 rgba(0, 255, 255, 0),
        0 8px 32px 0 rgba(0, 255, 255, 0);
      border-color: rgba(0, 255, 255, 0);
      transform: translateY(-5px);
    }
    100% {
      opacity: 1;
      box-shadow:
        0 0 20px rgba(0, 255, 255, 0.4),
        0 8px 32px 0 rgba(0, 255, 255, 0.15);
      border-color: rgba(0, 255, 255, 0.35);
      transform: translateY(0);
    }
  }

  @keyframes dropdownGlowPulse {
    0%, 100% {
      box-shadow:
        0 0 20px rgba(0, 255, 255, 0.4),
        0 8px 32px 0 rgba(0, 255, 255, 0.15);
      border-color: rgba(0, 255, 255, 0.35);
    }
    50% {
      box-shadow:
        0 0 30px rgba(0, 255, 255, 0.5),
        0 8px 40px 0 rgba(0, 255, 255, 0.2);
      border-color: rgba(0, 255, 255, 0.45);
    }
  }

  // Input fields with glass effect
  .ant-input,
  .ant-input-affix-wrapper,
  .ant-picker {
    background: rgba(0, 255, 255, 0.05) !important;
    border: 1px solid rgba(0, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: rgba(255, 255, 255, 0.9) !important;
    
    &:hover, &:focus {
      border-color: rgba(0, 255, 255, 0.5) !important;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
    }
  }
  
  /* COMPLETELY REMOVE inner box from ALL search inputs with icons */
  .ant-input-affix-wrapper {
    /* The wrapper gets the glass effect */
    
    /* COMPLETELY HIDE the inner input box - make it invisible */
    & .ant-input,
    & input.ant-input {
      background: none !important;
      background-color: transparent !important;
      background-image: none !important;
      border: 0 !important;
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      
      &:hover,
      &:focus,
      &:active,
      &:focus-visible {
        background: none !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }
  }

  // Select dropdowns with glass effect (NO animation)
  .ant-select-selector {
    background: rgba(0, 255, 255, 0.05) !important;
    border: 1px solid rgba(0, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    color: rgba(255, 255, 255, 0.9) !important;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(0, 255, 255, 0.5) !important;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
    }
    
    &:focus, .ant-select-focused & {
      border-color: rgba(0, 255, 255, 0.5) !important;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3) !important;
    }
  }

  // Dropdown popup containers with glass effect (NO animation)
  .ant-select-dropdown {
    background: rgba(0, 255, 255, 0.03) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(0, 255, 255, 0.15) !important;
    box-shadow:
      0 0 20px rgba(0, 255, 255, 0.4),
      0 8px 32px 0 rgba(0, 255, 255, 0.15) !important;
  }

  // Other dropdown containers with glass effect (NO animation)
  .ant-dropdown,
  .ant-picker-dropdown {
    background: rgba(0, 255, 255, 0.03) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(0, 255, 255, 0.15) !important;
    box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1) !important;
  }

  // Enhanced glow animation ONLY for collapsible sections (as intended)
  .ant-collapse-content {
    animation: dropdownGlowFadeIn 0.8s ease-out forwards;
  }

  // Disable animation on header popovers (notification & settings dropdowns)
  // but allow animations on other popovers elsewhere in the app
  .ant-popover {
    animation: none !important;
  }

  // Sidebar with glass effect
  .ant-layout-sider {
    background: rgba(0, 255, 255, 0.06) !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid rgba(0, 255, 255, 0.15);
  }

  // Header with glass effect
  .ant-layout-header {
    background: rgba(0, 255, 255, 0.08) !important;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-bottom: 1px solid rgba(0, 255, 255, 0.15);
  }

  [data-no-transition] * {
    transition: none !important;
  }

  /* Hide all scrollbars completely while maintaining functionality */
  * {
    /* Firefox */
    scrollbar-width: none !important;
    /* IE/Edge */
    -ms-overflow-style: none !important;

    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
      display: none !important;
    }
  }

  body.no-scroll {
    overflow: hidden;
  }

  html, body, :root {
    background-color: #000000;
  }
  
  .range-picker {
    & .ant-picker-panels {
      @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px) {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .search-overlay {
    box-shadow: var(--box-shadow);

    @media only screen and ${media.xs} and (max-width: ${BREAKPOINTS.md - 0.02}px)  {
      width: calc(100vw - 16px);
      max-width: 600px;
    }

    @media only screen and ${media.md} {
      width: 323px;
    }
  }

  a {
    color: var(--primary-color);
    &:hover,:active {
      color: var(--primary-color);
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
  }
  
  .ant-picker-cell {
    color: var(--text-main-color);
  }
  .ant-picker-cell-in-view .ant-picker-calendar-date-value {
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.bold};
  }

  .ant-picker svg {
    color: var(--text-light-color);
  }

  .ant-notification-notice {
    width: 36rem;
    padding: 2rem;
    min-height: 6rem;
    background: rgba(0, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.2) !important;
    
    .ant-notification-notice-with-icon .ant-notification-notice-message {
      margin-bottom: 0;
      margin-left: 2.8125rem;
    }

    .ant-notification-notice-with-icon .ant-notification-notice-description {
      margin-left: 4.375rem;
      margin-top: 0;
    }

    .ant-notification-notice-icon {
      font-size: 2.8125rem;
      margin-left: 0
    }

    .ant-notification-notice-close {
      top: 1.25rem;
      right: 1.25rem;
    }

    .ant-notification-notice-close-x {
      display: flex;
      font-size: 0.9375rem;
    }

    .notification-without-description {
      .ant-notification-notice-close {
        top: 1.875rem;
      }
      .ant-notification-notice-with-icon .ant-notification-notice-description  {
        margin-top: 0.625rem;
      }
    }
    
    .title {
      font-size: ${FONT_SIZE.xxl};
      height: 3rem;
      margin-left: 1.5rem;
      display: flex;
      align-items: center;
      font-weight: ${FONT_WEIGHT.bold};

      &.title-only {
        color: var(--text-main-color);
        font-size: ${FONT_SIZE.md};
        height: 2rem;
        line-height: 2rem;
        margin-left: 0.75rem;
        font-weight: ${FONT_WEIGHT.semibold};
      }
    }
  
    .description {
      color: rgba(255, 255, 255, 0.8);
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.semibold};
      line-height: 1.375rem;
    }
  
    &.ant-notification-notice-success {
      border: 1px solid var(--success-color) !important;
      background: rgba(6, 182, 212, 0.1) !important;
      
      .title {
        color: var(--success-color);
      }
    }
  
    &.ant-notification-notice-info {
      border: 1px solid var(--primary-color) !important;
      background: rgba(0, 255, 255, 0.1) !important;
  
      .title {
        color: var(--primary-color);
      }
    }
  
    &.ant-notification-notice-warning {
      border: 1px solid var(--warning-color) !important;
      background: rgba(245, 158, 11, 0.1) !important;
  
      .title {
        color: var(--warning-color);
      }
    }
  
    &.ant-notification-notice-error {
      border: 1px solid var(--error-color) !important;
      background: rgba(239, 68, 68, 0.1) !important;
  
      .title {
        color: var(--error-color);
      }
    }
  
    .success-icon {
      color: var(--success-color);
    }
  
    .info-icon {
      color: var(--primary-color);
    }
  
    .warning-icon {
      color: var(--warning-color);
    }
  
    .error-icon {
      color: var(--error-color);
    }
  }
  
  .ant-menu-inline, .ant-menu-vertical {
    border-right: 0;
  }

  .custom-checkbox-group .ant-checkbox-inner, .protocol-checkbox-group .ant-checkbox-inner  {
    background-color: rgba(0, 255, 255, 0.05);
    border-color: rgba(0, 255, 255, 0.3);
  }

  .ant-alert-message {
    color: var(--text-main-color);
  }

  .custom-checkbox-group .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--primary-color); 
    border-color: var(--primary-color);
  }

  .custom-checkbox-group.blacklist-mode-active .ant-checkbox-checked .ant-checkbox-inner{
    border-color: var(--error-color);
    background-color: var(--error-color);
  }
    
  .blacklist-mode-active .ant-checkbox .ant-checkbox-inner::after {
    content: "X";
    background-color: var(--error-color);
    font-weight: bold;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; 
    height: 100%; 
    text-align: center; 
  }

  .custom-checkbox-group .blacklist-mode-active .ant-checkbox-checked .ant-checkbox-inner{
    background-color: var(--error-color);
    border-color: var(--error-color);
  }

  .custom-checkbox-group .ant-checkbox-group-item span label {
    font-size: .95rem;
  }

  .ant-checkbox-disabled .ant-checkbox-inner {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: .5;
  }

  .antcheckbox-disabled {
    opacity: .5;
  }

  .checkboxHeader {
    padding: 0rem 0 .5rem 0;
  }
    
  .grid-checkbox-group {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    column-gap: 1rem;
    row-gap: 1.6rem;
  }

  .grid-mobile-checkbox-group {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(7.3rem, 1fr));
    gap: 1.2rem;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    white-space: nowrap;  
  }

  .dynamic-group {
    padding-top: 1rem; 
    padding-bottom: 0rem;
  }

  .grid-checkbox-group.large-label {
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  }

  .switch-container {
    padding-bottom: 1rem;
  }

  .w-full {
    width: 100%;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .centered-header .ant-collapse-header {
    justify-content: center;
    padding-top: 10px;  
  }

  .custom-dropdown .ant-select-arrow {
    color: var(--text-nft-light-color);
  }

  .custom-tooltip-class .ant-tooltip-content .ant-tooltip-inner {
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(0, 255, 255, 0.2);
  }

  @media only screen and ${media.xs} {
    .ant-menu-inline-collapsed-tooltip{
      display: none !important;
    }
  }
`;