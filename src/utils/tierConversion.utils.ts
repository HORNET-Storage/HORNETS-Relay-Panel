// Utility functions for converting between user-friendly tier formats and backend bytes

export type DataUnit = 'MB' | 'GB' | 'TB';

export interface TierDisplayFormat {
  value: number;           // e.g., 500, 1, 10
  unit: DataUnit;         // MB, GB, TB
  unlimited: boolean;      // special case
}

export interface TierLimits {
  name: string;
  price_sats: number;
  monthly_limit_bytes: number;
  unlimited: boolean;
}

// Validation constants (matching backend)
export const TIER_VALIDATION = {
  MIN_BYTES: 1048576,           // 1 MB
  MAX_BYTES: 1099511627776,     // 1 TB
  MIN_VALUE: 1,
  MAX_VALUE_MB: 1048576,        // 1 TB in MB
  MAX_VALUE_GB: 1024,           // 1 TB in GB
  MAX_VALUE_TB: 1               // 1 TB
} as const;

// Conversion constants
const BYTES_PER_MB = 1048576;      // 1024 * 1024
const BYTES_PER_GB = 1073741824;   // 1024 * 1024 * 1024  
const BYTES_PER_TB = 1099511627776; // 1024 * 1024 * 1024 * 1024

/**
 * Convert display format (value + unit) to bytes
 */
export const convertToBytes = (value: number, unit: DataUnit): number => {
  switch (unit) {
    case 'MB':
      return value * BYTES_PER_MB;
    case 'GB':
      return value * BYTES_PER_GB;
    case 'TB':
      return value * BYTES_PER_TB;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
};

/**
 * Convert bytes to the most appropriate display format
 */
export const bytesToDisplayFormat = (bytes: number): TierDisplayFormat => {
  // Handle zero or very small values
  if (bytes === 0) {
    return { value: 0, unit: 'MB', unlimited: false };
  }
  
  // Convert to TB if >= 1 TB
  if (bytes >= BYTES_PER_TB) {
    const tbValue = bytes / BYTES_PER_TB;
    return {
      value: Number(tbValue.toFixed(tbValue % 1 === 0 ? 0 : 2)),
      unit: 'TB',
      unlimited: false
    };
  }
  
  // Convert to GB if >= 1 GB
  if (bytes >= BYTES_PER_GB) {
    const gbValue = bytes / BYTES_PER_GB;
    return {
      value: Number(gbValue.toFixed(gbValue % 1 === 0 ? 0 : 2)),
      unit: 'GB',
      unlimited: false
    };
  }
  
  // Default to MB
  const mbValue = bytes / BYTES_PER_MB;
  return {
    value: Number(mbValue.toFixed(mbValue % 1 === 0 ? 0 : 2)),
    unit: 'MB',
    unlimited: false
  };
};

/**
 * Convert display format to friendly string (for display purposes)
 */
export const displayToFriendlyString = (display: TierDisplayFormat): string => {
  if (display.unlimited) {
    return 'unlimited';
  }
  return `${display.value} ${display.unit} per month`;
};

/**
 * Parse legacy string format to display format (for backward compatibility)
 */
export const parseLegacyFormat = (legacyString: string): TierDisplayFormat => {
  if (!legacyString || legacyString.toLowerCase().includes('unlimited')) {
    return { value: 0, unit: 'MB', unlimited: true };
  }
  
  // Extract number and unit from strings like "500 MB per month"
  const match = legacyString.match(/(\d+(?:\.\d+)?)\s*(MB|GB|TB)/i);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase() as DataUnit;
    return { value, unit, unlimited: false };
  }
  
  // Fallback for unrecognized formats
  return { value: 100, unit: 'MB', unlimited: false };
};

/**
 * Validate tier display format
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTierFormat = (display: TierDisplayFormat): ValidationResult => {
  if (display.unlimited) {
    return { isValid: true };
  }
  
  if (!display.value || display.value <= 0) {
    return { isValid: false, error: 'Value must be greater than 0' };
  }
  
  // Check max values per unit
  switch (display.unit) {
    case 'MB':
      if (display.value > TIER_VALIDATION.MAX_VALUE_MB) {
        return { isValid: false, error: 'Maximum limit is 1 TB (1,048,576 MB)' };
      }
      break;
    case 'GB':
      if (display.value > TIER_VALIDATION.MAX_VALUE_GB) {
        return { isValid: false, error: 'Maximum limit is 1 TB (1,024 GB)' };
      }
      break;
    case 'TB':
      if (display.value > TIER_VALIDATION.MAX_VALUE_TB) {
        return { isValid: false, error: 'Maximum limit is 1 TB' };
      }
      break;
  }
  
  // Check converted bytes are within range
  const bytes = convertToBytes(display.value, display.unit);
  if (bytes < TIER_VALIDATION.MIN_BYTES) {
    return { isValid: false, error: 'Minimum limit is 1 MB' };
  }
  
  if (bytes > TIER_VALIDATION.MAX_BYTES) {
    return { isValid: false, error: 'Maximum limit is 1 TB' };
  }
  
  return { isValid: true };
};

/**
 * Convert display format to backend API format
 */
export const toBackendFormat = (
  name: string,
  priceSats: number,
  display: TierDisplayFormat
): TierLimits => ({
  name,
  price_sats: priceSats,
  monthly_limit_bytes: display.unlimited ? 0 : convertToBytes(display.value, display.unit),
  unlimited: display.unlimited
});

/**
 * Convert backend API format to display format
 */
export const fromBackendFormat = (backend: TierLimits): {
  name: string;
  price_sats: number;
  display: TierDisplayFormat;
} => ({
  name: backend.name,
  price_sats: backend.price_sats,
  display: backend.unlimited 
    ? { value: 0, unit: 'MB', unlimited: true }
    : { ...bytesToDisplayFormat(backend.monthly_limit_bytes), unlimited: false }
});