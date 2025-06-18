import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import {
  AllowedUsersSettings,
  AllowedUsersApiResponse,
  AllowedUsersNpubsResponse,
  BulkImportRequest,
  AllowedUsersNpub
} from '@app/types/allowedUsers.types';

// Settings Management
export const getAllowedUsersSettings = async (): Promise<AllowedUsersSettings> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/settings/allowed_users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const text = await response.text();
  try {
    const data: AllowedUsersApiResponse = JSON.parse(text);
    
    // Transform tiers from backend format to frontend format
    const transformedSettings = {
      ...data.allowed_users,
      tiers: data.allowed_users.tiers.map(tier => ({
        data_limit: (tier as any).datalimit || tier.data_limit || '',
        price: tier.price
      }))
    };
    
    return transformedSettings;
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

export const updateAllowedUsersSettings = async (settings: AllowedUsersSettings): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  
  // Transform to nested format as expected by backend
  const nestedSettings = {
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
      "tiers": settings.tiers.map(tier => ({
        "datalimit": tier.data_limit || "1 GB per month",  // Backend expects 'datalimit' not 'data_limit', fallback for empty values
        "price": tier.price || "0"
      }))
    }
  };
  
  console.log('Sending to backend:', JSON.stringify(nestedSettings, null, 2));
  
  const response = await fetch(`${config.baseURL}/api/settings/allowed_users`, {
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
    return JSON.parse(text);
  } catch (jsonError) {
    throw new Error(`Invalid JSON response: ${text}`);
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