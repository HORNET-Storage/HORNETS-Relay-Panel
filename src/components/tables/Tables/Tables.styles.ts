import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
const borderRad = '.5rem';
export const TablesWrapper = styled.div`
  margin-top: 1.875rem;
  
  .ant-table-row {
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 191, 255, 0.05) !important;
    }
    
    &.expanded-row {
      background: rgba(0, 191, 255, 0.08) !important;
      
      td {
        border-bottom: 1px solid rgba(0, 191, 255, 0.2) !important;
      }
    }
  }
  
  .ant-table-expanded-row {
    background: transparent !important;
    
    &:hover {
      background: transparent !important;
    }
    
    > td {
      padding: 0 !important;
      background: transparent !important;
      background-color: transparent !important;
      border-bottom: 1px solid rgba(0, 191, 255, 0.2) !important;
    }
    
    .ant-table-expanded-row-fixed {
      background: transparent !important;
    }
  }
  
  .ant-table-tbody > tr {
    cursor: pointer;
  }
  
  .anticon-caret-down,
  .anticon-caret-right {
    color: rgba(0, 191, 255, 1);
    font-size: 14px;
    transition: transform 0.3s ease;
  }
  
  .anticon-caret-down {
    filter: drop-shadow(0 0 4px rgba(0, 191, 255, 0.8));
  }
  
  /* Ensure chart backgrounds are transparent */
  canvas {
    background: transparent !important;
    background-color: transparent !important;
  }
  
  /* Chart.js canvas container and all wrappers */
  .chartjs-render-monitor,
  .chartjs-size-monitor,
  [class*="chart-container"] {
    background: transparent !important;
    background-color: transparent !important;
  }
  
  /* Ant Table expanded row content area */
  .ant-table-expanded-row-fixed,
  .ant-table-tbody > .ant-table-expanded-row > td,
  .ant-table-expanded-row-level-1 {
    background: transparent !important;
    background-color: transparent !important;
  }
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  .table-mobile > div.ant-card-head-title {
    padding-bottom: 0.3rem !important;
  }
  .ant-card-body {
    padding: 0 .8rem 0.8rem 0.8rem;
    width: 100%;
  }
  .ant-card-head-title {
    padding: 0;
    margin: 1rem 0rem 1rem 0rem;
  }
  .ant-table-tbody > tr > td {
    padding: 0.8rem;
  }
  
  div.ant-table.ant-table-bordered,
  div.ant-table-container,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table {
    border-radius: ${borderRad};
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: ${borderRad};
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: ${borderRad};
  }
  .ant-table-container table > tbody > tr:last-child td:last-child {
    border-bottom-right-radius: ${borderRad};
  }
  .ant-table-container table > tbody > tr:last-child td:first-child {
    border-bottom-left-radius: ${borderRad};
  }
`;
