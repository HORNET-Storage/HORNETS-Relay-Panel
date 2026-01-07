import { useState, useEffect, useRef } from 'react';

interface Earning {
  date: number;
  usd_value: number;
}

export type TimeRange = '1day' | '1week' | '1month' | '1year';

interface BitcoinRatesOptions {
  timeRange: TimeRange;
}

// Convert time range to days for CoinGecko API
const getDaysForRange = (range: TimeRange): number => {
  switch (range) {
    case '1day':
      return 1;
    case '1week':
      return 7;
    case '1month':
      return 30;
    case '1year':
      return 365;
    default:
      return 30;
  }
};

// Process CoinGecko response data
const processCoinGeckoData = (prices: [number, number][]): Earning[] => {
  return prices.map(([timestamp, price]) => ({
    date: timestamp,
    usd_value: price,
  }));
};

export const useBitcoinRatesWithRange = (options: BitcoinRatesOptions) => {
  const [rates, setRates] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const timeRange = options.timeRange;
    const days = getDaysForRange(timeRange);

    console.log(`[useBitcoinRatesWithRange] Fetching ${timeRange} (${days} days) from CoinGecko`);

    const fetchData = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        // CoinGecko public API - no API key required for basic usage
        const endpoint = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a minute.');
          }
          throw new Error(`API error (status: ${response.status})`);
        }

        const data = await response.json();

        if (!data.prices || !Array.isArray(data.prices)) {
          throw new Error('Invalid response format');
        }

        console.log(`[useBitcoinRatesWithRange] Received ${data.prices.length} data points for ${timeRange}`);

        const processedData = processCoinGeckoData(data.prices);

        if (!isCancelled) {
          setRates(processedData);
          setLastUpdate(new Date());
          console.log(`[useBitcoinRatesWithRange] Set ${processedData.length} rates, first: ${processedData[0]?.usd_value?.toFixed(2)}, last: ${processedData[processedData.length-1]?.usd_value?.toFixed(2)}`);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('[useBitcoinRatesWithRange] Request aborted');
          return;
        }
        if (!isCancelled) {
          console.error('[useBitcoinRatesWithRange] Error:', err);
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [options.timeRange]);

  return {
    rates,
    isLoading,
    error,
    lastUpdate,
  };
};
