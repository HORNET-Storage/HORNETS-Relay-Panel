// src/components/relay-settings/sections/MediaSection/components/FileSizeLimitInput.tsx

import React from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { InputNumber, Space } from 'antd';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 16px 0;
  padding: 12px;
  background: var(--secondary-background-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const StyledLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main-color);
  margin-bottom: 8px;
`;

const StyledDescription = styled.div`
  font-size: 12px;
  color: var(--text-light-color);
  margin-bottom: 12px;
`;

const StyledInputWrapper = styled.div`
  .ant-input-number {
    width: 120px;
    background: var(--background-color);
    border-color: var(--border-color);
    color: var(--text-main-color);
    
    &:hover {
      border-color: var(--primary-color);
    }
    
    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color)20;
    }
  }
  
  .ant-input-number-input {
    color: var(--text-main-color);
  }
`;

const StyledUnit = styled.span`
  font-size: 14px;
  color: var(--text-light-color);
  margin-left: 8px;
`;

export interface FileSizeLimitInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  disabled?: boolean;
}

export const FileSizeLimitInput: React.FC<FileSizeLimitInputProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 5000,
  step = 1,
  description,
  disabled = false,
}) => {
  const handleChange = (newValue: number | null) => {
    if (newValue !== null && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <StyledContainer>
      <StyledLabel>{label}</StyledLabel>
      {description && <StyledDescription>{description}</StyledDescription>}
      <StyledInputWrapper>
        <Space align="center">
          <InputNumber
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            placeholder="Enter size"
            precision={0}
          />
          <StyledUnit>MB</StyledUnit>
        </Space>
      </StyledInputWrapper>
    </StyledContainer>
  );
};

export default FileSizeLimitInput;