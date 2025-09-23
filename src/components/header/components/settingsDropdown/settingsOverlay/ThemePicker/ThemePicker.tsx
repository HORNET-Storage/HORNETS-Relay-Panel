import React from 'react';
import { MoonSunSwitch } from '@app/components/common/MoonSunSwitch/MoonSunSwitch';

export const ThemePicker: React.FC = () => {
  // Only liquid-blue theme is supported - theme switching is disabled
  const handleMoonClick = () => {
    // Theme switching is disabled - no operation needed
    return;
  };

  const handleSunClick = () => {
    // Theme switching is disabled - no operation needed
    return;
  };

  return (
    <MoonSunSwitch
      isMoonActive={false}
      onClickMoon={handleMoonClick}
      onClickSun={handleSunClick}
    />
  );
};
