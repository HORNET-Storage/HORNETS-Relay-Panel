import { useState, useEffect, useCallback, useRef } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { useProfileAPI } from './useProfileAPI';

// Import the profile images for dummy data
import profile1 from '@app/assets/images/profile1.png';
import profile2 from '@app/assets/images/profile2.jpg';
import profile3 from '@app/assets/images/profile3.webp';
import profile4 from '@app/assets/images/profile4.webp';
import pfp from '@app/assets/images/pfp.jpg';
import mediaUpload from '@app/assets/images/media-upload.jpg';
import oilPaintGandalf from '@app/assets/images/OilPaintGandalf.png';
import nostrGif from '@app/assets/images/nostr.build_0f74feb77e9d4e23b60f00188a02873ad0c2d15a176260817c1c96c6f88d2fa3.gif';
import profile6 from '@app/assets/images/profile6.jpg';
import profile7 from '@app/assets/images/profile7.jpg';
import profile8 from '@app/assets/images/profile8.gif';
import profile9 from '@app/assets/images/profile9.gif';
import profile11 from '@app/assets/images/profile11.jpg';
import profile12 from '@app/assets/images/profile12.webp';
import profile13 from '@app/assets/images/profile13.png';

export interface SubscriberProfile {
  pubkey: string;
  picture?: string;
  name?: string;
  about?: string;
  metadata?: {
    subscriptionTier?: string;
    subscribedSince?: string;
  };
}

// Define dummy profiles using the imported images
const dummyProfiles: SubscriberProfile[] = [
  { pubkey: 'dummy-1', picture: profile1, name: 'Demo User 1', about: 'Demo subscriber' },
  { pubkey: 'dummy-2', picture: profile2, name: 'Demo User 2', about: 'Demo subscriber' },
  { pubkey: 'dummy-3', picture: profile3, name: 'Demo User 3', about: 'Demo subscriber' },
  { pubkey: 'dummy-4', picture: profile6, name: 'Demo User 4', about: 'Demo subscriber' },
  { pubkey: 'dummy-5', picture: profile7, name: 'Demo User 5', about: 'Demo subscriber' },
  { pubkey: 'dummy-6', picture: profile13, name: 'Demo User 6', about: 'Demo subscriber' },
  { pubkey: 'dummy-7', picture: profile8, name: 'Demo User 7', about: 'Demo subscriber' },
  { pubkey: 'dummy-8', picture: profile12, name: 'Demo User 8', about: 'Demo subscriber' },
  { pubkey: 'dummy-9', picture: profile11, name: 'Demo User 9', about: 'Demo subscriber' },
  { pubkey: 'dummy-10', picture: profile4, name: 'Demo User 10', about: 'Demo subscriber' },
  { pubkey: 'dummy-11', picture: profile9, name: 'Demo User 11', about: 'Demo subscriber' },
  { pubkey: 'dummy-12', picture: pfp, name: 'Demo User 12', about: 'Demo subscriber' },
  { pubkey: 'dummy-13', picture: mediaUpload, name: 'Demo User 13', about: 'Demo subscriber' },
  { pubkey: 'dummy-14', picture: oilPaintGandalf, name: 'Demo User 14', about: 'Demo subscriber' },
  { pubkey: 'dummy-15', picture: nostrGif, name: 'Demo User 15', about: 'Demo subscriber' },
];

// Simple cache for subscriber list pagination (not profiles - those are cached in profileCache)
interface SubscriberListCache {
  data: SubscriberProfile[];
  timestamp: number;
  hasMore: boolean;
}

const SUBSCRIBER_LIST_CACHE_DURATION = 300000; // 5 minutes for the subscriber list
const subscriberListCache = new Map<string, SubscriberListCache>();

const usePaidSubscribers = (pageSize = 20) => {
  const [subscribers, setSubscribers] = useState<SubscriberProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [useDummyData, setUseDummyData] = useState(false);

  const isMounted = useRef(true);
  const handleLogout = useHandleLogout();
  const { fetchProfiles, loading: profileLoading } = useProfileAPI();

  const fetchSubscribers = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = readToken();
      if (!token) {
        setUseDummyData(true);
        setSubscribers(dummyProfiles);
        setHasMore(false);
        return;
      }

      const page = reset ? 1 : currentPage;
      const cacheKey = `subscribers_${page}_${pageSize}`;
      
      // Check cache first for subscriber list (not individual profiles)
      const cached = subscriberListCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < SUBSCRIBER_LIST_CACHE_DURATION) {
        // Get the cached subscriber list but fetch fresh profile data
        const pubkeys = cached.data.map(s => s.pubkey);
        const enhancedProfiles = await fetchProfiles(pubkeys);
        
        // Merge with basic subscriber data, prioritizing enhanced profile data
        const mergedProfiles = cached.data.map(subscriber => {
          const enhanced = enhancedProfiles.find(p => p.pubkey === subscriber.pubkey);
          return enhanced || subscriber;
        });
        
        setSubscribers(mergedProfiles);
        setHasMore(cached.hasMore);
        setUseDummyData(false);
        setCurrentPage(page + 1);
        return;
      }

      // Fetch subscriber list from API (this gives us basic info + pubkeys)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      const response = await fetch(`${config.baseURL}/api/paid-subscriber-profiles?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      let basicSubscriberData: SubscriberProfile[] = [];
      
      try {
        const data = await response.json();
        basicSubscriberData = Array.isArray(data) ? data : [];
      } catch (jsonError) {
        console.error('Error parsing subscriber list response:', jsonError);
        basicSubscriberData = [];
      }

      if (basicSubscriberData.length > 0) {
        // Cache the basic subscriber list
        subscriberListCache.set(cacheKey, {
          data: basicSubscriberData,
          timestamp: Date.now(),
          hasMore: basicSubscriberData.length === pageSize
        });

        // Fetch enhanced profile data for all subscribers
        const pubkeys = basicSubscriberData.map(s => s.pubkey);
        const enhancedProfiles = await fetchProfiles(pubkeys);
        
        // Merge basic subscriber data with enhanced profile data
        const mergedProfiles = basicSubscriberData.map(subscriber => {
          const enhanced = enhancedProfiles.find(p => p.pubkey === subscriber.pubkey);
          return enhanced || subscriber;
        });

        setSubscribers(mergedProfiles);
        setHasMore(basicSubscriberData.length === pageSize);
        setUseDummyData(false);
        setCurrentPage(page + 1);
      } else {
        // No data from backend, use dummy data
        setUseDummyData(true);
        setSubscribers(dummyProfiles);
        setHasMore(false);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscribers';
      setError(errorMessage);
      console.error('Error fetching subscribers:', err);
      
      // Fallback to dummy data on error
      setUseDummyData(true);
      setSubscribers(dummyProfiles);
      setHasMore(false);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [currentPage, pageSize, handleLogout, fetchProfiles]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchSubscribers(true);
  }, [fetchSubscribers]);

  return {
    subscribers,
    loading: loading || profileLoading,
    error,
    hasMore,
    useDummyData,
    fetchMore: () => fetchSubscribers(false),
    reset: () => fetchSubscribers(true),
  };
};

export default usePaidSubscribers;