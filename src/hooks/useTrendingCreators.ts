import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';

// Import the profile images
import profile1 from '@app/assets/images/profile1.webp';
import profile2 from '@app/assets/images/profile2.jpg';
import profile3 from '@app/assets/images/profile3.webp';
import profile4 from '@app/assets/images/profile4.webp';
import profile5 from '@app/assets/images/profile5.jpg';
import profile6 from '@app/assets/images/profile6.jpg';
import profile7 from '@app/assets/images/profile7.jpg';
import profile8 from '@app/assets/images/profile8.gif';
import profile9 from '@app/assets/images/profile9.gif';
import profile11 from '@app/assets/images/profile11.png';
import profile12 from '@app/assets/images/profile12.webp';
import profile13 from '@app/assets/images/profile13.webp';

export interface CreatorProfile {
  pubkey: string;
  picture: string;
  name?: string;
  about?: string;
  metadata?: {
    subscriptionTier?: string;
    subscribedSince?: string;
  };
}

// Define dummy profiles using the imported images
const dummyProfiles: CreatorProfile[] = [
  { pubkey: 'dummy-1', picture: profile1 },
  { pubkey: 'dummy-2', picture: profile2 },
  { pubkey: 'dummy-3', picture: profile3 },
  { pubkey: 'dummy-4', picture: profile6 },
  { pubkey: 'dummy-5', picture: profile7 },
  { pubkey: 'dummy-6', picture: profile13 },
  { pubkey: 'dummy-7', picture: profile8 },
  { pubkey: 'dummy-8', picture: profile12 },
  { pubkey: 'dummy-9', picture: profile5 },
  { pubkey: 'dummy-10', picture: profile4 },
  { pubkey: 'dummy-11', picture: profile9 },
  { pubkey: 'dummy-12', picture: profile11 },
];

const useTrendingCreators = (pageSize: number = 20) => {
  const [creators, setCreators] = useState<CreatorProfile[]>(dummyProfiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [useDummyData, setUseDummyData] = useState(true);

  const isMounted = useRef(true);
  const handleLogout = useHandleLogout();

  const fetchCreators = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      const token = readToken();
      if (!token) {
        console.log('No authentication token found, using dummy data');
        return;
      }

      const page = reset ? 1 : currentPage;
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
          console.log('Authentication failed, using dummy data');
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: CreatorProfile[] = await response.json();

      if (isMounted.current) {
        // Only update if we found real paid subscribers
        if (data.length > 0) {
          setUseDummyData(false);
          setCreators(prev => reset ? data : [...prev, ...data]);
          setHasMore(data.length === pageSize);
          setCurrentPage(page + 1);
        } else {
          console.log('No paid subscribers found, using dummy data');
          setUseDummyData(true);
          setCreators(dummyProfiles);
          setHasMore(false);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch creators';
      setError(errorMessage);
      console.log(`Error fetching creators: ${errorMessage}, using dummy data`);
      setUseDummyData(true);
      setCreators(dummyProfiles);
      setHasMore(false);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [currentPage, pageSize, handleLogout]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchCreators(true);
  }, [fetchCreators]);

  return {
    creators,
    loading,
    error,
    hasMore,
    useDummyData,
    fetchMore: () => fetchCreators(false),
    reset: () => fetchCreators(true),
  };
};

export default useTrendingCreators;
