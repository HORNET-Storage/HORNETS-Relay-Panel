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

  /* Subtle form item hover effect */
  .ant-form-item {
    transition: background 0.3s ease;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.75rem;

    &:hover {
      background: rgba(0, 255, 255, 0.02);
    }
  }

  /* Input hover effects to match cyan theme */
  .ant-input,
  .ant-input-number,
  .ant-select-selector,
  .ant-input-password {
    transition: all 0.3s ease;

    &:hover:not(:focus) {
      border-color: rgba(0, 255, 255, 0.3) !important;
    }

    &:focus,
    &:focus-within {
      border-color: rgba(0, 255, 255, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.1) !important;
    }
  }

  /* Switch hover effects */
  .ant-switch {
    &:hover:not(.ant-switch-disabled) {
      background-color: rgba(0, 255, 255, 0.3);
    }
  }
`;