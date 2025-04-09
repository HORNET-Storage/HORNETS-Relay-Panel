import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';

export interface BlockedPubkey {
  pubkey: string;
  reason: string;
  blocked_at: string;
}

export const getBlockedPubkeys = async (): Promise<{ blocked_pubkeys: BlockedPubkey[], count: number }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/blocked-pubkeys`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const blockPubkey = async (pubkey: string, reason?: string): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/blocked-pubkeys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ pubkey, reason }),
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const unblockPubkey = async (pubkey: string): Promise<{ success: boolean, message: string }> => {
  const token = readToken();
  // Strip the "blocked_pubkey:" prefix if it exists
  const cleanPubkey = pubkey.replace('blocked_pubkey:', '');
  
  const response = await fetch(`${config.baseURL}/api/blocked-pubkeys/${cleanPubkey}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};
