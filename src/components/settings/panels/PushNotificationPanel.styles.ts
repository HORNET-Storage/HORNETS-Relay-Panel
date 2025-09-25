import styled from 'styled-components';

export const PanelWrapper = styled.div`
  /* Keep it simple to match other panels */
  background: transparent;
  width: 100%;
  
  /* Remove ant-card default styles since we're inside a Card */
  .ant-card-body {
    padding: 0 !important;
    display: block !important;
  }
  
  /* Style dividers to match cyan theme */
  .ant-divider {
    border-color: rgba(82, 196, 255, 0.3) !important;
    margin: 1.5rem 0;
  }

  /* Remove hover effects from form items - no glow on individual items */
  .ant-form-item {
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.75rem;
  }
`;