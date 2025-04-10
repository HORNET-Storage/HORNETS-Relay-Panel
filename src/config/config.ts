// config.ts
const config = {
  baseURL: process.env.REACT_APP_DEMO_MODE === 'true'
    ? 'http://localhost:10002'
    : process.env.NODE_ENV === 'production' 
      ? window.location.origin || 'http://localhost:9002' 
      : process.env.REACT_APP_BASE_URL || 'http://localhost:9002',
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  walletBaseURL: process.env.REACT_APP_WALLET_BASE_URL?.trim() || 'http://localhost:9003',
  
  // Notification settings
  notifications: {
    // 5 minutes in milliseconds
    pollingInterval: 5 * 60 * 1000,
    // Decrease polling frequency when tab is not focused
    backgroundPollingInterval: 15 * 60 * 1000,
  },
};

export default config;
