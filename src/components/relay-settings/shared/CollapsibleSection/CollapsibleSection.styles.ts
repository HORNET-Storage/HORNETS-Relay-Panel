// src/components/relay-settings/shared/CollapsibleSection/CollapsibleSection.styles.ts

import styled from 'styled-components';
import { Collapse } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const StyledCollapse = styled(Collapse)`
  padding: 1rem 0;
  margin: 0 0 1rem 0;
  background: transparent;
  border-radius: 1rem;
  border: none;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.8);

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
    margin: 0 1rem;
  }

  .ant-collapse-content-box {
    padding: .5rem .5rem;
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