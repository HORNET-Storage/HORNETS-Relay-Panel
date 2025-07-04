// config.ts
const config = {
  baseURL: process.env.REACT_APP_DEMO_MODE === 'true'
    ? 'http://localhost:10002'
    : process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_BASE_URL || 'http://localhost:9002' 
      : process.env.REACT_APP_BASE_URL || 'http://localhost:9002',
  isDemoMode: process.env.REACT_APP_DEMO_MODE === 'true',
  walletBaseURL: process.env.REACT_APP_WALLET_BASE_URL?.trim() || 'http://localhost:9003',
  
  // Nostr relay configuration
  nostrRelayUrls: process.env.REACT_APP_NOSTR_RELAY_URLS?.split(',').map(url => url.trim()) || [
    'wss://relay.damus.io',
    'wss://relay.nostr.band', 
    'wss://relay.snort.social',
    'wss://vault.iris.to'
  ],
  
  // User's own relay URL (primary relay for profile fetching)
  ownRelayUrl: process.env.REACT_APP_OWN_RELAY_URL?.trim() || null,
  
  // Notification settings
  notifications: {
    // 5 minutes in milliseconds
    pollingInterval: 5 * 60 * 1000,
    // Decrease polling frequency when tab is not focused
    backgroundPollingInterval: 15 * 60 * 1000,
  },
};

export default config;
