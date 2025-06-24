import styled from 'styled-components';
import { Switch } from 'antd';
import { media } from '@app/styles/themes/constants';

export const Container = styled.div`
  width: 100%;
`;

export const TabContent = styled.div`
  padding: 1rem 0;
`;

export const TabHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const NpubText = styled.code`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  background: var(--background-color-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-main-color);
`;

export const TierTag = styled.span`
  background: var(--primary-color);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;

export const BulkImportContainer = styled.div`
  p {
    margin-bottom: 0.5rem;
    color: var(--text-main-color);
  }

  ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.25rem;
      color: var(--text-secondary-color);
      
      code {
        background: var(--background-color-secondary);
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 12px;
      }
    }
  }
`;

export const StyledSwitch = styled(Switch)`
  &.ant-switch {
    /* When switch is OFF (unchecked) */
    background-color: #434343 !important;
    border: 1px solid #666 !important;
    
    /* When switch is ON (checked) */
    &.ant-switch-checked {
      background-color: var(--primary-color) !important;
      border: 1px solid var(--primary-color) !important;
    }
    
    /* Handle styling */
    .ant-switch-handle {
      background-color: #fff !important;
      border: 1px solid #d9d9d9;
      
      &::before {
        background-color: #fff !important;
      }
    }
    
    /* Disabled state */
    &.ant-switch-disabled {
      background-color: #2a2a2a !important;
      border: 1px solid #444 !important;
      opacity: 0.6;
      
      .ant-switch-handle {
        background-color: #666 !important;
      }
    }
    
    /* Loading state */
    &.ant-switch-loading {
      background-color: #434343 !important;
      border: 1px solid #666 !important;
      
      &.ant-switch-checked {
        background-color: var(--primary-color) !important;
        opacity: 0.7;
      }
    }
  }
`;

export const PermissionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main-color);
  font-size: 14px;
`;