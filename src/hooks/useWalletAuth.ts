import { useEffect, useState } from 'react';
import { persistWalletToken, readWalletToken, deleteWalletToken, readToken } from '@app/services/localStorage.service'; // Import the wallet-specific functions
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';

interface WalletHealth {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  wallet_locked: boolean;
  chain_synced: boolean;
  peer_count: number;
}

const useWalletAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletHealth, setWalletHealth] = useState<WalletHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthCheckInProgress, setHealthCheckInProgress] = useState(false);

  // Fetch the wallet token from localStorage on mount
  useEffect(() => {
    const storedToken = readWalletToken(); // Use the wallet-specific token reader
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login with Nostr public key and challenge verification
  const login = async () => {
    setLoading(true);
    try {
      if (!window.nostr) {
        notificationController.error({ message: 'Nostr extension is not available' });
        return;
      }

      console.log("getting challenge.")

      // Fetch the Nostr public key
      const npub = await window.nostr.getPublicKey();

      // Fetch the challenge from the server via panel API (no authentication required)
      const challengeResponse = await fetch(`${config.baseURL}/api/wallet-proxy/challenge`, { 
        method: 'GET'
      });

      // Check if the response is valid JSON
      if (!challengeResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const { content: challenge } = await challengeResponse.json();

      console.log(challenge)

      // Create the event to sign
      const event = {
        pubkey: npub,
        content: challenge,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [],
      };

      // Sign the challenge using Nostr
      const signedEvent = await window.nostr.signEvent(event);

      // Send the signed challenge to the backend for verification via panel API (no authentication required)
      const verifyResponse = await fetch(`${config.baseURL}/api/wallet-proxy/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          challenge,
          signature: signedEvent.sig,
          messageHash: event.content,
          event: signedEvent,
        }),
      });

      const { token } = await verifyResponse.json();

      // Store the wallet token and mark the user as authenticated
      persistWalletToken(token); // Persist the wallet-specific token
      setToken(token);
      setIsAuthenticated(true);

      console.log('Wallet login successful!')
    } catch (error) {
      console.error('Error during wallet login:', error);
      notificationController.error({ message: 'Wallet authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  // Check wallet health
  const checkWalletHealth = async () => {
    if (!isAuthenticated || !token) {
      console.log('Not authenticated, skipping health check');
      return null;
    }

    // Prevent multiple simultaneous health checks
    if (healthCheckInProgress) {
      console.log('Health check already in progress, skipping');
      return walletHealth;
    }

    setHealthCheckInProgress(true);
    setHealthLoading(true);
    try {
      // Get panel JWT token for authentication
      const panelToken = readToken();
      if (!panelToken) {
        console.log('Panel authentication required for health check');
        return null;
      }

      let response = await fetch(`${config.baseURL}/api/wallet-proxy/panel-health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${panelToken}`,
        },
      });

      // Handle 401 by re-authenticating and retrying (same as calculate-tx-size)
      if (response.status === 401) {
        console.log('Health check failed: token expired. Re-authenticating and retrying...');
        deleteWalletToken();
        await login();
        
        // Retry the request with the new token
        response = await fetch(`${config.baseURL}/api/wallet-proxy/panel-health`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${panelToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const healthData: WalletHealth = await response.json();
      setWalletHealth(healthData);
      return healthData;
    } catch (error) {
      console.error('Error checking wallet health:', error);
      setWalletHealth(null);
      return null;
    } finally {
      setHealthLoading(false);
      setHealthCheckInProgress(false);
    }
  };

  // Logout and clear wallet token
  const logout = () => {
    deleteWalletToken(); // Use the wallet-specific token deletion
    setToken(null);
    setIsAuthenticated(false);
    setWalletHealth(null);
  };

  return {
    token,
    isAuthenticated,
    login,
    logout,
    loading,
    checkWalletHealth,
    walletHealth,
    healthLoading,
  };
};

export default useWalletAuth;



// import { useEffect, useState } from 'react';
// import { persistToken, readToken, deleteToken } from '@app/services/localStorage.service';
// import { notificationController } from '@app/controllers/notificationController';

// const useWalletAuth = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Fetch token from local storage on mount
//   useEffect(() => {
//     const storedToken = readToken(); // Use readToken to fetch from localStorage
//     if (storedToken) {
//       setToken(storedToken);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   // Function to handle login with Nostr public key and challenge verification
//   const login = async () => {
//     setLoading(true);
//     try {
//       if (!window.nostr) {
//         notificationController.error({ message: 'Nostr extension is not available' });
//         return;
//       }

//       // Fetch the Nostr public key
//       const npub = await window.nostr.getPublicKey();

//       // Fetch the challenge from the server
//       const challengeResponse = await fetch('http://localhost:9003/challenge');
//       const { content: challenge } = await challengeResponse.json();

//       // Sign the challenge using Nostr
//       const signedEvent = await window.nostr.signEvent({
//         pubkey: npub,
//         content: challenge,
//         created_at: Math.floor(Date.now() / 1000),
//         kind: 1,
//         tags: [],
//       });

//       // Send the signed challenge to the backend for verification
//       const verifyResponse = await fetch('http://localhost:9003/verify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           challenge,
//           signature: signedEvent.sig,
//           messageHash: signedEvent.id,
//           event: signedEvent,
//         }),
//       });

//       const { token } = await verifyResponse.json();

//       // Store the token and mark the user as authenticated
//       persistToken(token);
//       setToken(token);
//       setIsAuthenticated(true);

//       notificationController.success({ message: 'Login successful!' });
//     } catch (error) {
//       console.error('Error during login:', error);
//       notificationController.error({ message: 'Authentication failed' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout and clear token
//   const logout = () => {
//     deleteToken();
//     setToken(null);
//     setIsAuthenticated(false);
//   };

//   return {
//     token,
//     isAuthenticated,
//     login,
//     logout,
//     loading,
//   };
// };

// export default useWalletAuth;

