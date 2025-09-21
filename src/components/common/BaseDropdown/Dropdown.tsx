import React from 'react';
import { DropdownProps, Dropdown } from 'antd';

export const BaseDropdown: React.FC<DropdownProps> = ({ children, ...props }) => {
  // The global ConfigProvider in App.tsx now handles getPopupContainer
  // No need to override it here unless specifically provided
  return (
    <Dropdown {...props}>
      {children}
    </Dropdown>
  );
};
