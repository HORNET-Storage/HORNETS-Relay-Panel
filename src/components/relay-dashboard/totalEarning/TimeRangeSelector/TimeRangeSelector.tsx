import React, { useState } from 'react';
import { Radio, Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styled from 'styled-components';

export type TimeRange = '1day' | '1week' | '1month' | '1year' | '2year' | '3year' | '5year' | 'all';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 0.5rem;
  
  .ant-radio-button-wrapper {
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.2);
    color: rgba(0, 255, 255, 0.8);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    height: auto;
    line-height: 1.2;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 255, 255, 0.1);
      border-color: rgba(0, 255, 255, 0.4);
      color: rgba(0, 255, 255, 1);
    }
    
    &.ant-radio-button-wrapper-checked {
      background: rgba(0, 255, 255, 0.15);
      border-color: rgba(0, 255, 255, 0.6);
      color: #00ffff;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      
      &::before {
        background-color: rgba(0, 255, 255, 0.6);
      }
    }
    
    &:not(:first-child)::before {
      background-color: rgba(0, 255, 255, 0.2);
    }
  }

  @media (max-width: 768px) {
    .ant-radio-button-wrapper {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }
  }
`;

const StyledDropdownButton = styled(Dropdown.Button)`
  .ant-btn {
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.2);
    color: rgba(0, 255, 255, 0.8);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    height: auto;
    line-height: 1.2;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 255, 255, 0.1);
      border-color: rgba(0, 255, 255, 0.4);
      color: rgba(0, 255, 255, 1);
    }
    
    &.active {
      background: rgba(0, 255, 255, 0.15);
      border-color: rgba(0, 255, 255, 0.6);
      color: #00ffff;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
  }
  
  .ant-dropdown-trigger {
    padding: 0 8px;
  }
  
  @media (max-width: 768px) {
    .ant-btn {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }
  }
`;

const yearOptions = [
  { label: '1 Year', value: '1year' },
  { label: '2 Years', value: '2year' },
  { label: '3 Years', value: '3year' },
  { label: '5 Years', value: '5year' },
  { label: 'All Time', value: 'all' },
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const isYearRange = ['1year', '2year', '3year', '5year', 'all'].includes(value);
  const nonYearValue = !isYearRange ? value : undefined;
  
  const [selectedYearLabel, setSelectedYearLabel] = useState(() => {
    const option = yearOptions.find(opt => opt.value === value);
    return option ? option.label : '1 Year';
  });

  const handleYearSelect: MenuProps['onClick'] = ({ key }) => {
    const option = yearOptions.find(opt => opt.value === key);
    if (option) {
      setSelectedYearLabel(option.label);
      onChange(key as TimeRange);
    }
  };

  const yearMenuItems: MenuProps['items'] = yearOptions.map(option => ({
    key: option.value,
    label: option.label,
  }));

  const handleNonYearChange = (e: any) => {
    onChange(e.target.value as TimeRange);
  };

  return (
    <Container>
      <StyledRadioGroup
        value={nonYearValue}
        onChange={handleNonYearChange}
        optionType="button"
        buttonStyle="solid"
      >
        <Radio.Button value="1day">1 Day</Radio.Button>
        <Radio.Button value="1week">1 Week</Radio.Button>
        <Radio.Button value="1month">1 Month</Radio.Button>
      </StyledRadioGroup>
      
      <StyledDropdownButton
        menu={{ items: yearMenuItems, onClick: handleYearSelect }}
        className={isYearRange ? 'active' : ''}
        icon={<DownOutlined />}
      >
        {selectedYearLabel}
      </StyledDropdownButton>
    </Container>
  );
};