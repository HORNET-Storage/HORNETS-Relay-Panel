import { useState, useCallback } from 'react';
import { SubscriberProfile } from '@app/hooks/usePaidSubscribers';
import { 
  getProfilesFromCache, 
  cacheProfiles, 
  getProfileFromCache,
  cacheProfile 
} from '@app/utils/profileCache';
import { ensureProfilePicture } from '@app/utils/defaultProfilePicture';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';

interface ProfileAPIResponse {
  profiles: SubscriberProfile[];
  not_found: string[];
}

interface UseProfileAPIReturn {
  fetchProfiles: (pubkeys: string[]) => Promise<SubscriberProfile[]>;
  fetchSingleProfile: (pubkey: string) => Promise<SubscriberProfile | null>;
  loading: boolean;
  error: string | null;
}

export const useProfileAPI = (): UseProfileAPIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogout = useHandleLogout();

  const fetchProfiles = useCallback(async (pubkeys: string[]): Promise<SubscriberProfile[]> => {
    if (pubkeys.length === 0) return [];

    setError(null);

    try {
      // Check cache first - get profiles that are already cached and not expired
      const cachedProfiles = getProfilesFromCache(pubkeys);
      const cachedPubkeys = Object.keys(cachedProfiles);
      
      // Find pubkeys that need to be fetched from API
      const uncachedPubkeys = pubkeys.filter(pubkey => !cachedPubkeys.includes(pubkey));
      
      // If all profiles are cached, return them immediately
      if (uncachedPubkeys.length === 0) {
        return pubkeys.map(pubkey => cachedProfiles[pubkey]).filter(Boolean);
      }

      setLoading(true);

      // Fetch uncached profiles from API
      const token = readToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${config.baseURL}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pubkeys: uncachedPubkeys
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          throw new Error('Authentication expired');
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ProfileAPIResponse = await response.json();
      
      // Cache the newly fetched profiles with default pictures ensured
      if (data.profiles && data.profiles.length > 0) {
        const profilesWithDefaults = data.profiles.map(profile => ({
          ...profile,
          picture: ensureProfilePicture(profile.picture)
        }));
        cacheProfiles(profilesWithDefaults);
      }

      // Combine cached and newly fetched profiles
      const allProfiles: SubscriberProfile[] = [];
      pubkeys.forEach(pubkey => {
        // First check if we have it in cache
        const cached = cachedProfiles[pubkey];
        if (cached) {
          allProfiles.push({
            ...cached,
            picture: ensureProfilePicture(cached.picture)
          });
          return;
        }
        
        // Then check if we just fetched it
        const fetched = data.profiles.find(p => p.pubkey === pubkey);
        if (fetched) {
          allProfiles.push({
            ...fetched,
            picture: ensureProfilePicture(fetched.picture)
          });
        }
      });

      return allProfiles;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profiles';
      setError(errorMessage);
      console.error('Error fetching profiles:', err);
      
      // Return cached profiles even if API failed, ensuring default pictures
      const cachedProfiles = getProfilesFromCache(pubkeys);
      return Object.values(cachedProfiles).map(profile => ({
        ...profile,
        picture: ensureProfilePicture(profile.picture)
      }));
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  const fetchSingleProfile = useCallback(async (pubkey: string): Promise<SubscriberProfile | null> => {
    // Check cache first
    const cached = getProfileFromCache(pubkey);
    if (cached) {
      return {
        ...cached,
        picture: ensureProfilePicture(cached.picture)
      };
    }

    // Fetch from API using the batch endpoint
    const profiles = await fetchProfiles([pubkey]);
    return profiles.length > 0 ? profiles[0] : null;
  }, [fetchProfiles]);

  return {
    fetchProfiles,
    fetchSingleProfile,
    loading,
    error
  };
};