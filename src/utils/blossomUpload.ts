import config from '@app/config/config';
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';

export interface BlossomUploadResult {
  url: string;
  hash: string;
}

/**
 * Calculate SHA-256 hash of a file
 */
export const calculateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Create and sign NIP-98 authorization event for Blossom upload
 */
export const createNIP98AuthEvent = async (
  method: string,
  absoluteUrl: string,
  fileHash?: string
): Promise<any> => {
  if (!window.nostr) {
    throw new Error('Nostr extension is not available. Please install a Nostr browser extension (Alby, nos2x, etc.)');
  }

  try {
    // Get the user's public key
    const pubkey = await window.nostr.getPublicKey();
    
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create the unsigned event according to NIP-98 spec
    const unsignedEvent = {
      kind: 27235, // NIP-98 HTTP Auth
      created_at: timestamp,
      tags: [
        ['u', absoluteUrl], // MUST be absolute URL
        ['method', method.toUpperCase()], // MUST be uppercase HTTP method
        ...(fileHash ? [['payload', fileHash]] : []) // SHA256 hash for PUT/POST with body
      ],
      content: '', // SHOULD be empty
      pubkey: pubkey,
    };

    console.log('Creating NIP-98 auth event with URL:', absoluteUrl);
    console.log('Full NIP-98 event:', unsignedEvent);
    console.log('NIP-98 event tags:', unsignedEvent.tags);

    // Sign the event using the browser extension
    const signedEvent = await window.nostr.signEvent(unsignedEvent);
    console.log('Signed NIP-98 event:', signedEvent);
    
    return signedEvent;
  } catch (error) {
    console.error('Failed to create/sign NIP-98 auth event:', error);
    throw new Error('Failed to sign authorization event. Please check your Nostr extension.');
  }
};

/**
 * Publish Kind 117 file metadata event to relay before upload
 */
export const publishKind117Event = async (
  file: File,
  fileHash: string
): Promise<void> => {
  if (!window.nostr) {
    throw new Error('Nostr extension is not available. Please install a Nostr browser extension (Alby, nos2x, etc.)');
  }

  try {
    // Get the user's public key
    const pubkey = await window.nostr.getPublicKey();
    
    // Create Kind 117 file metadata event
    const kind117Event = {
      kind: 117,
      created_at: Math.floor(Date.now() / 1000),
      content: 'Relay icon upload',
      tags: [
        ['blossom_hash', fileHash],
        ['name', file.name],
        ['size', file.size.toString()],
        ['type', file.type]
      ],
      pubkey: pubkey,
    };

    console.log('Creating Kind 117 event:', kind117Event);

    // Sign the event using browser extension
    const signedKind117 = await window.nostr.signEvent(kind117Event);
    console.log('Signed Kind 117 event:', signedKind117);

    // Create NDK instance for publishing
    const ndk = new NDK({
      explicitRelayUrls: config.ownRelayUrl ? [config.ownRelayUrl] : config.nostrRelayUrls,
    });

    await ndk.connect();

    // Create NDK event from signed event
    const ndkEvent = new NDKEvent(ndk, signedKind117);

    // Publish to relay
    await ndkEvent.publish();
    console.log('Kind 117 event published successfully');

    // Wait for event to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    console.error('Failed to publish Kind 117 event:', error);
    throw new Error('Failed to publish file metadata event. Please try again.');
  }
};

/**
 * Upload file to Blossom server
 */
export const uploadToBlossom = async (file: File): Promise<BlossomUploadResult> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  try {
    // 1. Calculate SHA-256 hash of the file for both Blossom and NIP-98
    const hash = await calculateFileHash(file);
    
    // 2. FIRST: Publish Kind 117 file metadata event to relay
    console.log('Publishing Kind 117 event...');
    await publishKind117Event(file, hash);
    
    // 3. Create the upload URL using the exact base URL from config
    const uploadUrl = `${config.baseURL}/blossom/upload`;
    
    console.log('Config baseURL:', config.baseURL);
    console.log('Final upload URL:', uploadUrl);

    // 4. Create NIP-98 authorization event with the EXACT same URL that will be fetched
    const authEvent = await createNIP98AuthEvent('PUT', uploadUrl, hash);

    // 5. Upload to Blossom server using the same URL
    console.log('Uploading file to Blossom server...');
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Nostr ${btoa(JSON.stringify(authEvent))}`,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    // 5. Return the Blossom URL
    const blossomUrl = `${config.baseURL}/blossom/${hash}`;
    
    return {
      url: blossomUrl,
      hash
    };
  } catch (error) {
    console.error('Blossom upload failed:', error);
    throw error instanceof Error ? error : new Error('Upload failed');
  }
};

/**
 * Validate if a string is a valid URL
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate if a URL points to an image
 */
export const isImageUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlPath = new URL(url).pathname.toLowerCase();
  
  return imageExtensions.some(ext => urlPath.endsWith(ext));
};