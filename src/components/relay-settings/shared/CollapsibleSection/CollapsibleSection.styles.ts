// src/components/relay-settings/shared/CollapsibleSection/CollapsibleSection.styles.ts

import styled from 'styled-components';
import { Collapse } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const StyledCollapse = styled(Collapse)`
  padding: 1rem 0;
  margin: 0 0 1rem 0;
  background: transparent;
  border: none;

  .ant-collapse-item {
    border-bottom: none;
  }

  .ant-collapse-header {
    padding: 0;
    color: var(--text-main-color);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.md};
  }

  .ant-collapse-content {
    border-top: none;
    background: transparent;
  }

  .ant-collapse-content-box {
    padding: 1rem 0 0 0;
  }

  &.centered-header {
    .ant-collapse-header {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const StyledPanel = styled(Collapse.Panel)`
  border: none;
  background: transparent;
`;