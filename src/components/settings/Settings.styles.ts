import styled from 'styled-components';
import { Input, InputNumber, Select, Button } from 'antd';

export const InputField = styled(Input)`
  border-radius: 7px !important;
  padding: 0.7rem !important;
  &:focus {
    border-color: var(--ant-primary-5) !important;
    box-shadow: 0 0 0 2px var(--ant-primary-color-outline) !important;
  }
`;

export const InputFieldWithPrefix = styled(Input)`
  &.ant-input-affix-wrapper {
    padding: 0 !important;
  }
  &.ant-input-affix-wrapper {
    background-color: var(--input-bg-color) !important;
    input.ant-input {
      padding: 0.7rem !important;
      border: none !important;
      background-color: transparent !important;
    }
    .ant-input-prefix {
      padding: 0.7rem 0rem 0.7rem 0.7rem !important;
    }
  }
`;
export const PasswordField = styled(Input.Password)`
  &.ant-input-affix-wrapper {
    padding: 0 !important;
    background-color: var(--input-bg-color) !important;
    input.ant-input {
      padding: 0.7rem !important;
      border: none !important;
      background-color: transparent !important;
    }
    .ant-input-prefix {
      padding: 0.7rem 0rem 0.7rem 0.7rem !important;
    }
    .ant-input-suffix {
      padding: 0.7rem 0.7rem 0.7rem 0 !important;
      .ant-input-password-icon.anticon {
        color: var(--text-main-color) !important;
        opacity: 0.7 !important;
      }
    }
  }
`;
export const InputNumberField = styled(InputNumber)`
  &.ant-input-number {
    border-radius: 7px !important;
    padding: 0rem !important;
  }
  &.ant-input-number:focus {
    border-color: var(--ant-primary-5) !important;
    box-shadow: 0 0 0 2px var(--ant-primary-color-outline) !important;
  }
  .anticon-up.ant-input-number-handler-up-inner,
  .anticon-down.ant-input-number-handler-down-inner {
    color: var(--text-main-color) !important;
    opacity: 0.7 !important;
  }
`;

export const SelectField = styled(Select)`
  .ant-select-arrow,
  .ant-select-clear {
    color: var(--text-main-color) !important;
  }
`;
export const UploadButton = styled(Button)`
  margin-right: 0.5rem;
`;
export const UploadedImageWrapper = styled.div`
  border-radius: 100%;
  margin 1rem  0 0 0;
  width: 12rem;
  height: 12rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
