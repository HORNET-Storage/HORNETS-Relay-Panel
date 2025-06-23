export type AllowedUsersMode = 'free' | 'paid' | 'exclusive' | 'personal';

export type AccessScope = 'all_users' | 'paid_users' | 'allowed_users';

export interface AllowedUsersTier {
  data_limit: string;
  price: string;
  active?: boolean; // For free mode - only one tier can be active at a time
}

// Backend expects this format
export interface AllowedUsersTierBackend {
  datalimit: string;
  price: string;
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
    { data_limit: '100 MB per month', price: '0', active: false },
    { data_limit: '500 MB per month', price: '0', active: true }, // Default active tier
    { data_limit: '1 GB per month', price: '0', active: false }
  ],
  paid: [
    { data_limit: '1 GB per month', price: '1000' },
    { data_limit: '5 GB per month', price: '5000' },
    { data_limit: '10 GB per month', price: '10000' }
  ],
  exclusive: [
    { data_limit: '5 GB per month', price: '0' },
    { data_limit: '50 GB per month', price: '0' },
    { data_limit: 'unlimited', price: '0' }
  ],
  personal: [
    { data_limit: 'unlimited', price: '0', active: true } // Personal use, unlimited and free
  ]
};