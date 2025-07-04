import { useState, useEffect, useCallback, useRef } from 'react';
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
import adminDefaultAvatar from '@app/assets/admin-default-avatar.png';

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
const testSubscribers: SubscriberProfile[] = [ 
  { pubkey: '91dfb08db37712e74d892adbbf63abab43cb6aa3806950548f3146347d29b6ae' },
  { pubkey: '59cacbd83ad5c54ad91dacf51a49c06e0bef730ac0e7c235a6f6fa29b9230f02' },
  { pubkey: '32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245' },
  { pubkey: '78a317586cbc30d20f8aa94d8450eb0cd58b312bad94fc76139c72eb2e5c81d2' },
  { pubkey: '4657dfe8965be8980a93072bcfb5e59a65124406db0f819215ee78ba47934b3e' },
  { pubkey: '6e75f7972397ca3295e0f4ca0fbc6eb9cc79be85bafdd56bd378220ca8eee74e' },
  { pubkey: '7b991f776d04d87cb5d4259688187a520f6afc16b2b9ad26dac6b8ee76c2840d'}

];
// Define dummy profiles using the imported images
const dummyProfiles: SubscriberProfile[] = [
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


// URL of the placeholder avatar that comes from the API
const PLACEHOLDER_AVATAR_URL = 'http://localhost:3000/placeholder-avatar.png';

const usePaidSubscribers = (pageSize = 20) => {
  const [subscribers, setSubscribers] = useState<SubscriberProfile[]>(dummyProfiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [useDummyData, setUseDummyData] = useState(true);

  const isMounted = useRef(true);
  const handleLogout = useHandleLogout();

  const fetchSubscribers = useCallback(async (reset = false) => {
    try {
      console.log('[usePaidSubscribers] Starting to fetch subscribers...');
      setLoading(true);
      const token = readToken();
      if (!token) {
        console.log('[usePaidSubscribers] No authentication token found, using dummy data');
        setUseDummyData(true);
        setSubscribers(dummyProfiles);
        setHasMore(false);
        return;
      }

      const page = reset ? 1 : currentPage;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });

      const requestUrl = `${config.baseURL}/api/paid-subscriber-profiles?${queryParams}`;
      console.log(`[usePaidSubscribers] Fetching from URL: ${requestUrl}`);
      console.log(`[usePaidSubscribers] Current baseURL: ${config.baseURL}`);

      const response = await fetch(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`[usePaidSubscribers] Response status: ${response.status}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          console.log('[usePaidSubscribers] Authentication failed, using dummy data');
          return;
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      // Clone the response before consuming it with json() so we can log the raw text if needed
      const responseClone = response.clone();
      let data: SubscriberProfile[] = [];
      
      try {
        data = await response.json();
        console.log('[usePaidSubscribers] Response data (raw):', data);
        console.log('[usePaidSubscribers] Data constructor:', data.constructor?.name);
        console.log('[usePaidSubscribers] Data properties:', Object.getOwnPropertyNames(data));
        console.log('[usePaidSubscribers] JSON.stringify(data):', JSON.stringify(data));
        
        // Ensure data is always an array
        if (!Array.isArray(data)) {
          console.warn('[usePaidSubscribers] Data is not an array, forcing to array format');
          if (data && typeof data === 'object') {
            // If data is an object but not an array, try to convert it
            if (Object.keys(data).length > 0) {
              data = [data] as SubscriberProfile[]; // Wrap in an array if it's a single object
            } else {
              data = []; // Empty array if it's an empty object
            }
          } else {
            data = []; // Default to empty array
          }
        }
      } catch (jsonError) {
        console.error('[usePaidSubscribers] Error parsing JSON response:', jsonError);
        // Try to get the raw text to see what's being returned
        const rawText = await responseClone.text();
        console.log('[usePaidSubscribers] Raw response text:', rawText);
        data = [];
      }

      console.log(`[usePaidSubscribers] Normalized data:`, data);
      console.log(`[usePaidSubscribers] Data length: ${data?.length}, typeof data: ${typeof data}, Array.isArray(data): ${Array.isArray(data)}`);
      
      // If we have backend data, use it as the primary source and return subscribers for NDK enhancement
      if (data && Array.isArray(data) && data.length > 0) {
        console.log(`[usePaidSubscribers] Backend data detected, using as primary source`);
          
        try {
          // Process the profiles to replace placeholder avatar URLs
          const processedProfiles: SubscriberProfile[] = [];
          
          console.log(`[usePaidSubscribers] First item pubkey:`, data[0]?.pubkey);
          console.log(`[usePaidSubscribers] First item picture:`, data[0]?.picture);
          
          for (const profile of data) {
            if (!profile || !profile.pubkey) {
              console.error('[usePaidSubscribers] Invalid profile, skipping:', profile);
              continue;
            }
            
            // Fix placeholder avatar if needed
            const usesPlaceholder = profile.picture === PLACEHOLDER_AVATAR_URL;
            let pictureUrl = profile.picture;
            
            if (usesPlaceholder) {
              console.log(`[usePaidSubscribers] Replacing placeholder for ${profile.pubkey}`);
              pictureUrl = adminDefaultAvatar;
            }
            
            processedProfiles.push({
              pubkey: profile.pubkey,
              picture: pictureUrl,
              name: profile.name,
              about: profile.about,
              metadata: profile.metadata
            });
          }
          
          console.log('[usePaidSubscribers] Backend data processed successfully');
          console.log('[usePaidSubscribers] Processed profiles count:', processedProfiles.length);
          
          // Update state with backend data
          setUseDummyData(false);
          setSubscribers(processedProfiles);
          setHasMore(data.length === pageSize);
          setCurrentPage(page + 1);
          
          console.log('[usePaidSubscribers] Backend data set as primary source');
          return; // Exit early after processing backend data
        } catch (processingError) {
          console.error('[usePaidSubscribers] Error processing backend profiles:', processingError);
          // Continue to fallback logic below if processing fails
        }
      }
      
      // Fallback logic if no backend data
      if (isMounted.current) {
        console.log('[usePaidSubscribers] No backend data found, using dummy data');
        setUseDummyData(true);
        setSubscribers(dummyProfiles);
        setHasMore(false);
        console.log('[usePaidSubscribers] Fallback to dummy data complete');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscribers';
      setError(errorMessage);
      console.error(`[usePaidSubscribers] Error fetching subscribers:`, err);
      console.log(`[usePaidSubscribers] ${errorMessage}, using dummy data`);
      setUseDummyData(true);
      setSubscribers(dummyProfiles);
      setHasMore(false);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      console.log('[usePaidSubscribers] Fetch operation completed');
    }
  }, [currentPage, pageSize, handleLogout]);

  useEffect(() => {
    console.log('[usePaidSubscribers] Hook mounted');
    return () => {
      console.log('[usePaidSubscribers] Hook unmounting');
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    console.log('[usePaidSubscribers] Initial fetch triggered');
    fetchSubscribers(true);
  }, [fetchSubscribers]);

  return {
    subscribers, // Renamed from creators to subscribers
    loading,
    error,
    hasMore,
    useDummyData,
    fetchMore: () => fetchSubscribers(false),
    reset: () => fetchSubscribers(true),
  };
};

export default usePaidSubscribers;
