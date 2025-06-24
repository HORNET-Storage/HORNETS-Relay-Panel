import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import {
  AllowedUsersSettings,
  AllowedUsersApiResponse,
  AllowedUsersNpubsResponse,
  BulkImportRequest,
  AllowedUsersNpub,
  AllowedUsersMode,
  DEFAULT_TIERS
} from '@app/types/allowedUsers.types';

// Settings Management
export const getAllowedUsersSettings = async (): Promise<AllowedUsersSettings> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/settings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    
    // Extract allowed_users from the new nested structure
    const allowedUsersData = data.settings?.allowed_users;
    if (!allowedUsersData) {
      throw new Error('No allowed_users data found in response');
    }
    
    // Transform tiers from backend format to frontend format
    let transformedTiers = [];
    
    // Check if tiers exist in response, otherwise use defaults
    if (allowedUsersData.tiers && Array.isArray(allowedUsersData.tiers)) {
      transformedTiers = allowedUsersData.tiers.map((tier: any) => ({
        name: tier.name || 'Unnamed Tier',
        price_sats: tier.price_sats || 0,
        monthly_limit_bytes: tier.monthly_limit_bytes || 0,
        unlimited: tier.unlimited || false
      }));
    } else {
      // Use default tiers for the mode if none provided
      const mode = allowedUsersData.mode as AllowedUsersMode;
      transformedTiers = DEFAULT_TIERS[mode] || DEFAULT_TIERS.free;
    }

    // For free mode, reconstruct full UI options with active tier marked
    if (allowedUsersData.mode === 'free' && transformedTiers.length === 1) {
      const activeTierBytes = transformedTiers[0].monthly_limit_bytes;
      transformedTiers = DEFAULT_TIERS.free.map(defaultTier => ({
        ...defaultTier,
        active: defaultTier.monthly_limit_bytes === activeTierBytes
      }));
    }
    
    // For personal mode, reconstruct with single unlimited tier
    if (allowedUsersData.mode === 'personal' && transformedTiers.length === 1) {
      transformedTiers = DEFAULT_TIERS.personal;
    }
    
    const transformedSettings = {
      mode: allowedUsersData.mode || 'free',
      read_access: allowedUsersData.read_access || { enabled: true, scope: 'all_users' },
      write_access: allowedUsersData.write_access || { enabled: true, scope: 'all_users' },
      tiers: transformedTiers
    };
    
    return transformedSettings;
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const updateAllowedUsersSettings = async (settings: AllowedUsersSettings): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  
  // Filter tiers based on mode - for free and personal modes, only send active tier
  const tiersToSend = (settings.mode === 'free' || settings.mode === 'personal')
    ? settings.tiers.filter(tier => tier.active)
    : settings.tiers;
  
  // Transform to nested format as expected by new unified backend API
  const nestedSettings = {
    "settings": {
      "allowed_users": {
        "mode": settings.mode,
        "read_access": {
          "enabled": settings.read_access.enabled,
          "scope": settings.read_access.scope
        },
        "write_access": {
          "enabled": settings.write_access.enabled,
          "scope": settings.write_access.scope
        },
        "tiers": tiersToSend.map(tier => ({
          "name": tier.name,
          "price_sats": tier.price_sats,
          "monthly_limit_bytes": tier.monthly_limit_bytes,
          "unlimited": tier.unlimited
        }))
      }
    }
  };
  
  console.log('Sending to backend:', JSON.stringify(nestedSettings, null, 2));
  
  const response = await fetch(`${config.baseURL}/api/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(nestedSettings),
  });
  
  const text = await response.text();
  console.log('Backend response:', response.status, text);
  
  if (!response.ok) {
    console.error('Backend error:', response.status, text);
    throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
  }
  
  try {
    return JSON.parse(text) || { success: true, message: 'Settings updated successfully' };
  } catch (jsonError) {
    // If response is not JSON, assume success if status was OK
    return { success: true, message: 'Settings updated successfully' };
  }
};

// Read NPUBs Management
export const getReadNpubs = async (page = 1, pageSize = 20): Promise<AllowedUsersNpubsResponse> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/read?page=${page}&pageSize=${pageSize}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    // Transform backend response to expected format
    return {
      npubs: data.npubs || [],
      total: data.pagination?.total || 0,
      page: data.pagination?.page || page,
      pageSize: data.pagination?.pageSize || pageSize
    };
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const addReadNpub = async (npub: string, tier: string): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ npub, tier }),
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const removeReadNpub = async (npub: string): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/read/${npub}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

// Write NPUBs Management
export const getWriteNpubs = async (page = 1, pageSize = 20): Promise<AllowedUsersNpubsResponse> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/write?page=${page}&pageSize=${pageSize}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    // Transform backend response to expected format
    return {
      npubs: data.npubs || [],
      total: data.pagination?.total || 0,
      page: data.pagination?.page || page,
      pageSize: data.pagination?.pageSize || pageSize
    };
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const addWriteNpub = async (npub: string, tier: string): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/write`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ npub, tier }),
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const removeWriteNpub = async (npub: string): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/write/${npub}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

// Bulk Import
export const bulkImportNpubs = async (importData: BulkImportRequest): Promise<{ success: boolean, message: string, imported: number, failed: number }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/allowed-npubs/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(importData),
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};