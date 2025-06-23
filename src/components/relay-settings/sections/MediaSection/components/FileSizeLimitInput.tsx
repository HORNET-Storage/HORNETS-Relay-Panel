// src/components/relay-settings/sections/MediaSection/components/FileSizeLimitInput.tsx

import React from 'react';
import { InputNumber } from 'antd';
import styled from 'styled-components';

const StyledContainer = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  background: var(--additional-background-color);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const StyledLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main-color);
  flex: 1;
  min-width: 0;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  .ant-input-number {
    width: 80px;
    height: 28px;
    background: var(--background-color);
    border-color: var(--border-color);
    border-radius: 4px;
    
    &:hover {
      border-color: var(--primary-color);
    }
    
    &:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }
    
    .ant-input-number-input {
      color: var(--text-main-color);
      font-size: 12px;
      height: 26px;
      line-height: 26px;
    }
    
    &.ant-input-number-disabled {
      background: var(--secondary-background-color);
      border-color: var(--border-color);
      opacity: 0.6;
      
      .ant-input-number-input {
        color: var(--text-light-color);
      }
    }
  }
`;

const StyledUnit = styled.span`
  font-size: 12px;
  color: var(--text-light-color);
  font-weight: 500;
  min-width: 20px;
`;

export interface FileSizeLimitInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const FileSizeLimitInput: React.FC<FileSizeLimitInputProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 5000,
  step = 1,
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
      <StyledInputWrapper>
        <InputNumber
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={min.toString()}
          precision={0}
          size="small"
        />
        <StyledUnit>MB</StyledUnit>
      </StyledInputWrapper>
    </StyledContainer>
  );
};

export default FileSizeLimitInput;