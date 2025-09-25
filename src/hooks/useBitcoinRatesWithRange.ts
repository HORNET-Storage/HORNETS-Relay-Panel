import { useState, useEffect, useCallback, useRef } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';

interface Earning {
  date: number;
  usd_value: number;
}

export type TimeRange = '1day' | '1week' | '1month' | '1year' | '2year' | '3year' | '5year' | 'all';

interface BitcoinRatesOptions {
  timeRange: TimeRange;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Cache for different time ranges
const rangeCache = new Map<TimeRange, { data: Earning[]; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache for frequent updates

// Convert time range to API parameters
const getApiParams = (range: TimeRange): { days?: number; minutes?: number } => {
  switch (range) {
    case '1day':
      return { days: 1 };
    case '1week':
      return { days: 7 };
    case '1month':
      return { days: 30 };
    case '1year':
      return { days: 365 };
    case '2year':
      return { days: 730 };
    case '3year':
      return { days: 1095 };
    case '5year':
      return { days: 1825 };
    case 'all':
      return { days: 9999 }; // Max available data
    default:
      return { days: 30 };
  }
};

export const useBitcoinRatesWithRange = (options: BitcoinRatesOptions) => {
  const [rates, setRates] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const handleLogout = useHandleLogout();
  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Process and filter data based on time range
  const processBitcoinData = useCallback((data: any[], range: TimeRange): Earning[] => {
    console.log(`[processBitcoinData] Processing ${data.length} data points for range: ${range}`);
    
    if (data.length === 0) {
      console.log('[processBitcoinData] No data received');
      return [];
    }
    
    // Process the raw data
    const processedData: Earning[] = [];
    for (const item of data) {
      const timestamp = item.TimestampHornets || item.Timestamp;
      const rate = item.Rate;
      
      if (!timestamp || rate == null) {
        continue;
      }
      
      let dateMs: number;
      // Handle timestamp format
      if (typeof timestamp === 'string') {
        dateMs = new Date(timestamp).getTime();
      } else if (typeof timestamp === 'number') {
        // Unix timestamp - check if it's in seconds or milliseconds
        dateMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
      } else {
        continue;
      }
      
      if (!isNaN(dateMs)) {
        processedData.push({
          date: dateMs,
          usd_value: Number(rate),
        });
      }
    }
    
    if (processedData.length === 0) {
      console.error('[processBitcoinData] No valid data points after processing');
      return [];
    }

    // Sort by date ascending
    processedData.sort((a, b) => a.date - b.date);
    
    // Get the actual data range
    const firstDate = new Date(processedData[0].date);
    const lastDate = new Date(processedData[processedData.length - 1].date);
    const dataSpanMs = lastDate.getTime() - firstDate.getTime();
    const dataSpanDays = dataSpanMs / (24 * 60 * 60 * 1000);
    
    console.log(`[processBitcoinData] Data spans ${dataSpanDays.toFixed(1)} days: ${firstDate.toISOString()} to ${lastDate.toISOString()}`);

    let filtered = processedData;
    const now = Date.now();

    // Filter based on time range - be smart about available data
    switch (range) {
      case '1day':
        // For 1 day view, show last 24 hours OR last 20% of data if less available
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        filtered = processedData.filter(item => item.date >= oneDayAgo);
        if (filtered.length < 10 && dataSpanDays < 1) {
          // If we have less than a day of data, show all
          filtered = processedData;
        } else if (filtered.length < 10) {
          // Show the most recent 20% of data
          const cutoff = Math.floor(processedData.length * 0.8);
          filtered = processedData.slice(cutoff);
        }
        break;
        
      case '1week':
        // For 1 week view, show last 7 days OR last 50% of data if less available
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        filtered = processedData.filter(item => item.date >= oneWeekAgo);
        if (filtered.length < 10 && dataSpanDays < 7) {
          // If we have less than 7 days of data, show all
          filtered = processedData;
        } else if (filtered.length < 10) {
          // Show the most recent 50% of data
          const cutoff = Math.floor(processedData.length * 0.5);
          filtered = processedData.slice(cutoff);
        }
        break;
        
      case '1month':
      case '1year':
      case '2year':
      case '3year':
      case '5year':
      case 'all':
        // For longer ranges, always show all available data since backend only has 30 days
        filtered = processedData;
        break;
        
      default:
        filtered = processedData;
        break;
    }

    console.log(`[processBitcoinData] Filtered to ${filtered.length} data points for ${range}`);

    // Smart data aggregation for better visualization
    let targetPoints: number;
    
    // Determine optimal number of points based on time range
    switch (range) {
      case '1day':
        targetPoints = Math.min(filtered.length, 96); // Max 96 points (every 15 min)
        break;
      case '1week':
        targetPoints = Math.min(filtered.length, 84); // Max 84 points (2x per day)
        break;
      case '1month':
        targetPoints = Math.min(filtered.length, 90); // Max 90 points (3x per day)
        break;
      default:
        targetPoints = Math.min(filtered.length, 100); // Max 100 points for longer ranges
        break;
    }
    
    // Apply aggregation if needed
    let aggregated = filtered;
    if (filtered.length > targetPoints && targetPoints > 0) {
      console.log(`[processBitcoinData] Aggregating ${filtered.length} points to ${targetPoints}`);
      aggregated = smartAggregateData(filtered, targetPoints);
    }
    
    console.log(`[processBitcoinData] Final: ${aggregated.length} points for ${range} view`);
    
    return aggregated;
  }, []);

  // Smart aggregation that maintains data shape while reducing points
  const fetchBitcoinRates = useCallback(async () => {
    // Check cache first for this specific range
    const cached = rangeCache.get(options.timeRange);
    const now = Date.now();
    
    // Always check cache duration
    const shouldUseFreshData = !cached ||
      (now - cached.timestamp) > CACHE_DURATION;

    if (!shouldUseFreshData && cached) {
      console.log(`[useBitcoinRatesWithRange] Using cached data for ${options.timeRange}`);
      return cached.data;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const token = readToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = getApiParams(options.timeRange);
      
      // Try range-specific endpoint first, fallback to last-30-days
      let endpoint = `${config.baseURL}/api/bitcoin-rates/range/${options.timeRange}`;
      
      // For now, keep using the last-30-days endpoint until backend is updated
      // Once backend supports the /range/:range endpoint, remove this line
      endpoint = `${config.baseURL}/api/bitcoin-rates/last-30-days`;

      console.log(`[useBitcoinRatesWithRange] Fetching ${options.timeRange} data from ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          throw new Error('Authentication failed. You have been logged out.');
        }
        
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }

      const data = await response.json();
      console.log(`[useBitcoinRatesWithRange] Data received for ${options.timeRange}`);
      
      const processedData = processBitcoinData(data, options.timeRange);
      
      // Cache the result
      rangeCache.set(options.timeRange, {
        data: processedData,
        timestamp: now,
      });

      setLastUpdate(new Date());
      return processedData;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[useBitcoinRatesWithRange] Request was aborted');
        return [];
      }
      throw err;
    }
  }, [options.timeRange, handleLogout, processBitcoinData]);

  // Smart aggregation that maintains data shape while reducing points
  const smartAggregateData = (data: Earning[], targetPoints: number): Earning[] => {
    if (data.length <= targetPoints) return data;
    
    const bucketSize = Math.floor(data.length / targetPoints);
    if (bucketSize <= 1) return data;
    
    const result: Earning[] = [];
    
    for (let i = 0; i < data.length; i += bucketSize) {
      const bucket = data.slice(i, Math.min(i + bucketSize, data.length));
      
      if (bucket.length === 0) continue;
      
      // Calculate average for the bucket
      let sumValue = 0;
      let sumTime = 0;
      
      for (const point of bucket) {
        sumValue += point.usd_value;
        sumTime += point.date;
      }
      
      // Use average time and value for the aggregated point
      result.push({
        date: Math.floor(sumTime / bucket.length),
        usd_value: sumValue / bucket.length,
      });
    }
    
    // Always include the very last point if not already included
    const lastPoint = data[data.length - 1];
    const lastResult = result[result.length - 1];
    
    if (!lastResult || Math.abs(lastResult.date - lastPoint.date) > 60000) {
      result.push(lastPoint);
    }
    
    return result;
  };
  
  // Generate mock real-time data for demonstration
  const generateMockRealtimeData = (minutes: number): Earning[] => {
    const now = Date.now();
    const data: Earning[] = [];
    const basePrice = 50000 + Math.random() * 10000;
    const points = minutes * 2; // 2 data points per minute
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - ((points - i) * 30 * 1000); // 30 seconds apart
      const variation = (Math.random() - 0.5) * 100;
      data.push({
        date: timestamp,
        usd_value: basePrice + variation + (i * 10), // Slight upward trend
      });
    }
    
    return data;
  };

  // Load rates
  const loadRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBitcoinRates();
      setRates(data);
    } catch (err: any) {
      console.error('[useBitcoinRatesWithRange] Error fetching rates:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBitcoinRates]);

  // Initial load and setup auto-refresh
  useEffect(() => {
    loadRates();

    // Setup auto-refresh if enabled
    if (options.autoRefresh) {
      const interval = options.refreshInterval || 60000;
      
      console.log(`[useBitcoinRatesWithRange] Setting up auto-refresh every ${interval}ms`);
      refreshIntervalRef.current = setInterval(() => {
        loadRates();
      }, interval);
    }

    return () => {
      // Cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [options.timeRange, options.autoRefresh, options.refreshInterval, loadRates]);

  return {
    rates,
    isLoading,
    error,
    lastUpdate,
    refetch: loadRates,
  };
};