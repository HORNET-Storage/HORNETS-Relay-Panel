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
import NDK, { NDKNip07Signer, NDKRelayAuthPolicies } from '@nostr-dev-kit/ndk';
import { useNDKInit } from '@nostr-dev-kit/ndk-hooks';
import config from './config/config';

// Configure NDK with user's relay URLs from environment variables
const getRelayUrls = () => {
  const relayUrls = [...config.nostrRelayUrls];
  
  // Add user's own relay URL as the first priority if provided
  if (config.ownRelayUrl) {
    relayUrls.unshift(config.ownRelayUrl);
  }
  
  return relayUrls;
};

const ndk = new NDK({
  explicitRelayUrls: getRelayUrls(),
  signer: new NDKNip07Signer(),
});

// Set up NIP-42 authentication policy following the example
ndk.relayAuthDefaultPolicy = NDKRelayAuthPolicies.signIn({ ndk });

ndk
  .connect()
  .then(() => console.log('NDK connected with relay URLs and NIP-42 auth policy:', getRelayUrls()))
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
