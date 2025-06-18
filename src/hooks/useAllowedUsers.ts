import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  getAllowedUsersSettings,
  updateAllowedUsersSettings,
  getReadNpubs,
  getWriteNpubs,
  addReadNpub,
  addWriteNpub,
  removeReadNpub,
  removeWriteNpub,
  bulkImportNpubs
} from '@app/api/allowedUsers.api';
import {
  AllowedUsersSettings,
  AllowedUsersNpub,
  AllowedUsersMode,
  BulkImportRequest
} from '@app/types/allowedUsers.types';

export const useAllowedUsersSettings = () => {
  const [settings, setSettings] = useState<AllowedUsersSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllowedUsersSettings();
      setSettings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      
      // Don't show error message if it's just that the endpoint doesn't exist yet
      if (!errorMessage.includes('404') && !errorMessage.includes('not valid JSON')) {
        message.error(errorMessage);
      }
      
      // Set default settings if API is not available yet
      setSettings({
        mode: 'free',
        read_access: {
          enabled: true,
          scope: 'all_users'
        },
        write_access: {
          enabled: true,
          scope: 'all_users'
        },
        tiers: [
          { data_limit: '1 GB per month', price: '0' }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: AllowedUsersSettings) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAllowedUsersSettings(newSettings);
      if (result.success) {
        setSettings(newSettings);
        message.success('Settings updated successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      if (errorMessage.includes('access control not initialized')) {
        message.error('Please restart the relay after configuration changes');
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};

export const useAllowedUsersNpubs = (type: 'read' | 'write') => {
  const [npubs, setNpubs] = useState<AllowedUsersNpub[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const fetchNpubs = useCallback(async (pageNum: number = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = type === 'read'
        ? await getReadNpubs(pageNum, pageSize)
        : await getWriteNpubs(pageNum, pageSize);
      
      setNpubs(data.npubs);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${type} NPUBs`;
      setError(errorMessage);
      
      // Don't show error message if it's just that the endpoint doesn't exist yet
      if (!errorMessage.includes('404') && !errorMessage.includes('not valid JSON')) {
        message.error(errorMessage);
      }
      
      // Set empty data if API is not available yet
      setNpubs([]);
      setTotal(0);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [type, page, pageSize]);

  const addNpub = useCallback(async (npub: string, tier: string) => {
    setLoading(true);
    try {
      const result = type === 'read' 
        ? await addReadNpub(npub, tier)
        : await addWriteNpub(npub, tier);
      
      if (result.success) {
        message.success(`NPUB added to ${type} list successfully`);
        await fetchNpubs(1); // Refresh the list
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to add NPUB to ${type} list`;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [type, fetchNpubs]);

  const removeNpub = useCallback(async (npub: string) => {
    setLoading(true);
    try {
      const result = type === 'read' 
        ? await removeReadNpub(npub)
        : await removeWriteNpub(npub);
      
      if (result.success) {
        message.success(`NPUB removed from ${type} list successfully`);
        await fetchNpubs(page); // Refresh current page
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to remove NPUB from ${type} list`;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [type, page, fetchNpubs]);

  const bulkImport = useCallback(async (npubsData: string[]) => {
    setLoading(true);
    try {
      const importData: BulkImportRequest = {
        type,
        npubs: npubsData
      };
      
      const result = await bulkImportNpubs(importData);
      if (result.success) {
        message.success(`Bulk import completed: ${result.imported} imported, ${result.failed} failed`);
        await fetchNpubs(1); // Refresh the list
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bulk import failed';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [type, fetchNpubs]);

  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
    fetchNpubs(newPage);
  }, [fetchNpubs]);

  useEffect(() => {
    fetchNpubs();
  }, [fetchNpubs]);

  return {
    npubs,
    total,
    loading,
    error,
    page,
    pageSize,
    addNpub,
    removeNpub,
    bulkImport,
    changePage,
    refetch: fetchNpubs
  };
};

// Validation hook
export const useAllowedUsersValidation = () => {
  const validateSettings = useCallback((settings: AllowedUsersSettings): string[] => {
    const errors: string[] = [];
    
    // Mode validation
    if (!['free', 'paid', 'exclusive'].includes(settings.mode)) {
      errors.push('Invalid mode selected');
    }
    
    // Tier validation
    if (settings.mode === 'paid' && settings.tiers.some(t => t.price === '0')) {
      errors.push('Paid mode cannot have free tiers');
    }
    
    // Scope validation
    if (settings.mode === 'paid' && settings.write_access.scope !== 'paid_users') {
      errors.push('Paid mode write access must be limited to paid users');
    }
    
    if (settings.mode === 'exclusive' && settings.write_access.scope !== 'allowed_users') {
      errors.push('Exclusive mode write access must be limited to allowed users');
    }
    
    // Tiers validation
    if (settings.tiers.length === 0) {
      errors.push('At least one tier must be configured');
    }
    
    return errors;
  }, []);

  const validateNpub = useCallback((npub: string): string | null => {
    if (!npub.trim()) {
      return 'NPUB cannot be empty';
    }
    
    if (!npub.startsWith('npub1')) {
      return 'NPUB must start with "npub1"';
    }
    
    if (npub.length !== 63) {
      return 'NPUB must be 63 characters long';
    }
    
    return null;
  }, []);

  return {
    validateSettings,
    validateNpub
  };
};