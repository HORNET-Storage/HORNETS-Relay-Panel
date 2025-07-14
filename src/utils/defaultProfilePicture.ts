import logo from '@app/assets/logo.png';

/**
 * Get the default profile picture URL (bee logo) for users without profile pictures
 * This returns a URL that works both in development and production
 */
export const getDefaultProfilePicture = (): string => {
  // In production, this will be a relative URL that adapts to the deployment
  // In development, this will work with the dev server
  return logo;
};

/**
 * Ensure a profile has a valid picture URL, using default if none provided
 */
export const ensureProfilePicture = (pictureUrl?: string): string => {
  return pictureUrl && pictureUrl.trim() !== '' ? pictureUrl : getDefaultProfilePicture();
};