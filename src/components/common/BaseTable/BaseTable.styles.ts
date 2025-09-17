import styled from 'styled-components';
import { Table as AntdTable } from 'antd';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const Table = styled(AntdTable)`
  & thead .ant-table-cell {
    color: rgba(0, 178, 178, 0.9);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;
    font-weight: 600;
    background: linear-gradient(135deg,
      rgba(0, 139, 178, 0.08) 0%,
      rgba(0, 178, 178, 0.05) 100%);
    text-shadow: 0 0 8px rgba(0, 178, 178, 0.3);
    border-bottom: 2px solid rgba(0, 178, 178, 0.25);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(0, 178, 178, 0.4) 50%,
        transparent 100%);
    }

    & .anticon {
      color: rgba(0, 178, 178, 0.8);
      filter: drop-shadow(0 0 3px rgba(0, 178, 178, 0.5));
    }
  }
  

  & tbody .ant-table-cell {
    color: rgba(255, 255, 255, 0.85);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;
    border-bottom: 1px solid rgba(0, 139, 178, 0.12);
  }
  
  /* Ensure expanded rows have transparent background */
  & .ant-table-expanded-row {
    background: transparent !important;
    background-color: transparent !important;
    
    > td {
      background: transparent !important;
      background-color: transparent !important;
    }
  }
  
  /* Remove any default white backgrounds on expansion cells */
  & .ant-table-tbody > tr.ant-table-expanded-row > td {
    background: transparent !important;
    background-color: transparent !important;
  }

  & tbody .ant-table-row-expand-icon {
    min-height: 1.25rem;
    min-width: 1.25rem;
    border-radius: 0.1875rem;
    margin-top: 0;
  }

  // Override default antd selector - remove vertical lines
  &
    .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }
  
  /* Remove all vertical borders from Ant table cells */
  & .ant-table-cell {
    border-right: none !important;
    border-left: none !important;
  }
  
  & .ant-table-thead > tr > th {
    border-right: none !important;
    border-left: none !important;
  }
  
  & .ant-table-tbody > tr > td {
    border-right: none !important;
    border-left: none !important;
  }

  & .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next,
  .ant-pagination-item {
    min-width: 2.0625rem;
    height: 2.0625rem;
    line-height: 2.0625rem;
    border-radius: 0;
    font-size: ${FONT_SIZE.xs};
  }

  & .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    border-radius: 0;
  }

  & .ant-checkbox-inner {
    border-radius: 0.1875rem;
    height: 1.25rem;
    width: 1.25rem;
    border: 1px solid var(--primary-color);
  }

  & .editable-row .ant-form-item-explain {
    position: absolute;
    top: 100%;
    font-size: 0.75rem;
  }

  .ant-table-column-sort {
    background-color: transparent;
  }
  .ant-table-column-title {
    z-index: 0;
  }

  .ant-pagination-item-container .ant-pagination-item-ellipsis {
    color: var(--disabled-color);
  }

  .ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }

  .ant-pagination.ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }
`;
