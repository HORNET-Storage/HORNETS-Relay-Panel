export type AllowedUsersMode = 'free' | 'paid' | 'exclusive' | 'personal';

export type AccessScope = 'all_users' | 'paid_users' | 'allowed_users';

export interface AllowedUsersTier {
  name: string;
  price_sats: number;
  monthly_limit_bytes: number;
  unlimited: boolean;
  active?: boolean; // For free mode - only one tier can be active at a time
}

// Legacy interface - kept for migration purposes
export interface AllowedUsersTierLegacy {
  data_limit: string;
  price: string;
  active?: boolean;
}

export interface AllowedUsersAccessConfig {
  enabled: boolean;
  scope: AccessScope;
}

export interface AllowedUsersSettings {
  mode: AllowedUsersMode;
  read_access: AllowedUsersAccessConfig;
  write_access: AllowedUsersAccessConfig;
  tiers: AllowedUsersTier[];
}

export interface AllowedUsersNpub {
  npub: string;
  tier: string;
  added_at: string;
}

export interface AllowedUsersNpubsResponse {
  npubs: AllowedUsersNpub[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BulkImportRequest {
  type: 'read' | 'write';
  npubs: string[]; // Format: "npub1...:tier"
}

export interface AllowedUsersApiResponse {
  allowed_users: AllowedUsersSettings;
}

// Mode-specific option configurations
export interface ModeOptions {
  readOptions: { value: AccessScope; label: string }[];
  writeOptions: { value: AccessScope; label: string }[];
  allowsFreeTiers: boolean;
  requiresNpubManagement: boolean;
}

export const MODE_CONFIGURATIONS: Record<AllowedUsersMode, ModeOptions> = {
  free: {
    readOptions: [
      { value: 'all_users', label: 'All Users' },
      { value: 'allowed_users', label: 'Allowed Users' }
    ],
    writeOptions: [
      { value: 'all_users', label: 'All Users' },
      { value: 'allowed_users', label: 'Allowed Users' }
    ],
    allowsFreeTiers: true,
    requiresNpubManagement: false
  },
  paid: {
    readOptions: [
      { value: 'all_users', label: 'All Users' },
      { value: 'paid_users', label: 'Paid Users' }
    ],
    writeOptions: [
      { value: 'paid_users', label: 'Paid Users' }
    ],
    allowsFreeTiers: false,
    requiresNpubManagement: false
  },
  exclusive: {
    readOptions: [
      { value: 'allowed_users', label: 'Allowed Users' },
      { value: 'all_users', label: 'All Users' }
    ],
    writeOptions: [
      { value: 'allowed_users', label: 'Allowed Users' },
      { value: 'all_users', label: 'All Users' }
    ],
    allowsFreeTiers: true,
    requiresNpubManagement: true
  },
  personal: {
    readOptions: [
      { value: 'allowed_users', label: 'Only Me' }
    ],
    writeOptions: [
      { value: 'allowed_users', label: 'Only Me' }
    ],
    allowsFreeTiers: true,
    requiresNpubManagement: true
  }
};

// Default tier configurations for each mode
export const DEFAULT_TIERS: Record<AllowedUsersMode, AllowedUsersTier[]> = {
  free: [
    { name: 'Basic', price_sats: 0, monthly_limit_bytes: 104857600, unlimited: false, active: false }, // 100 MB
    { name: 'Standard', price_sats: 0, monthly_limit_bytes: 524288000, unlimited: false, active: true }, // 500 MB - default active
    { name: 'Plus', price_sats: 0, monthly_limit_bytes: 1073741824, unlimited: false, active: false } // 1 GB
  ],
  paid: [
    { name: 'Starter', price_sats: 1000, monthly_limit_bytes: 1073741824, unlimited: false }, // 1 GB
    { name: 'Professional', price_sats: 5000, monthly_limit_bytes: 5368709120, unlimited: false }, // 5 GB
    { name: 'Business', price_sats: 10000, monthly_limit_bytes: 10737418240, unlimited: false } // 10 GB
  ],
  exclusive: [
    { name: 'Member', price_sats: 0, monthly_limit_bytes: 5368709120, unlimited: false }, // 5 GB
    { name: 'VIP', price_sats: 0, monthly_limit_bytes: 53687091200, unlimited: false }, // 50 GB
    { name: 'Unlimited', price_sats: 0, monthly_limit_bytes: 0, unlimited: true }
  ],
  personal: [
    { name: 'Personal', price_sats: 0, monthly_limit_bytes: 0, unlimited: true, active: true } // Unlimited and free
  ]
};