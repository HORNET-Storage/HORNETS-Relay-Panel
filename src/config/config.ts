// config.ts

// Dynamic URL detection - panel works from anywhere!
const getBaseURL = (): string => {
  // Demo mode override for testing
  if (process.env.REACT_APP_DEMO_MODE === 'true') {
    return 'http://localhost:10002';
  }
  
  // Development mode - use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_BASE_URL || 'http://localhost:9002';
  }
  
  // Production - use current origin + /panel path
  // This makes the panel work from ANY domain without rebuilding
  return `${window.location.origin}/panel`;
};

const getWalletURL = (): string => {
  // Demo mode override for testing
  if (process.env.REACT_APP_DEMO_MODE === 'true') {
    return 'http://localhost:9003';
  }
  
  // Development mode - use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_WALLET_BASE_URL?.trim() || 'http://localhost:9003';
  }
  
  // Production - use current origin + /wallet path
  return `${window.location.origin}/wallet`;
};

const config = {
  baseURL: getBaseURL(),
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  walletBaseURL: getWalletURL(),
  
  // Nostr relay configuration
  nostrRelayUrls: process.env.REACT_APP_NOSTR_RELAY_URLS?.split(',').map(url => url.trim()) || [
    'wss://relay.damus.io',
    'wss://relay.nostr.band', 
    'wss://relay.snort.social',
    'wss://vault.iris.to'
  ],
  
  // User's own relay URL (primary relay for profile fetching)
  // In production, use the current domain as the relay WebSocket URL
  ownRelayUrl: process.env.REACT_APP_OWN_RELAY_URL?.trim() || 
    (process.env.NODE_ENV === 'production' 
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
      : null),
  
  // Notification settings
  notifications: {
    // 5 minutes in milliseconds
    pollingInterval: 5 * 60 * 1000,
    // Decrease polling frequency when tab is not focused
    backgroundPollingInterval: 15 * 60 * 1000,
  },
};

export default config;
