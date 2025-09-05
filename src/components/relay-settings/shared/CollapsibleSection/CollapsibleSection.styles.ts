// src/components/relay-settings/shared/CollapsibleSection/CollapsibleSection.styles.ts

import styled from 'styled-components';
import { Collapse } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const StyledCollapse = styled(Collapse)`
  /* Liquid Glass Theme Background */
  padding: 0.5rem 0;
  margin: 0 0 0.5rem 0;
  background: transparent;
  border: none;

  .ant-collapse-item {
    border-bottom: none;
  }

  /* Liquid Glass Header Styling */
  .ant-collapse-header {
    padding: 1.5rem 2rem;
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.md};
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    /* Gradient accent line */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(
        180deg,
        rgba(138, 43, 226, 0.6) 0%,
        rgba(33, 150, 243, 0.4) 100%
      );
      border-radius: 2px 0 0 2px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 3px rgba(255, 255, 255, 0.25);
    }
  }

  .ant-collapse-content {
    border-top: none;
    background: transparent;
    padding: 0 !important;
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

      /* Center the gradient accent line */
      &::before {
        display: none !important;
      }
    }

    /* Add a different effect for centered headers */
    .ant-collapse-header::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(138, 43, 226, 0.4) 0%,
        rgba(33, 150, 243, 0.4) 50%,
        rgba(138, 43, 226, 0.4) 100%
      );
      border-radius: 1px;
    }
  }
`;

export const StyledPanel = styled(Collapse.Panel)`
  border: none;
  background: transparent;
`;