import styled from 'styled-components';
import { Input } from 'antd';

export const InputField = styled(Input)`
  &.ant-input-affix-wrapper {
    padding: 0 !important;
  }
  &.ant-input-affix-wrapper {
    background-color: var(--input-bg-color) !important;
    input.ant-input {
      padding: 0.5rem !important;
      border: none !important;
      background-color: transparent !important;
    }
    .ant-input-prefix {
    
      padding: 0.5rem 0rem 0.5rem 0.5rem !important;
    }
  }
`;
