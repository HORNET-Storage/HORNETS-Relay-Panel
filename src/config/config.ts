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

const getWalletURL = (): string | null => {
  // Demo mode override for testing
  if (process.env.REACT_APP_DEMO_MODE === 'true') {
    return 'http://localhost:9003';
  }
  
  // Wallet URL is optional - return null if not configured
  return process.env.REACT_APP_WALLET_BASE_URL || null;
};

const config = {
  baseURL: getBaseURL(),
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  walletBaseURL: getWalletURL(),
  isWalletEnabled: getWalletURL() !== null,
  
  // Nostr relay configuration
  nostrRelayUrls: process.env.REACT_APP_NOSTR_RELAY_URLS?.split(',').map(url => url.trim()) || [
    'wss://relay.damus.io',
    'wss://relay.nostr.band', 
    'wss://relay.snort.social',
    'wss://vault.iris.to'
  ],
  
  // User's own relay URL (primary relay for profile fetching)
  // Always require explicit relay URL configuration
  ownRelayUrl: (() => {
    if (!process.env.REACT_APP_OWN_RELAY_URL?.trim()) {
      throw new Error('REACT_APP_OWN_RELAY_URL must be explicitly configured in environment variables');
    }
    return process.env.REACT_APP_OWN_RELAY_URL.trim();
  })(),
  
  // Notification settings
  notifications: {
    // 5 minutes in milliseconds
    pollingInterval: 5 * 60 * 1000,
    // Decrease polling frequency when tab is not focused
    backgroundPollingInterval: 15 * 60 * 1000,
  },
};

export default config;
