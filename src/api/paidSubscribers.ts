export interface PaidSubscriber {
  pubkey: string;
  picture: string;
  name?: string;
  about?: string;
  metadata?: {
    subscriptionTier?: string;
    subscribedSince?: string;
  };
}

// This is a placeholder function if needed in the future
// Currently the hook directly fetches from the API
export const getPaidSubscribers = (): Promise<PaidSubscriber[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([]);
    }, 0);
  });
};
