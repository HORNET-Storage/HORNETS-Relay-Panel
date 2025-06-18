import styled from 'styled-components';
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