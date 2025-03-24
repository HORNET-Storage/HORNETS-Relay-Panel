/**
 * @deprecated This hook has been renamed to usePaidSubscribers as it retrieves paid subscriber profiles, not trending creators.
 * Please use the usePaidSubscribers hook instead.
 */

import usePaidSubscribers, { SubscriberProfile } from './usePaidSubscribers';

// Re-export the hook with the old name for backward compatibility
export default usePaidSubscribers;

// Re-export the types
export type { SubscriberProfile as CreatorProfile } from './usePaidSubscribers';
