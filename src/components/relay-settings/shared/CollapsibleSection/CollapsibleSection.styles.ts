// src/components/relay-settings/shared/CollapsibleSection/CollapsibleSection.styles.ts

import styled from 'styled-components';
import { Collapse } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const StyledCollapse = styled(Collapse)`
  /* Remove all container styling */
  padding: 0 !important;
  margin: 0 0 1.5rem 0 !important;
  background: transparent !important;
  border: none !important;

  .ant-collapse-item {
    border: none !important;
    border-bottom: none !important;
    background: transparent !important;
    margin: 0 !important;
  }

  /* Minimal header - no box appearance */
  .ant-collapse-header {
    padding: 1rem 0;
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.md};
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transition: color 0.3s ease;

    /* Remove gradient accent line */
    &::before {
      display: none !important;
    }

    &:hover {
      background: transparent !important;
      transform: none !important;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .ant-collapse-content {
    border-top: none !important;
    background: transparent !important;
    padding: 0 !important;
  }
  
  /* Hide the content wrapper entirely when collapsed */
  .ant-collapse-item:not(.ant-collapse-item-active) .ant-collapse-content {
    display: none !important;
  }

  .ant-collapse-content-box {
    /* Completely remove all container styling */
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    border-radius: 0 !important;
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