// src/components/relay-settings/shared/CollapsibleSection/CollapsibleSection.styles.ts

import styled from 'styled-components';
import { Collapse } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const StyledCollapse = styled(Collapse)`
  /* Glass morphism container with rounded edges */
  padding: 0 !important;
  margin: 0 0 1.5rem 0 !important;
  background: rgba(0, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(0, 255, 255, 0.15) !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1) !important;
  animation: dropdownGlowFadeIn 0.8s ease-out forwards;

  .ant-collapse-item {
    border: none !important;
    border-bottom: none !important;
    background: transparent !important;
    margin: 0 !important;
    
    &:first-child .ant-collapse-header {
      border-radius: 12px 12px 0 0;
    }
    
    &:last-child {
      .ant-collapse-header {
        border-radius: 0 0 12px 12px;
      }
      
      &.ant-collapse-item-active .ant-collapse-header {
        border-radius: 0;
      }
    }
    
    &:only-child {
      .ant-collapse-header {
        border-radius: 12px;
      }
      
      &.ant-collapse-item-active .ant-collapse-header {
        border-radius: 12px 12px 0 0;
      }
    }
  }

  /* Header with subtle glass effect */
  .ant-collapse-header {
    padding: 1rem 1.5rem;
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.md};
    background: rgba(0, 255, 255, 0.02) !important;
    backdrop-filter: blur(5px) !important;
    -webkit-backdrop-filter: blur(5px) !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transition: all 0.3s ease;

    /* Remove gradient accent line */
    &::before {
      display: none !important;
    }

    &:hover {
      background: rgba(0, 255, 255, 0.05) !important;
      transform: none !important;
      color: rgba(255, 255, 255, 0.95);
    }
  }

  .ant-collapse-content {
    border-top: 1px solid rgba(0, 255, 255, 0.1) !important;
    background: transparent !important;
    padding: 0 !important;
  }
  
  /* Hide the content wrapper entirely when collapsed */
  .ant-collapse-item:not(.ant-collapse-item-active) .ant-collapse-content {
    display: none !important;
  }

  .ant-collapse-content-box {
    /* Content area with subtle padding */
    padding: 1.5rem !important;
    margin: 0 !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    border-radius: 0 0 12px 12px !important;
    box-shadow: none !important;
  }

  &.centered-header {
    .ant-collapse-header {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      /* Remove all decorative elements */
      &::before,
      &::after {
        display: none !important;
      }
    }
  }
`;

export const StyledPanel = styled(Collapse.Panel)`
  border: none;
  background: transparent;
`;