import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';

export interface TypeStat {
  type: string;  // Content type (image/video)
  count: number; // Number of items
}

export interface UserStat {
  pubkey: string; // User public key
  count: number;  // Number of blocked items
}

export interface ModerationStats {
  total_blocked: number;       // Total number of blocked events
  total_blocked_today: number; // Number of events blocked today
  by_content_type: TypeStat[]; // Breakdown by content type
  by_user: UserStat[];         // Top users with blocked content
  recent_reasons: string[];    // Recent blocking reasons
}

export const getModerationStats = async (): Promise<ModerationStats> => {
  const token = readToken();
  const response = await fetch(`${config.baseURL}/api/moderation/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};
