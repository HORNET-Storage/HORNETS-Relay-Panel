import styled from 'styled-components';
import { media } from '../../../../styles/themes/constants';

export const Container = styled.div`
  width: 100%;
`;

export const PermissionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--background-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color-base);

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const PermissionLabel = styled.div`
  font-weight: 600;
  color: var(--text-main-color);
  font-size: 16px;
  min-width: 80px;
`;

export const PermissionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${media.md} {
    width: 100%;
    justify-content: space-between;
  }
`;

export const PermissionNotes = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--background-color-light);
  border-radius: 6px;
  border-left: 4px solid var(--primary-color);
`;

export const NoteItem = styled.div`
  margin-bottom: 0.5rem;
  font-size: 13px;
  color: var(--text-secondary-color);
  line-height: 1.4;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--text-main-color);
  }
`;

export const PermissionExplanations = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--background-color-light);
  border-radius: 6px;
  border-left: 4px solid var(--primary-color);

  h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-main-color);
    font-size: 14px;
    font-weight: 600;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;

    li {
      margin-bottom: 0.5rem;
      font-size: 13px;
      color: var(--text-secondary-color);
      line-height: 1.4;

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        color: var(--text-main-color);
      }
    }
  }
`;

export const ForcedSelectWrapper = styled.div<{ $isForced: boolean }>`
  .ant-select {
    width: 100%;
    .ant-select-arrow{
      color: ${(props) => (!props.$isForced ? `var(--text-main-color)` : `var(--text-light-color)`)};
    }
    .ant-select-selector {
      background-color: ${(props) => (props.$isForced ? '#1a1d35' : '#25284B')} !important;
      border: ${(props) => (props.$isForced ? '1px solid #434343' : '1px solid #d9d9d9')} !important;
      color: ${(props) => (props.$isForced ? '#8c8c8c' : '#d9d9d9')} !important;
    }

    .ant-select-selection-item {
      color: ${(props) => (props.$isForced ? '#8c8c8c' : '#d9d9d9')} !important;
    }

    &.ant-select-disabled {
      .ant-select-selector {
        background-color: ${(props) => (props.$isForced ? '#1a1d35' : '#25284B')} !important;
        border: ${(props) => (props.$isForced ? '1px solid #434343' : '1px solid #d9d9d9')} !important;
      }

      .ant-select-selection-item {
        color: ${(props) => (props.$isForced ? '#8c8c8c' : '#d9d9d9')} !important;
      }
    }
  }
`;
