import { useState, useEffect, useCallback } from 'react';
import { getModerationStats, ModerationStats, UserStat as ApiUserStat } from '@app/api/moderationStats.api';

export type UserStat = ApiUserStat;

export const useModerationStats = () => {
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all moderation stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModerationStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch moderation stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Get flag count for a specific pubkey
  const getFlagCountForPubkey = useCallback((pubkey: string): number => {
    if (!stats) return 0;
    
    // Clean the pubkey in case it has the prefix
    const cleanPubkey = pubkey.replace('blocked_pubkey:', '');
    
    // Find the user stat for this pubkey
    const userStat = stats.by_user.find(user => 
      user.pubkey === cleanPubkey || user.pubkey === `blocked_pubkey:${cleanPubkey}`
    );
    
    return userStat?.count || 0;
  }, [stats]);

  // Get flag counts for multiple pubkeys
  const getFlagCountsForPubkeys = useCallback((pubkeys: string[]): Record<string, number> => {
    if (!stats) return {};
    
    return pubkeys.reduce((acc, pubkey) => {
      acc[pubkey] = getFlagCountForPubkey(pubkey);
      return acc;
    }, {} as Record<string, number>);
  }, [getFlagCountForPubkey, stats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    getFlagCountForPubkey,
    getFlagCountsForPubkeys
  };
};
