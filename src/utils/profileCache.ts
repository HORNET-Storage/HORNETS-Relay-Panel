import { SubscriberProfile } from '@app/hooks/usePaidSubscribers';

interface CachedProfile {
  profile: SubscriberProfile;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_PREFIX = 'profile_cache_';

/**
 * Get profile from cache if it exists and hasn't expired
 */
export const getProfileFromCache = (pubkey: string): SubscriberProfile | null => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${pubkey}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { profile, timestamp }: CachedProfile = JSON.parse(cached);
    
    // Check if cache has expired
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Error reading profile from cache:', error);
    return null;
  }
};

/**
 * Cache a profile with current timestamp
 */
export const cacheProfile = (pubkey: string, profile: SubscriberProfile): void => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${pubkey}`;
    const cached: CachedProfile = {
      profile,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    console.error('Error caching profile:', error);
  }
};

/**
 * Check if a profile cache has expired (but don't remove it)
 */
export const isCacheExpired = (pubkey: string): boolean => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${pubkey}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return true;
    
    const { timestamp }: CachedProfile = JSON.parse(cached);
    return Date.now() - timestamp > CACHE_DURATION;
  } catch (error) {
    return true;
  }
};

/**
 * Get multiple profiles from cache, returns only non-expired ones
 */
export const getProfilesFromCache = (pubkeys: string[]): Record<string, SubscriberProfile> => {
  const cachedProfiles: Record<string, SubscriberProfile> = {};
  
  pubkeys.forEach(pubkey => {
    const profile = getProfileFromCache(pubkey);
    if (profile) {
      cachedProfiles[pubkey] = profile;
    }
  });
  
  return cachedProfiles;
};

/**
 * Cache multiple profiles at once
 */
export const cacheProfiles = (profiles: SubscriberProfile[]): void => {
  profiles.forEach(profile => {
    cacheProfile(profile.pubkey, profile);
  });
};

/**
 * Clear all profile cache (useful for testing or cache invalidation)
 */
export const clearProfileCache = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing profile cache:', error);
  }
};

/**
 * Get cache statistics for debugging
 */
export const getCacheStats = (): { totalCached: number; expired: number } => {
  let totalCached = 0;
  let expired = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        totalCached++;
        const pubkey = key.replace(CACHE_KEY_PREFIX, '');
        if (isCacheExpired(pubkey)) {
          expired++;
        }
      }
    }
  } catch (error) {
    console.error('Error getting cache stats:', error);
  }
  
  return { totalCached, expired };
};