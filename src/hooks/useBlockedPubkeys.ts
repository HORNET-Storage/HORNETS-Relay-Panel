import { useState, useCallback, useEffect } from 'react';
import { getBlockedPubkeys, blockPubkey, unblockPubkey, BlockedPubkey } from '@app/api/blockedPubkeys.api';
import { notification } from 'antd';

export const useBlockedPubkeys = () => {
  const [blockedPubkeys, setBlockedPubkeys] = useState<BlockedPubkey[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockedPubkeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBlockedPubkeys();
      setBlockedPubkeys(data.blocked_pubkeys);
      setCount(data.count);
    } catch (err) {
      setError('Failed to fetch blocked pubkeys');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch blocked pubkeys',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addBlockedPubkey = useCallback(async (pubkey: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await blockPubkey(pubkey, reason);
      if (result.success) {
        notification.success({
          message: 'Success',
          description: result.message,
        });
        await fetchBlockedPubkeys(); // Refresh list
      }
    } catch (err) {
      setError('Failed to block pubkey');
      notification.error({
        message: 'Error',
        description: 'Failed to block pubkey',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchBlockedPubkeys]);

  const removeBlockedPubkey = useCallback(async (pubkey: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await unblockPubkey(pubkey);
      if (result.success) {
        notification.success({
          message: 'Success',
          description: result.message,
        });
        await fetchBlockedPubkeys(); // Refresh list
      }
    } catch (err) {
      setError('Failed to unblock pubkey');
      notification.error({
        message: 'Error',
        description: 'Failed to unblock pubkey',
      });
    } finally {
      setLoading(false);
    }
  }, [fetchBlockedPubkeys]);

  // Initial fetch
  useEffect(() => {
    fetchBlockedPubkeys();
  }, [fetchBlockedPubkeys]);

  return {
    blockedPubkeys,
    count,
    loading,
    error,
    fetchBlockedPubkeys,
    addBlockedPubkey,
    removeBlockedPubkey,
  };
};

export default useBlockedPubkeys;
