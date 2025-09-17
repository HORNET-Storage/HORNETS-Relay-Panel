import React from 'react';
import { MoonSunSwitch } from '@app/components/common/MoonSunSwitch/MoonSunSwitch';

export const ThemePicker: React.FC = () => {
  // Only liquid-blue theme is supported - theme switching is disabled
  return (
    <MoonSunSwitch
      isMoonActive={false}
      onClickMoon={() => {}}
      onClickSun={() => {}}
    />
  );
};
