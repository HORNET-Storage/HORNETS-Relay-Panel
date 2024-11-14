// config.ts
const config = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? window.location.origin || 'http://localhost:9002' 
    : process.env.REACT_APP_BASE_URL || 'http://localhost:9002',
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  walletBaseURL: process.env.REACT_APP_WALLET_BASE_URL?.trim() || 'http://localhost:9003',
};

export default config;
