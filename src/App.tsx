import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import deDe from 'antd/lib/locale/de_DE';
import enUS from 'antd/lib/locale/en_US';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import 'typeface-lato';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';
import NDK from '@nostr-dev-kit/ndk';
import { useNDKInit } from '@nostr-dev-kit/ndk-hooks';

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io', 'wss://relay.nostr.band', 'wss://relay.snort.social', 'vault.iris.to'],
});
ndk
  .connect()
  .then(() => console.log('NDK connected'))
  .catch((error) => console.error('NDK connection error:', error));

const App: React.FC = () => {
  const { language } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);
  const initializeNDK = useNDKInit();

  useEffect(() => {
    initializeNDK(ndk);
  }, [initializeNDK]);

  usePWA();

  useAutoNightMode();

  useThemeWatcher();

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].layoutBodyBg} />
      <GlobalStyle />
      <HelmetProvider>
        <ConfigProvider locale={language === 'en' ? enUS : deDe}>
          <AppRouter />
        </ConfigProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
