import styled from 'styled-components';
import { Input } from 'antd';

export const InputField = styled(Input)`
  &.ant-input-affix-wrapper {
    background-color: var(--layout-sider-bg-color);
  }
  .ant-input {
    border: none !important;
  }
`;
