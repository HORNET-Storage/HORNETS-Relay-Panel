// config.ts

// Dynamic URL detection - panel and API run from same origin
const getBaseURL = (): string => {
  // Demo mode override for testing
  if (process.env.REACT_APP_DEMO_MODE === 'true') {
    return 'http://localhost:10002';
  }
  
  // For both development and production, panel and API are served from same origin
  // API routes are at /api/* while panel is served from root
  return process.env.REACT_APP_BASE_URL || window.location.origin;
};

// Wallet operations now go through panel API, no direct URL needed

const config = {
  baseURL: getBaseURL(),
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  // Wallet operations now routed through panel API - always enabled
  isWalletEnabled: true,
  
  // Nostr relay configuration removed - using panel API for all operations
  
  
  // Notification settings
  notifications: {
    // 5 minutes in milliseconds
    pollingInterval: 5 * 60 * 1000,
    // Decrease polling frequency when tab is not focused
    backgroundPollingInterval: 15 * 60 * 1000,
  },
};

export default config;
