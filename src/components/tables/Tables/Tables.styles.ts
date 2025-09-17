import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
const borderRad = '12px';
export const TablesWrapper = styled.div`
  margin-top: 1.875rem;
  
  /* Main table styling with glass morphism and 3D effects */
  .ant-table-wrapper {
    background: linear-gradient(135deg,
      rgba(0, 191, 255, 0.08) 0%,
      rgba(0, 255, 255, 0.04) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 2px;
    box-shadow:
      0 20px 40px rgba(0, 191, 255, 0.15),
      0 10px 20px rgba(0, 255, 255, 0.1),
      inset 0 2px 4px rgba(0, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 191, 255, 0.1);
    transform: translateZ(0);
    transform-style: preserve-3d;
  }
  
  /* Table header with 3D effect */
  .ant-table-thead > tr > th {
    background: linear-gradient(135deg,
      rgba(0, 191, 255, 0.15) 0%,
      rgba(0, 255, 255, 0.1) 100%);
    border-bottom: 2px solid rgba(0, 255, 255, 0.3);
    color: rgba(0, 255, 255, 1);
    font-weight: 600;
    text-shadow:
      0 0 20px rgba(0, 255, 255, 0.5),
      0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(0, 255, 255, 0.8) 50%,
        transparent 100%);
    }
  }
  
  /* Table row hover effect - highlight only */
  .ant-table-row {
    transition: background 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg,
        rgba(0, 191, 255, 0.12) 0%,
        rgba(0, 255, 255, 0.08) 100%) !important;
    }
    
    &.expanded-row {
      background: linear-gradient(135deg,
        rgba(0, 191, 255, 0.15) 0%,
        rgba(0, 255, 255, 0.1) 100%) !important;
      
      td {
        border-bottom: 2px solid rgba(0, 255, 255, 0.3) !important;
      }
    }
  }
  
  /* Table cells with depth */
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid rgba(0, 191, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    
    &:first-child {
      font-weight: 500;
      color: rgba(0, 255, 255, 0.95);
    }
  }
  
  /* Expanded row container with glass effect */
  .ant-table-expanded-row {
    background: transparent !important;
    
    &:hover {
      background: transparent !important;
    }
    
    > td {
      padding: 0 !important;
      background: transparent !important;
      background-color: transparent !important;
      border-bottom: 2px solid rgba(0, 255, 255, 0.2) !important;
      box-shadow: 0 4px 8px rgba(0, 191, 255, 0.1);
    }
    
    .ant-table-expanded-row-fixed {
      background: transparent !important;
    }
  }
  
  /* Cursor and interaction */
  .ant-table-tbody > tr {
    cursor: pointer;
  }
  
  /* Expand icons with glow effect */
  .anticon-caret-down,
  .anticon-caret-right {
    color: rgba(0, 255, 255, 1);
    font-size: 14px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.8));
  }
  
  .anticon-caret-down {
    transform: rotateX(0deg);
    filter: drop-shadow(0 0 8px rgba(0, 255, 255, 1));
  }
  
  .anticon-caret-right:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 12px rgba(0, 255, 255, 1));
  }
  
  /* Sorting arrows with 3D effect */
  .ant-table-column-sorters {
    .anticon {
      color: rgba(0, 255, 255, 0.6);
      transition: all 0.3s ease;
      
      &.active {
        color: rgba(0, 255, 255, 1);
        filter: drop-shadow(0 0 8px rgba(0, 255, 255, 1));
      }
    }
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
  background: linear-gradient(135deg,
    rgba(0, 10, 20, 0.95) 0%,
    rgba(0, 20, 40, 0.9) 100%);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow:
    0 24px 48px rgba(0, 191, 255, 0.2),
    0 12px 24px rgba(0, 255, 255, 0.15),
    inset 0 2px 4px rgba(0, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 191, 255, 0.2);
  transform: translateZ(0);
  transform-style: preserve-3d;
  position: relative;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg,
      rgba(0, 255, 255, 0.4) 0%,
      transparent 30%,
      transparent 70%,
      rgba(0, 191, 255, 0.4) 100%);
    border-radius: 16px;
    opacity: 0.6;
    z-index: -1;
  }
  
  .ant-card-head {
    border-bottom: 2px solid rgba(0, 255, 255, 0.2);
    background: linear-gradient(135deg,
      rgba(0, 191, 255, 0.08) 0%,
      rgba(0, 255, 255, 0.04) 100%);
    
    .ant-card-head-title {
      color: rgba(0, 255, 255, 1);
      text-shadow:
        0 0 20px rgba(0, 255, 255, 0.6),
        0 2px 4px rgba(0, 0, 0, 0.4);
      font-weight: 600;
      font-size: 1.2rem;
    }
  }
  
  .table-mobile > div.ant-card-head-title {
    padding-bottom: 0.3rem !important;
  }
  
  .ant-card-body {
    padding: 1.2rem;
    width: 100%;
    background: transparent;
  }
  
  .ant-card-head-title {
    padding: 0;
    margin: 1rem 0rem 1rem 0rem;
  }
  
  .ant-table-tbody > tr > td {
    padding: 1rem;
    transition: all 0.3s ease;
  }
  
  div.ant-table.ant-table-bordered,
  div.ant-table-container,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table {
    border-radius: ${borderRad};
    border: 1px solid rgba(0, 255, 255, 0.15);
    overflow: hidden;
  }
  
  .ant-table-container {
    box-shadow:
      inset 0 2px 4px rgba(0, 255, 255, 0.1),
      inset 0 -2px 4px rgba(0, 191, 255, 0.05);
      
    table > thead > tr:first-child th:first-child {
      border-top-left-radius: ${borderRad};
    }
    
    table > thead > tr:first-child th:last-child {
      border-top-right-radius: ${borderRad};
    }
    
    table > tbody > tr:last-child td:last-child {
      border-bottom-right-radius: ${borderRad};
    }
    
    table > tbody > tr:last-child td:first-child {
      border-bottom-left-radius: ${borderRad};
    }
  }
`;
