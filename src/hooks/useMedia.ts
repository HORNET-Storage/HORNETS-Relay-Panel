import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';

interface FileInfoWithContent {
  Hash: string;
  FileName: string;
  MimeType: string;
  Content: string;
  Size: number;
  Timestamp: Date;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface FilesResponse {
  data: FileInfoWithContent[];
  meta: PaginationMeta;
}

interface UseMediaOptions {
  pageSize?: number;
  mediaType?: string;
}

export interface MediaItem {
  hash: string;
  name: string;
  type: string;
  content: string;
  metadata?: {
    size?: string;
    timestamp?: string;
  };
}

const useMedia = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isMounted = useRef(true);
  const handleLogout = useHandleLogout();

  const convertFileToMediaItem = (file: FileInfoWithContent): MediaItem => ({
    hash: file.Hash,
    name: file.FileName,
    type: file.MimeType,
    content: file.Content,
    metadata: {
      size: file.Size.toString(),
      timestamp: new Date(file.Timestamp).getTime().toString(),
    },
  });

  const fetchMedia = useCallback(async (reset: boolean = false) => {
    if (loading || (!hasMore && !reset)) return;

    try {
      setLoading(true);
      const token = readToken();
      if (!token) throw new Error('No authentication token found');

      const page = reset ? 1 : currentPage;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        type: 'image/*' // Required parameter
      });

      const response = await fetch(`${config.baseURL}/api/files?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          throw new Error('Authentication failed');
        }
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: FilesResponse = await response.json();
      const newItems = data.data.map(convertFileToMediaItem);

      if (isMounted.current) {
        setMediaItems(prev => reset ? newItems : [...prev, ...newItems]);
        setCurrentPage(data.meta.page + 1);
        setTotalPages(data.meta.total_pages);
        setHasMore(data.meta.page < data.meta.total_pages);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch media';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [currentPage, loading, hasMore, handleLogout]);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    fetchMedia(true);
  }, [fetchMedia]);

  return {
    mediaItems,
    loading,
    error,
    hasMore,
    fetchMore: () => fetchMedia(false),
    reset: () => fetchMedia(true),
    totalItems: totalPages * 20
  };
};

export default useMedia;

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { message } from 'antd';

// interface FileInfoWithContent {
//   Hash: string;
//   FileName: string;
//   MimeType: string;
//   Content: string;
//   Size: number;
//   Timestamp: string;
// }

// interface PaginationMeta {
//   page: number;
//   limit: number;
//   total: number;
//   total_pages: number;
// }

// interface FilesResponse {
//   data: FileInfoWithContent[];
//   meta: PaginationMeta;
// }

// interface UseMediaOptions {
//   pageSize?: number;
//   mediaType?: string;
// }

// interface MediaItem {
//   hash: string;
//   name: string;
//   type: string;
//   metadata?: {
//     size?: string;
//     timestamp?: string;
//   };
// }

// const useMedia = (options: UseMediaOptions = {}) => {
//   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const isMounted = useRef(true);

//   const convertFileToMediaItem = (file: FileInfoWithContent): MediaItem => ({
//     hash: file.Hash,
//     name: file.FileName,
//     type: file.MimeType,
//     metadata: {
//       size: file.Size.toString(),
//       timestamp: new Date(file.Timestamp).getTime().toString(),
//     },
//   });

//   const fetchMedia = useCallback(async (reset: boolean = false) => {
//     if (loading || (!hasMore && !reset)) return;

//     try {
//       setLoading(true);
//       const page = reset ? 1 : currentPage;
//       const response = await fetch(`/api/files?page=${page}&limit=${options.pageSize || 20}`);

//       if (!response.ok) throw new Error(response.statusText);

//       const data: FilesResponse = await response.json();
//       const newItems = data.data.map(convertFileToMediaItem);

//       setMediaItems(prev => reset ? newItems : [...prev, ...newItems]);
//       setCurrentPage(data.meta.page + 1);
//       setTotalPages(data.meta.total_pages);
//       setHasMore(data.meta.page < data.meta.total_pages);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch media');
//       message.error('Failed to fetch media');
//     } finally {
//       setLoading(false);
//     }
//   }, [options.pageSize, currentPage, loading, hasMore]);

//   useEffect(() => () => { isMounted.current = false; }, []);

//   useEffect(() => {
//     fetchMedia(true);
//   }, []);

//   return {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     fetchMore: () => fetchMedia(false),
//     reset: () => fetchMedia(true),
//     totalItems: totalPages * (options.pageSize || 20)
//   };
// };

// export default useMedia;



// import { useState, useEffect, useCallback, useRef } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { NostrProvider } from '@app/types/nostr';

// interface MediaItemResponse {
//   hash: string;
//   name: string;
//   type: string;
//   contentHash?: string;
//   metadata?: {
//     size?: string;
//     timestamp?: string;
//     [key: string]: string | undefined;
//   };
// }

// interface MediaResponse {
//   items: MediaItemResponse[];
//   totalCount: number;
//   nextCursor?: string;
// }

// interface UseMediaOptions {
//   pageSize?: number;
//   mediaType?: string;
//   app?: string;
// }

// const useMedia = (options: UseMediaOptions = {}) => {
//   const [mediaItems, setMediaItems] = useState<MediaItemResponse[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
//   const [npub, setNpub] = useState<string | null>(null);
  
//   const isMounted = useRef(true);
//   const hasInitialized = useRef(false);

//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   // Debug log for config
//   useEffect(() => {
//     console.log('Config baseURL:', config.baseURL);
//     console.log('Token available:', !!token);
//   }, [token]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // Fetch public key from Nostr - only once
//   useEffect(() => {
//     let intervalId: NodeJS.Timeout | null = null;
    
//     const fetchPublicKey = async () => {
//       try {
//         const nostrProvider = window.nostr;
//         if (nostrProvider) {
//           console.log('Nostr provider found, getting public key...');
//           const pubkey = await nostrProvider.getPublicKey();
//           if (isMounted.current) {
//             console.log('Setting npub:', pubkey);
//             // setNpub(pubkey);
//             setNpub("6aabfbd9b8d51d1133807b064d19a6de230e8b28a402154354c08ababce80d74")
//           }
//         } else {
//           console.log('Nostr provider not found yet');
//         }
//       } catch (error) {
//         console.error('Failed to get Nostr public key:', error);
//       }
//     };

//     if (!npub && !hasInitialized.current) {
//       console.log('Starting Nostr check interval');
//       intervalId = setInterval(() => {
//         if (window.nostr) {
//           console.log('Nostr detected, attempting to fetch public key');
//           fetchPublicKey();
//           if (intervalId) {
//             console.log('Clearing Nostr check interval');
//             clearInterval(intervalId);
//           }
//         }
//       }, 1000);
//     }

//     return () => {
//       if (intervalId) {
//         console.log('Cleaning up Nostr check interval');
//         clearInterval(intervalId);
//       }
//     };
//   }, []);

//   const fetchMedia = useCallback(async (reset: boolean = false) => {
//     console.log('fetchMedia called:', { reset, loading, hasMore, npub });
    
//     if (loading || (!hasMore && !reset) || !isMounted.current) {
//       console.log('Skipping fetch due to:', { loading, hasMore, isMounted: isMounted.current });
//       return;
//     }
    
//     if (!npub) {
//       console.log('No public key available yet');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const queryParams = new URLSearchParams({
//         pageSize: options.pageSize?.toString() || '20',
//         ...(options.mediaType && { type: options.mediaType }),
//         npub: npub,
//         ...(options.app && { app: options.app }),
//         ...(nextCursor && !reset && { cursor: nextCursor }),
//       });

//       const url = `${config.baseURL}/api/media?${queryParams}`;
//       console.log('Making fetch request to:', url);
//       console.log('With headers:', {
//         'Authorization': `Bearer ${token?.substring(0, 10)}...`,
//         'Content-Type': 'application/json',
//       });

//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Response status:', response.status);

//       if (!isMounted.current) {
//         console.log('Component unmounted during fetch');
//         return;
//       }

//       if (response.status === 401) {
//         console.log('Unauthorized, logging out');
//         handleLogout();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch media: ${response.statusText}`);
//       }

//       const data: MediaResponse = await response.json();
//       console.log('Received data:', { 
//         itemCount: data.items.length, 
//         hasMore: !!data.nextCursor 
//       });
      
//       if (isMounted.current) {
//         setMediaItems(prev => reset ? data.items : [...prev, ...data.items]);
//         setNextCursor(data.nextCursor);
//         setHasMore(!!data.nextCursor);
//       }
//     } catch (err) {
//       if (isMounted.current) {
//         console.error('Error fetching media:', err);
//         setError(err instanceof Error ? err.message : 'An error occurred while fetching media');
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [options, nextCursor, loading, hasMore, token, handleLogout, npub]);

//   // Initial fetch when npub is available - only once
//   useEffect(() => {
//     console.log('npub effect triggered:', { npub, hasInitialized: hasInitialized.current });
    
//     if (npub && !hasInitialized.current) {
//       console.log('Initializing first fetch');
//       hasInitialized.current = true;
//       fetchMedia(true);
//     }
//   }, [npub, fetchMedia]);

//   return {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     npub,
//     fetchMore: () => fetchMedia(false),
//   };
// };

// export default useMedia;


// import { useState, useEffect, useCallback, useRef } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { NostrProvider } from '@app/types/nostr';

// interface MediaItemResponse {
//   hash: string;
//   name: string;
//   type: string;
//   contentHash?: string;
//   metadata?: {
//     size?: string;
//     timestamp?: string;
//     [key: string]: string | undefined;
//   };
// }

// interface MediaResponse {
//   items: MediaItemResponse[];
//   totalCount: number;
//   nextCursor?: string;
// }

// interface UseMediaOptions {
//   pageSize?: number;
//   mediaType?: string;
//   app?: string;
// }

// const useMedia = (options: UseMediaOptions = {}) => {
//   const [mediaItems, setMediaItems] = useState<MediaItemResponse[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
//   const [npub, setNpub] = useState<string | null>(null);
  
//   const isMounted = useRef(true);
//   const hasInitialized = useRef(false);

//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // Fetch public key from Nostr - only once
//   useEffect(() => {
//     const fetchPublicKey = async () => {
//       try {
//         const nostrProvider = window.nostr;
//         if (nostrProvider) {
//           const pubkey = await nostrProvider.getPublicKey();
//           if (isMounted.current) {
//             console.log('Got Nostr public key:', pubkey);
//             // setNpub(pubkey);
//             setNpub("6aabfbd9b8d51d1133807b064d19a6de230e8b28a402154354c08ababce80d74")
//           }
//         }
//       } catch (error) {
//         console.error('Failed to get Nostr public key:', error);
//       }
//     };

//     let intervalId: NodeJS.Timeout | null = null;

//     if (!npub && !hasInitialized.current) {
//       intervalId = setInterval(() => {
//         if (window.nostr) {
//           fetchPublicKey();
//           if (intervalId) clearInterval(intervalId);
//         }
//       }, 1000);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, []);

//   const fetchMedia = useCallback(async (reset: boolean = false) => {
//     if (loading || (!hasMore && !reset) || !isMounted.current) return;
//     if (!npub) {
//       console.log('No public key available yet');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const queryParams = new URLSearchParams({
//         pageSize: options.pageSize?.toString() || '20',
//         ...(options.mediaType && { type: options.mediaType }),
//         npub: npub,
//         ...(options.app && { app: options.app }),
//         ...(nextCursor && !reset && { cursor: nextCursor }),
//       });

//       const url = `${config.baseURL}/api/media?${queryParams}`;
//       console.log('Fetching media:', url);

//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!isMounted.current) return;

//       if (response.status === 401) {
//         handleLogout();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch media: ${response.statusText}`);
//       }

//       const data: MediaResponse = await response.json();
      
//       if (isMounted.current) {
//         setMediaItems(prev => reset ? data.items : [...prev, ...data.items]);
//         setNextCursor(data.nextCursor);
//         setHasMore(!!data.nextCursor);
//       }
//     } catch (err) {
//       if (isMounted.current) {
//         console.error('Error fetching media:', err);
//         setError(err instanceof Error ? err.message : 'An error occurred while fetching media');
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [options, nextCursor, loading, hasMore, token, handleLogout, npub]);

//   // Initial fetch when npub is available - only once
//   useEffect(() => {
//     if (npub && !hasInitialized.current) {
//       hasInitialized.current = true;
//       fetchMedia(true);
//     }
//   }, [npub, fetchMedia]);

//   return {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     npub,
//     fetchMore: () => fetchMedia(false),
//   };
// };

// export default useMedia;

// import { useState, useEffect, useCallback } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';

// interface MediaItemResponse {
//   hash: string;
//   name: string;
//   type: string;
//   contentHash?: string;
//   metadata?: {
//     size?: string;
//     timestamp?: string;
//     [key: string]: string | undefined;
//   };
// }

// interface MediaResponse {
//   items: MediaItemResponse[];
//   totalCount: number;
//   nextCursor?: string;
// }

// interface UseMediaOptions {
//   pageSize?: number;
//   mediaType?: string;
//   npub?: string;
//   app?: string;
// }

// const useMedia = (options: UseMediaOptions = {}) => {
//   const [mediaItems, setMediaItems] = useState<MediaItemResponse[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

//   const handleLogout = useHandleLogout();
//   const token = readToken();
  

//   const fetchMedia = useCallback(async (reset: boolean = false) => {
//     if (loading || (!hasMore && !reset)) {
//       console.log('Skipping fetch:', { loading, hasMore, reset });
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const queryParams = new URLSearchParams({
//         pageSize: options.pageSize?.toString() || '20',
//         ...(options.mediaType && { type: options.mediaType }),
//         ...(options.npub && { npub: options.npub }),
//         ...(options.app && { app: options.app }),
//         ...(nextCursor && !reset && { cursor: nextCursor }),
//       });

//       const url = `${config.baseURL}/api/media?${queryParams}`;
//       console.log('Fetching media from:', url);
//       console.log('With token:', token?.substring(0, 10) + '...');

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Response status:', response.status);

//       if (response.status === 401) {
//         console.log('Unauthorized, logging out');
//         handleLogout();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch media: ${response.statusText}`);
//       }

//       const data: MediaResponse = await response.json();
//       console.log('Received data:', { itemsCount: data.items.length, hasMore: !!data.nextCursor });

//       setMediaItems(prev => reset ? data.items : [...prev, ...data.items]);
//       setNextCursor(data.nextCursor);
//       setHasMore(!!data.nextCursor);
//     } catch (err) {
//       console.error('Error fetching media:', err);
//       setError(err instanceof Error ? err.message : 'An error occurred while fetching media');
//     } finally {
//       setLoading(false);
//     }
//   }, [options, nextCursor, loading, hasMore, token, handleLogout]);

//   // Debug effect dependencies
//   useEffect(() => {
//     console.log('Media options changed:', options);
//   }, [options.mediaType, options.npub, options.app, options.pageSize]);

//   useEffect(() => {
//     console.log('Initializing media fetch');
//     setMediaItems([]);
//     setNextCursor(undefined);
//     setHasMore(true);
//     fetchMedia(true);
//   }, [options.mediaType, options.npub, options.app, options.pageSize]);

//   return {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     fetchMore: () => fetchMedia(false),
//   };
// };

// export default useMedia;


// import { useState, useEffect, useCallback } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { ConsoleSqlOutlined } from '@ant-design/icons';

// interface MediaItemResponse {
//   hash: string;
//   name: string;
//   type: string;
//   contentHash?: string;
//   metadata?: {
//     size?: string;
//     timestamp?: string;
//     [key: string]: string | undefined;
//   };
// }

// interface MediaResponse {
//   items: MediaItemResponse[];
//   totalCount: number;
//   nextCursor?: string;
// }

// interface UseMediaOptions {
//   pageSize?: number;
//   mediaType?: string;
//   npub?: string;
//   app?: string;
// }

// const useMedia = (options: UseMediaOptions = {}) => {
//   const [mediaItems, setMediaItems] = useState<MediaItemResponse[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const fetchMedia = useCallback(async (reset: boolean = false) => {
//     if (loading || (!hasMore && !reset)) return;
//     console.log("Fetching media.")
//     try {
//       setLoading(true);
//       setError(null);

//       const queryParams = new URLSearchParams({
//         pageSize: options.pageSize?.toString() || '20',
//         ...(options.mediaType && { type: options.mediaType }),
//         ...(options.npub && { npub: options.npub }),
//         ...(options.app && { app: options.app }),
//         ...(nextCursor && !reset && { cursor: nextCursor }),
//       });

//       const response = await fetch(`${config.baseURL}/api/media?${queryParams}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         handleLogout();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Failed to fetch media: ${response.statusText}`);
//       }

//       const data: MediaResponse = await response.json();

//       setMediaItems(prev => reset ? data.items : [...prev, ...data.items]);
//       setNextCursor(data.nextCursor);
//       setHasMore(!!data.nextCursor);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred while fetching media');
//     } finally {
//       setLoading(false);
//     }
//   }, [options, nextCursor, loading, hasMore, token, handleLogout]);

//   useEffect(() => {
//     setMediaItems([]);
//     setNextCursor(undefined);
//     setHasMore(true);
//     fetchMedia(true);
//   }, [options.mediaType, options.npub, options.app, options.pageSize]);

//   return {
//     mediaItems,
//     loading,
//     error,
//     hasMore,
//     fetchMore: () => fetchMedia(false),
//   };
// };

// export default useMedia;