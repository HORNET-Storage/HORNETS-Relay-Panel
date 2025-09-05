import styled from 'styled-components';
import { Switch as AntdSwitch } from 'antd';

export const Switch = styled(AntdSwitch)`
  &.ant-switch[aria-checked='false'] {
    background-image: linear-gradient(to right, var(--disabled-color), var(--disabled-color)),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  &.ant-switch[aria-checked='false'].balanceSwitch {
    background-image: linear-gradient(to right, rgba(82, 196, 255, 0.3), rgba(82, 196, 255, 0.3)),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  &.ant-switch[aria-checked='false'].modeSwitch {
    background-image: linear-gradient(to right, red, red),
      linear-gradient(to right, var(--background-color), var(--background-color));
  }
  
  /* Subtle visibility enhancement for the balance switch knob */
  &.liquid-switch.balanceSwitch {
    .ant-switch-handle {
      /* White/light knob for visibility on both backgrounds */
      background: rgba(255, 255, 255, 0.9) !important; /* Almost white */
      border-radius: 50%; /* Ensure circular shape */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow for depth */
    }
    
    &.ant-switch-checked {
      .ant-switch-handle {
        /* Same white knob when checked - works on both blue and orange */
        background: rgba(255, 255, 255, 0.95) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }
`;
