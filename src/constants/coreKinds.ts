// Core kinds that are essential for relay operation and cannot be removed
export const CORE_KINDS = [
  'kind0',    // User profiles - Required for user management (CRITICAL - relay unusable without)
  'kind22242', // Auth events - Required for NIP-42 authentication
  'kind10010', // Mute list - Required for content filtering/mute words
  'kind19841', // Storage manifest - Required for file tracking
  'kind19842', // Storage metadata - Required for file info  
  'kind19843', // Storage delete - Required for file cleanup
];

// Optional kinds that can be toggled (kind1 can be removed if needed)
export const OPTIONAL_KINDS = [
  'kind1',    // Text notes - Core functionality but can be disabled if needed
];

// Helper function to ensure core kinds are always included
export const ensureCoreKinds = (kindList: string[]): string[] => {
  const combined = [...kindList, ...CORE_KINDS];
  return Array.from(new Set(combined));
};

// Helper function to check if a kind is protected
export const isCoreKind = (kind: string): boolean => {
  return CORE_KINDS.includes(kind);
};

// Helper function to get all possible kinds from noteOptions
export const getAllPossibleKinds = (): string[] => {
  // Import noteOptions dynamically to avoid circular dependency
  const { noteOptions } = require('../constants/relaySettings');
  return noteOptions.map((option: any) => option.kindString);
};

// Helper function to calculate inverse for blacklist mode
export const calculateInverseKinds = (selectedKinds: string[]): string[] => {
  const allPossibleKinds = getAllPossibleKinds();
  // In blacklist mode: selected = blocked, so remove selected from all possible kinds
  // Core kinds can never be blocked, so they're always in the whitelist
  const allowedKinds = allPossibleKinds.filter(kind => 
    !selectedKinds.includes(kind) || isCoreKind(kind)
  );
  return allowedKinds;
};