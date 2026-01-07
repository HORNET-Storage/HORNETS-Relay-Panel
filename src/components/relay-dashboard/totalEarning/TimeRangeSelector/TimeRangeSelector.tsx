import React from 'react';
import { Radio } from 'antd';
import styled from 'styled-components';

export type TimeRange = '1day' | '1week' | '1month' | '1year';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.05rem;
  margin-bottom: 0;
`;

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  gap: 0.5rem;

  .ant-radio-button-wrapper {
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 6px;
    color: rgba(0, 255, 255, 0.8);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    min-width: 2rem;
    height: auto;
    line-height: 1.2;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    align-items: center;
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

      &:hover {
        background: rgba(0, 255, 255, 0.15);
        border-color: rgba(0, 255, 255, 0.6);
        color: #00ffff;
      }
    }

    &:not(:first-child)::before {
      display: none;
    }

    &:nth-child(1) {
      min-width: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .ant-radio-button-wrapper {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }
  }
`;

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const handleChange = (e: any) => {
    onChange(e.target.value as TimeRange);
  };

  return (
    <Container>
      <StyledRadioGroup
        value={value}
        onChange={handleChange}
        optionType="button"
        buttonStyle="solid"
      >
        <Radio.Button value="1day">24H</Radio.Button>
        <Radio.Button value="1week">1W</Radio.Button>
        <Radio.Button value="1month">1M</Radio.Button>
        <Radio.Button value="1year">1Y</Radio.Button>
      </StyledRadioGroup>
    </Container>
  );
};