import { useEffect, useRef } from 'react';
import { ConfigProvider } from 'antd';
import { liquidBlueTheme } from '@app/styles/themes/liquidBlue/liquidBlueTheme';

export const useThemeWatcher = (): void => {
  const root = useRef(document.querySelector(':root'));

  useEffect(() => {
    const html = root.current;
    if (html) {
      html.setAttribute('data-no-transition', '');
      html.setAttribute('data-theme', 'liquid-blue');
      // remove transition after layout update
      requestAnimationFrame(() => {
        html.removeAttribute('data-no-transition');
      });
    }

    ConfigProvider.config({
      theme: {
        primaryColor: liquidBlueTheme.primary,
        infoColor: liquidBlueTheme.primary,
        successColor: liquidBlueTheme.success,
        errorColor: liquidBlueTheme.error,
        warningColor: liquidBlueTheme.warning,
      },
    });
  }, []);
};