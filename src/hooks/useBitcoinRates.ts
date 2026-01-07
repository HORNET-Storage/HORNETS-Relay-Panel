import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useHandleLogout } from './authUtils';

interface Earning {
  date: number;
  usd_value: number;
}

// Global cache to prevent multiple simultaneous requests
let globalRatesCache: { data: Earning[]; timestamp: number } | null = null;
let globalPromise: Promise<Earning[]> | null = null;
const CACHE_DURATION = 480000; // 8 minutes (backend updates every 10 minutes)
export const useBitcoinRates = () => {
  const [rates, setRates] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchBitcoinRates = async (retryCount = 0): Promise<Earning[]> => {
      // Check cache first
      if (globalRatesCache && Date.now() - globalRatesCache.timestamp < CACHE_DURATION) {
        const cacheAge = Math.round((Date.now() - globalRatesCache.timestamp) / 1000);
        console.log(`[useBitcoinRates] Using cached data (age: ${cacheAge}s)`);
        return globalRatesCache.data;
      }

      // If there's already a request in progress, wait for it
      if (globalPromise) {
        console.log('[useBitcoinRates] Waiting for existing request to complete...');
        return globalPromise;
      }

      // Create new request
      globalPromise = new Promise<Earning[]>(async (resolve, reject) => {
        try {
          const token = readToken(); // Read JWT from localStorage
          if (!token) {
            throw new Error('No authentication token found');
          }

          console.log('[useBitcoinRates] Fetching bitcoin rates...');
          const response = await fetch(`${config.baseURL}/api/bitcoin-rates/last-30-days`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
            },
          });

          console.log(`[useBitcoinRates] Response status: ${response.status}`);

          if (!response.ok) {
            if (response.status === 401) {
              handleLogout(); // Log out the user if token is invalid or expired
              throw new Error('Authentication failed. You have been logged out.');
            }
            throw new Error(`Network response was not ok (status: ${response.status})`);
          }

          const data = await response.json();
          console.log('[useBitcoinRates] Data received successfully');
          const processedData = data.map((item: { Rate: string | number; TimestampHornets: string }) => ({
            date: new Date(item.TimestampHornets).getTime(),
            usd_value: typeof item.Rate === 'string' ? parseFloat(item.Rate) : item.Rate,
          }));

          // Cache the result
          globalRatesCache = {
            data: processedData,
            timestamp: Date.now(),
          };

          resolve(processedData);
        } catch (err: any) {
          // Retry on network errors but not on auth errors
          if (retryCount < 2 && err.message.includes('network') && !err.message.includes('Authentication')) {
            setTimeout(() => {
              globalPromise = null; // Clear the promise so retry can start
              fetchBitcoinRates(retryCount + 1).then(resolve).catch(reject);
            }, 1000);
            return;
          }
          
          reject(err);
        } finally {
          globalPromise = null; // Clear the promise when done
        }
      });

      return globalPromise;
    };

    const loadRates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchBitcoinRates();
        setRates(data);
      } catch (err: any) {
        console.error('[useBitcoinRates] Error fetching rates:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, [handleLogout]);

  return { rates, isLoading, error };
};
