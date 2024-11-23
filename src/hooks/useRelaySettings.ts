import { useState, useEffect, useCallback } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { useHandleLogout } from './authUtils';
import { Settings, noteOptions, mimeTypeOptions, SubscriptionTier } from '@app/constants/relaySettings';

interface BackendSubscriptionTier {
  DataLimit: string;
  Price: string;
}

interface BackendRelaySettings {
  mode: string;
  protocol: CheckboxValueType[];
  chunked: CheckboxValueType[];
  chunksize: string;
  maxFileSize: number;
  maxFileSizeUnit: string;
  subscription_tiers: BackendSubscriptionTier[];
  MimeTypeGroups: {
    images: string[];
    videos: string[];
    audio: string[];
    documents: string[];
  };
  MimeTypeWhitelist: string[];
  KindWhitelist: string[];
}

const defaultTiers: SubscriptionTier[] = [
  { data_limit: '1 GB per month', price: '8000' },
  { data_limit: '5 GB per month', price: '10000' },
  { data_limit: '10 GB per month', price: '15000' }
];

const getInitialSettings = (): Settings => ({
  mode: 'smart',
  protocol: ['WebSocket'],
  kinds: [],
  dynamicKinds: [],
  photos: [],
  videos: [],
  gitNestr: [],
  audio: [],
  appBuckets: [],
  dynamicAppBuckets: [],
  isKindsActive: true,
  isPhotosActive: true,
  isVideosActive: true,
  isGitNestrActive: true,
  isAudioActive: true,
  isFileStorageActive: false,
  subscription_tiers: defaultTiers
});

const useRelaySettings = () => {
  const [relaySettings, setRelaySettings] = useState<Settings>(getInitialSettings());
  // Add state to store previous smart mode settings
  const [previousSmartSettings, setPreviousSmartSettings] = useState<{
    kinds: string[];
    photos: string[];
    videos: string[];
    audio: string[];
  } | null>(null);
  
  const handleLogout = useHandleLogout();
  const token = readToken();

  // Effect to handle mode changes
  useEffect(() => {
    if (relaySettings.mode === 'unlimited') {
      // Store current settings before clearing
      setPreviousSmartSettings({
        kinds: relaySettings.kinds,
        photos: relaySettings.photos,
        videos: relaySettings.videos,
        audio: relaySettings.audio,
      });
      
      setRelaySettings(prev => ({
        ...prev,
        kinds: [],
        photos: [],
        videos: [],
        audio: [],
      }));
    } else if (relaySettings.mode === 'smart' && previousSmartSettings) {
      // Restore previous smart mode settings
      setRelaySettings(prev => ({
        ...prev,
        kinds: previousSmartSettings.kinds,
        photos: previousSmartSettings.photos,
        videos: previousSmartSettings.videos,
        audio: previousSmartSettings.audio,
      }));
    }
  }, [relaySettings.mode]);

  const transformToBackendSettings = (settings: Settings): BackendRelaySettings => {
    const mimeGroups = {
      images: settings.photos,
      videos: settings.videos,
      audio: settings.audio,
      documents: [] as string[]
    };

    const selectedMimeTypes = [
      ...mimeGroups.images,
      ...mimeGroups.videos,
      ...mimeGroups.audio
    ];

    return {
      mode: settings.mode,
      protocol: settings.protocol as CheckboxValueType[],
      chunked: [],
      chunksize: '2',
      maxFileSize: 10,
      maxFileSizeUnit: 'MB',
      subscription_tiers: settings.subscription_tiers.map(tier => ({
        DataLimit: tier.data_limit,
        Price: tier.price
      })),
      MimeTypeGroups: mimeGroups,
      MimeTypeWhitelist: settings.mode === 'smart'
        ? selectedMimeTypes
        : mimeTypeOptions
            .map(m => m.value)
            .filter(mimeType => !selectedMimeTypes.includes(mimeType)),
      KindWhitelist: settings.mode === 'smart'
        ? settings.kinds
        : noteOptions
            .map(note => note.kindString)
            .filter(kind => !settings.kinds.includes(kind))
    };
  };

  const transformFromBackendSettings = (backendSettings: BackendRelaySettings): Settings => {
    const settings = getInitialSettings();
    settings.mode = backendSettings.mode;
    settings.protocol = backendSettings.protocol as string[];
    
    // Handle subscription tiers
    settings.subscription_tiers = backendSettings.subscription_tiers.map(tier => ({
      data_limit: tier.DataLimit || defaultTiers[0].data_limit,
      price: tier.Price || defaultTiers[0].price
    }));

    if (!settings.subscription_tiers.length || 
        settings.subscription_tiers.every(tier => !tier.data_limit)) {
      settings.subscription_tiers = defaultTiers;
    }

    if (backendSettings.mode === 'unlimited') {
      // In unlimited mode, start with empty selections
      settings.photos = [];
      settings.videos = [];
      settings.audio = [];
      settings.kinds = [];
    } else {
      // In smart mode, use the MimeTypeGroups directly
      settings.photos = backendSettings.MimeTypeGroups?.images || [];
      settings.videos = backendSettings.MimeTypeGroups?.videos || [];
      settings.audio = backendSettings.MimeTypeGroups?.audio || [];
      settings.kinds = backendSettings.KindWhitelist || [];
      
      // Store these as the previous smart settings
      setPreviousSmartSettings({
        kinds: settings.kinds,
        photos: settings.photos,
        videos: settings.videos,
        audio: settings.audio,
      });
    }

    // Set active states
    settings.isKindsActive = true;
    settings.isPhotosActive = true;
    settings.isVideosActive = true;
    settings.isAudioActive = true;
    
    return settings;
  };


  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/relay-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const settings = transformFromBackendSettings(data.relay_settings);
      setRelaySettings(settings);
      
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, [token, handleLogout]);

  const saveSettings = useCallback(async () => {
    try {
      const backendSettings = transformToBackendSettings(relaySettings);
      const response = await fetch(`${config.baseURL}/api/relay-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ relay_settings: backendSettings }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Update previous smart settings after successful save
      if (relaySettings.mode === 'smart') {
        setPreviousSmartSettings({
          kinds: relaySettings.kinds,
          photos: relaySettings.photos,
          videos: relaySettings.videos,
          audio: relaySettings.audio,
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }, [relaySettings, token]);

  const updateSettings = useCallback((category: keyof Settings, value: any) => {
    setRelaySettings(prev => ({
      ...prev,
      [category]: value
    }));
  }, []);

  return { relaySettings, fetchSettings, updateSettings, saveSettings };
};

export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import { CheckboxValueType } from 'antd/es/checkbox/Group';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { Settings, noteOptions, mimeTypeOptions, SubscriptionTier } from '@app/constants/relaySettings';

// interface BackendSubscriptionTier {
//   DataLimit: string;
//   Price: string;
// }

// interface BackendRelaySettings {
//   mode: string;
//   protocol: CheckboxValueType[];
//   chunked: CheckboxValueType[];
//   chunksize: string;
//   maxFileSize: number;
//   maxFileSizeUnit: string;
//   subscription_tiers: BackendSubscriptionTier[];
//   MimeTypeGroups: {
//     images: string[];
//     videos: string[];
//     audio: string[];
//     documents: string[];
//   };
//   MimeTypeWhitelist: string[];
//   KindWhitelist: string[];
// }

// const defaultTiers: SubscriptionTier[] = [
//   { data_limit: '1 GB per month', price: '8000' },
//   { data_limit: '5 GB per month', price: '10000' },
//   { data_limit: '10 GB per month', price: '15000' }
// ];

// const getInitialSettings = (): Settings => ({
//   mode: 'smart',
//   protocol: ['WebSocket'],
//   kinds: [],
//   dynamicKinds: [],
//   photos: [],
//   videos: [],
//   gitNestr: [],
//   audio: [],
//   appBuckets: [],
//   dynamicAppBuckets: [],
//   isKindsActive: true,
//   isPhotosActive: true,
//   isVideosActive: true,
//   isGitNestrActive: true,
//   isAudioActive: true,
//   isFileStorageActive: false,
//   subscription_tiers: defaultTiers
// });

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<Settings>(getInitialSettings());
//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const transformToBackendSettings = (settings: Settings): BackendRelaySettings => {
//     const mimeGroups = {
//       images: [] as string[],
//       videos: [] as string[],
//       audio: [] as string[],
//       documents: [] as string[]
//     };

//     settings.photos.forEach(ext => {
//       const mime = mimeTypeOptions.find(m => m.value.includes(ext));
//       if (mime) mimeGroups.images.push(mime.value);
//     });

//     settings.videos.forEach(ext => {
//       const mime = mimeTypeOptions.find(m => m.value.includes(ext));
//       if (mime) mimeGroups.videos.push(mime.value);
//     });

//     settings.audio.forEach(ext => {
//       const mime = mimeTypeOptions.find(m => m.value.includes(ext));
//       if (mime) mimeGroups.audio.push(mime.value);
//     });

//     const selectedMimeTypes = [...mimeGroups.images, ...mimeGroups.videos, ...mimeGroups.audio];
    
//     // For unlimited mode, whitelist should be all mime types EXCEPT the selected ones
//     const mimeTypeWhitelist = settings.mode === 'smart' 
//       ? selectedMimeTypes 
//       : mimeTypeOptions
//           .map(m => m.value)
//           .filter(mimeType => !selectedMimeTypes.includes(mimeType));

//     return {
//       mode: settings.mode,
//       protocol: settings.protocol as CheckboxValueType[],
//       chunked: [],
//       chunksize: '2',
//       maxFileSize: 10,
//       maxFileSizeUnit: 'MB',
//       subscription_tiers: settings.subscription_tiers.map(tier => ({
//         DataLimit: tier.data_limit,
//         Price: tier.price
//       })),
//       MimeTypeGroups: mimeGroups,
//       MimeTypeWhitelist: mimeTypeWhitelist,
//       KindWhitelist: settings.mode === 'smart' 
//         ? settings.kinds 
//         : noteOptions
//             .map(note => note.kindString)
//             .filter(kind => !settings.kinds.includes(kind))
//     };
//   };

//   const transformFromBackendSettings = (backendSettings: BackendRelaySettings): Settings => {
//     const settings = getInitialSettings();

//     settings.mode = backendSettings.mode;
//     settings.protocol = backendSettings.protocol as string[];
    
//     // Transform subscription tiers
//     settings.subscription_tiers = backendSettings.subscription_tiers.map(tier => ({
//       data_limit: tier.DataLimit || defaultTiers[0].data_limit,
//       price: tier.Price || defaultTiers[0].price
//     }));

//     // If no subscription tiers or empty data limits, use defaults
//     if (!settings.subscription_tiers.length || 
//         settings.subscription_tiers.every(tier => !tier.data_limit)) {
//       settings.subscription_tiers = defaultTiers;
//     }

//     // Transform MIME types to file extensions
//     settings.photos = (backendSettings.MimeTypeGroups?.images || [])
//       .map(mime => mime.split('/')[1])
//       .filter(Boolean);

//     settings.videos = (backendSettings.MimeTypeGroups?.videos || [])
//       .map(mime => mime.split('/')[1])
//       .filter(Boolean);

//     settings.audio = (backendSettings.MimeTypeGroups?.audio || [])
//       .map(mime => mime.split('/')[1])
//       .filter(Boolean);

//     // For unlimited mode, kinds should be those NOT in the whitelist
//     settings.kinds = backendSettings.mode === 'smart'
//       ? backendSettings.KindWhitelist || []
//       : noteOptions
//           .map(note => note.kindString)
//           .filter(kind => !backendSettings.KindWhitelist.includes(kind));

//     // Set active states
//     settings.isKindsActive = true;
//     settings.isPhotosActive = true;
//     settings.isVideosActive = true;
//     settings.isAudioActive = true;

//     return settings;
//   };

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         handleLogout();
//         return;
//       }

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const data = await response.json();
//       const settings = transformFromBackendSettings(data.relay_settings);
//       setRelaySettings(settings);
      
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, [token, handleLogout]);

//   const saveSettings = useCallback(async () => {
//     try {
//       const backendSettings = transformToBackendSettings(relaySettings);
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: backendSettings }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       throw error;
//     }
//   }, [relaySettings, token]);

//   const updateSettings = useCallback((category: keyof Settings, value: any) => {
//     setRelaySettings(prev => ({
//       ...prev,
//       [category]: value
//     }));
//   }, []);

//   return { relaySettings, fetchSettings, updateSettings, saveSettings };
// };

// export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import { CheckboxValueType } from 'antd/es/checkbox/Group';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { Settings, noteOptions, mimeTypeOptions, SubscriptionTier } from '@app/constants/relaySettings';

// interface BackendSubscriptionTier {
//   DataLimit: string;
//   Price: string;
// }

// interface BackendRelaySettings {
//   mode: string;
//   protocol: CheckboxValueType[];
//   chunked: CheckboxValueType[];
//   chunksize: string;
//   maxFileSize: number;
//   maxFileSizeUnit: string;
//   subscription_tiers: BackendSubscriptionTier[];
//   MimeTypeGroups: {
//     images: string[];
//     videos: string[];
//     audio: string[];
//     documents: string[];
//   };
//   MimeTypeWhitelist: string[];
//   KindWhitelist: string[];
// }

// const defaultTiers: SubscriptionTier[] = [
//   { data_limit: '1 GB per month', price: '8000' },
//   { data_limit: '5 GB per month', price: '10000' },
//   { data_limit: '10 GB per month', price: '15000' }
// ];

// const getInitialSettings = (): Settings => ({
//   mode: 'smart',
//   protocol: ['WebSocket'],
//   kinds: [],
//   dynamicKinds: [],
//   photos: [],
//   videos: [],
//   gitNestr: [],
//   audio: [],
//   appBuckets: [],
//   dynamicAppBuckets: [],
//   isKindsActive: true,
//   isPhotosActive: true,
//   isVideosActive: true,
//   isGitNestrActive: true,
//   isAudioActive: true,
//   isFileStorageActive: false,
//   subscription_tiers: defaultTiers
// });

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<Settings>(getInitialSettings());
//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const transformToBackendSettings = (settings: Settings): BackendRelaySettings => {
//     const mimeGroups = {
//       images: [] as string[],
//       videos: [] as string[],
//       audio: [] as string[],
//       documents: [] as string[]
//     };

//     settings.photos.forEach(ext => {
//       const mime = mimeTypeOptions.find(m => m.value.includes(ext));
//       if (mime) mimeGroups.images.push(mime.value);
//     });

//     settings.videos.forEach(ext => {
//       const mime = mimeTypeOptions.find(m => m.value.includes(ext));
//       if (mime) mimeGroups.videos.push(mime.value);
//     });

//     settings.audio.forEach(ext => {
//       const mime = mimeTypeOptions.find(m => m.value.includes(ext));
//       if (mime) mimeGroups.audio.push(mime.value);
//     });

//     const allMimeTypes = [...mimeGroups.images, ...mimeGroups.videos, ...mimeGroups.audio];

//     return {
//       mode: settings.mode,
//       protocol: settings.protocol as CheckboxValueType[],
//       chunked: [],
//       chunksize: '2',
//       maxFileSize: 10,
//       maxFileSizeUnit: 'MB',
//       subscription_tiers: settings.subscription_tiers.map(tier => ({
//         DataLimit: tier.data_limit,
//         Price: tier.price
//       })),
//       MimeTypeGroups: mimeGroups,
//       MimeTypeWhitelist: settings.mode === 'smart' ? allMimeTypes : mimeTypeOptions.map(m => m.value),
//       KindWhitelist: settings.mode === 'smart' ? settings.kinds : noteOptions.map(note => note.kindString)
//     };
//   };

//   const transformFromBackendSettings = (backendSettings: BackendRelaySettings): Settings => {
//     const settings = getInitialSettings();

//     settings.mode = backendSettings.mode;
//     settings.protocol = backendSettings.protocol as string[];
    
//     // Transform subscription tiers
//     settings.subscription_tiers = backendSettings.subscription_tiers.map(tier => ({
//       data_limit: tier.DataLimit || defaultTiers[0].data_limit,
//       price: tier.Price || defaultTiers[0].price
//     }));

//     // If no subscription tiers or empty data limits, use defaults
//     if (!settings.subscription_tiers.length || 
//         settings.subscription_tiers.every(tier => !tier.data_limit)) {
//       settings.subscription_tiers = defaultTiers;
//     }

//     settings.photos = (backendSettings.MimeTypeGroups?.images || [])
//       .map(mime => mime.split('/')[1])
//       .filter(Boolean);

//     settings.videos = (backendSettings.MimeTypeGroups?.videos || [])
//       .map(mime => mime.split('/')[1])
//       .filter(Boolean);

//     settings.audio = (backendSettings.MimeTypeGroups?.audio || [])
//       .map(mime => mime.split('/')[1])
//       .filter(Boolean);

//     settings.kinds = backendSettings.KindWhitelist || [];

//     settings.isKindsActive = backendSettings.KindWhitelist?.length > 0;
//     settings.isPhotosActive = settings.photos.length > 0;
//     settings.isVideosActive = settings.videos.length > 0;
//     settings.isAudioActive = settings.audio.length > 0;

//     return settings;
//   };

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         handleLogout();
//         return;
//       }

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const data = await response.json();
//       const settings = transformFromBackendSettings(data.relay_settings);
//       setRelaySettings(settings);
      
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, [token, handleLogout]);

//   const saveSettings = useCallback(async () => {
//     try {
//       const backendSettings = transformToBackendSettings(relaySettings);
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: backendSettings }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       throw error;
//     }
//   }, [relaySettings, token]);

//   const updateSettings = useCallback((category: keyof Settings, value: any) => {
//     setRelaySettings(prev => ({
//       ...prev,
//       [category]: value
//     }));
//   }, []);

//   return { relaySettings, fetchSettings, updateSettings, saveSettings };
// };

// export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import { CheckboxValueType } from 'antd/es/checkbox/Group';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';

// interface SubscriptionTier {
//   data_limit: string;
//   price: string;
// }

// interface RelaySettings {
//   mode: string;
//   protocol: CheckboxValueType[];
//   chunked: CheckboxValueType[];
//   chunksize: string;
//   maxFileSize: number;
//   maxFileSizeUnit: string;
//   mimeTypeGroups: {
//     images: CheckboxValueType[];
//     videos: CheckboxValueType[];
//     audio: CheckboxValueType[];
//     documents: CheckboxValueType[];
//   };
//   mimeTypeWhitelist: CheckboxValueType[];
//   kindWhitelist: CheckboxValueType[];
//   subscription_tiers: SubscriptionTier[];
// }

// const getInitialSettings = (): RelaySettings => {
//   const savedSettings = localStorage.getItem('relaySettings');
//   return savedSettings
//     ? JSON.parse(savedSettings)
//     : {
//         mode: 'smart',
//         protocol: ['WebSocket'],
//         chunked: [],
//         chunksize: '2',
//         maxFileSize: 10,
//         maxFileSizeUnit: 'MB',
//         mimeTypeGroups: {
//           images: [],
//           videos: [],
//           audio: [],
//           documents: []
//         },
//         mimeTypeWhitelist: [],
//         kindWhitelist: [],
//         subscription_tiers: []
//       };
// };

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<RelaySettings>(getInitialSettings());
//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
      
//       if (response.status === 401) {
//         handleLogout();
//         throw new Error('Unauthorized: Invalid or expired token');
//       }

//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }

//       const data = await response.json();
//       const backendSettings = data.relay_settings;

//       const formattedSettings: RelaySettings = {
//         ...backendSettings,
//         protocol: Array.isArray(backendSettings.protocol) ? backendSettings.protocol : [backendSettings.protocol],
//         chunked: Array.isArray(backendSettings.chunked) ? backendSettings.chunked : [],
//         mimeTypeGroups: {
//           images: backendSettings.mimeTypeGroups?.images || [],
//           videos: backendSettings.mimeTypeGroups?.videos || [],
//           audio: backendSettings.mimeTypeGroups?.audio || [],
//           documents: backendSettings.mimeTypeGroups?.documents || []
//         },
//         mimeTypeWhitelist: backendSettings.mimeTypeWhitelist || [],
//         kindWhitelist: backendSettings.kindWhitelist || [],
//         subscription_tiers: backendSettings.subscription_tiers || []
//       };

//       setRelaySettings(formattedSettings);
//       localStorage.setItem('relaySettings', JSON.stringify(formattedSettings));
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, [handleLogout, token]);

//   const updateSettings = useCallback((category: keyof RelaySettings | keyof RelaySettings['mimeTypeGroups'], value: any) => {
//     setRelaySettings((prevSettings) => {
//       if (category in prevSettings.mimeTypeGroups) {
//         return {
//           ...prevSettings,
//           mimeTypeGroups: {
//             ...prevSettings.mimeTypeGroups,
//             [category]: value
//           }
//         };
//       }
//       return {
//         ...prevSettings,
//         [category]: value
//       };
//     });
//   }, []);

//   const saveSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: relaySettings }),
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }

//       localStorage.setItem('relaySettings', JSON.stringify(relaySettings));
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       throw error;
//     }
//   }, [relaySettings, token]);

//   return { relaySettings, fetchSettings, updateSettings, saveSettings };
// };

// export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { CheckboxValueType } from 'antd/lib/checkbox/Group';

// interface SubscriptionTier {
//   data_limit: string;
//   price: string;
// }

// export interface RelaySettings {
//   mode: string;
//   protocol: CheckboxValueType[];
//   chunked: CheckboxValueType[];
//   chunksize: string;
//   maxFileSize: number;
//   maxFileSizeUnit: string;
//   mimeTypeGroups: {
//     images: CheckboxValueType[];
//     videos: CheckboxValueType[];
//     audio: CheckboxValueType[];
//     documents: CheckboxValueType[];
//   };
//   mimeTypeWhitelist: CheckboxValueType[];
//   kindWhitelist: CheckboxValueType[];
//   subscription_tiers: SubscriptionTier[];
// }

// const defaultSettings: RelaySettings = {
//   mode: 'smart',
//   protocol: ['WebSocket'],
//   chunked: [],
//   chunksize: '2',
//   maxFileSize: 100,
//   maxFileSizeUnit: 'MB',
//   mimeTypeGroups: {
//     images: [],
//     videos: [],
//     audio: [],
//     documents: []
//   },
//   mimeTypeWhitelist: [],
//   kindWhitelist: [],
//   subscription_tiers: []
// };

// // Helper function to normalize subscription tier data
// const normalizeSubscriptionTiers = (tiers: any[]): SubscriptionTier[] => {
//   return tiers.map(tier => ({
//     data_limit: tier.DataLimit || tier.data_limit || '',
//     price: tier.Price || tier.price || ''
//   }));
// };

// // Helper function to categorize MIME types
// const categorizeMimeTypes = (mimeTypes: string[]) => {
//   return {
//     images: mimeTypes.filter(type => type.startsWith('image/') || ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'eps', 'svg', 'raw', 'psd', 'ai', 'pdf'].includes(type)),
//     videos: mimeTypes.filter(type => type.startsWith('video/') || ['avi', 'mp4', 'mov', 'wmv', 'mkv', 'flv', 'mpeg', '3gp', 'webm', 'ogg'].includes(type)),
//     audio: mimeTypes.filter(type => type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a', 'opus', 'm4b', 'midi'].includes(type)),
//     documents: mimeTypes.filter(type => type.startsWith('application/') || type.startsWith('text/'))
//   };
// };

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<RelaySettings>(() => {
//     try {
//       const savedSettings = localStorage.getItem('relaySettings');
//       if (!savedSettings) return defaultSettings;
      
//       const parsedSettings = JSON.parse(savedSettings);
//       // Ensure subscription tiers are properly formatted
//       if (parsedSettings.subscription_tiers) {
//         parsedSettings.subscription_tiers = normalizeSubscriptionTiers(parsedSettings.subscription_tiers);
//       }
      
//       return {
//         ...defaultSettings,
//         ...parsedSettings
//       };
//     } catch (error) {
//       console.error('Error reading settings from localStorage:', error);
//       localStorage.removeItem('relaySettings');
//       return defaultSettings;
//     }
//   });

//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         console.error('Unauthorized: Invalid or expired token');
//         handleLogout();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         console.warn('Response is not JSON, using default settings');
//         return;
//       }

//       const data = await response.json();
//       const backendSettings = data.relay_settings;
      
//       console.log("Received settings from backend:", backendSettings);

//       // Transform backend settings to match frontend structure
//       const transformedSettings: RelaySettings = {
//         mode: backendSettings.mode || defaultSettings.mode,
//         protocol: Array.isArray(backendSettings.protocol) 
//           ? backendSettings.protocol 
//           : [backendSettings.protocol],
//         chunked: Array.isArray(backendSettings.chunked)
//           ? backendSettings.chunked
//           : defaultSettings.chunked,
//         chunksize: backendSettings.chunksize || defaultSettings.chunksize,
//         maxFileSize: Number(backendSettings.maxFileSize) || defaultSettings.maxFileSize,
//         maxFileSizeUnit: backendSettings.maxFileSizeUnit || defaultSettings.maxFileSizeUnit,
//         mimeTypeGroups: categorizeMimeTypes(backendSettings.mimeTypeWhitelist || []),
//         mimeTypeWhitelist: backendSettings.mimeTypeWhitelist || [],
//         kindWhitelist: Array.isArray(backendSettings.kindWhitelist)
//           ? backendSettings.kindWhitelist
//           : defaultSettings.kindWhitelist,
//         subscription_tiers: normalizeSubscriptionTiers(backendSettings.subscription_tiers || [])
//       };

//       console.log("Transformed settings:", transformedSettings);

//       setRelaySettings(transformedSettings);
//       localStorage.setItem('relaySettings', JSON.stringify(transformedSettings));

//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, [token, handleLogout]);

//   const updateSettings = useCallback((key: keyof RelaySettings, value: any) => {
//     setRelaySettings(prev => {
//       const newSettings = {
//         ...prev,
//         [key]: value
//       };
//       localStorage.setItem('relaySettings', JSON.stringify(newSettings));
//       return newSettings;
//     });
//   }, []);

//   const updateMimeTypeGroup = useCallback((groupName: string, types: CheckboxValueType[]) => {
//     setRelaySettings(prev => {
//       const newSettings = {
//         ...prev,
//         mimeTypeGroups: {
//           ...prev.mimeTypeGroups,
//           [groupName]: types
//         }
//       };
//       localStorage.setItem('relaySettings', JSON.stringify(newSettings));
//       return newSettings;
//     });
//   }, []);

//   const saveSettings = useCallback(async () => {
//     try {
//       // Prepare settings for backend
//       const allMimeTypes = [
//         ...relaySettings.mimeTypeGroups.images,
//         ...relaySettings.mimeTypeGroups.videos,
//         ...relaySettings.mimeTypeGroups.audio,
//         ...relaySettings.mimeTypeGroups.documents
//       ];
  
//       // Ensure subscription tiers have proper format
//       const formattedTiers = relaySettings.subscription_tiers.map(tier => ({
//         data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
//         price: tier.price.toString() // Ensure price is a string
//       }));
  
//       const settingsForBackend = {
//         ...relaySettings,
//         mimeTypeWhitelist: allMimeTypes,
//         subscription_tiers: formattedTiers,
//         kindWhitelist: Array.isArray(relaySettings.kindWhitelist) ? relaySettings.kindWhitelist : []
//       };
  
//       console.log("Saving settings to backend:", settingsForBackend);
  
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: settingsForBackend }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }
  
//       // Check if response is JSON before trying to parse it
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const savedData = await response.json();
//         console.log('Settings saved successfully:', savedData);
//       } else {
//         // Handle non-JSON response (e.g., "OK")
//         const text = await response.text();
//         console.log('Settings saved successfully:', text);
//       }
      
//       // Refresh settings from server to ensure consistency
//       await fetchSettings();
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       throw error;
//     }
//   }, [relaySettings, token, fetchSettings]);

//   // Fetch settings on mount
//   useEffect(() => {
//     fetchSettings();
//   }, [fetchSettings]);

//   return { 
//     relaySettings, 
//     fetchSettings, 
//     updateSettings, 
//     updateMimeTypeGroup,
//     saveSettings 
//   };
// };

// export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';
// import { CheckboxValueType } from 'antd/lib/checkbox/Group';

// interface SubscriptionTier {
//   data_limit: string;
//   price: string;
// }

// export interface RelaySettings {
//   mode: string;
//   protocol: CheckboxValueType[];
//   chunked: CheckboxValueType[];
//   chunksize: string;
//   maxFileSize: number;
//   maxFileSizeUnit: string;
//   mimeTypeGroups: Record<string, CheckboxValueType[]>;
//   mimeTypeWhitelist: CheckboxValueType[];
//   kindWhitelist: CheckboxValueType[];
//   subscription_tiers: SubscriptionTier[];
// }

// const defaultSettings: RelaySettings = {
//   mode: 'smart',
//   protocol: ['WebSocket'],
//   chunked: [],
//   chunksize: '2',
//   maxFileSize: 100,
//   maxFileSizeUnit: 'MB',
//   mimeTypeGroups: {
//     images: [],
//     videos: [],
//     audio: [],
//     documents: []
//   },
//   mimeTypeWhitelist: [],
//   kindWhitelist: [],
//   subscription_tiers: []
// };

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<RelaySettings>(() => {
//     try {
//       const savedSettings = localStorage.getItem('relaySettings');
//       if (!savedSettings) return defaultSettings;
      
//       const parsedSettings = JSON.parse(savedSettings);
//       // Validate parsed settings has required properties
//       if (!parsedSettings.mode || !parsedSettings.protocol) {
//         return defaultSettings;
//       }
//       return parsedSettings;
//     } catch (error) {
//       console.error('Error reading settings from localStorage:', error);
//       // Clear invalid localStorage data
//       localStorage.removeItem('relaySettings');
//       return defaultSettings;
//     }
//   });

//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         console.error('Unauthorized: Invalid or expired token');
//         handleLogout();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }

//       const data = await response.json();
//       const backendSettings = data.relay_settings;

//       console.log("Settings data: ", backendSettings)

//       // Transform backend settings to match new structure
//       const transformedSettings: RelaySettings = {
//         mode: backendSettings.mode || defaultSettings.mode,
//         protocol: Array.isArray(backendSettings.protocol) 
//           ? backendSettings.protocol 
//           : [backendSettings.protocol],
//         chunked: backendSettings.chunked || [],
//         chunksize: backendSettings.chunksize || '2',
//         maxFileSize: backendSettings.maxFileSize || 100,
//         maxFileSizeUnit: backendSettings.maxFileSizeUnit || 'MB',
//         mimeTypeGroups: {
//           images: backendSettings.mimeTypeWhitelist?.filter((type: string) => type.startsWith('image/')) || [],
//           videos: backendSettings.mimeTypeWhitelist?.filter((type: string) => type.startsWith('video/')) || [],
//           audio: backendSettings.mimeTypeWhitelist?.filter((type: string) => type.startsWith('audio/')) || [],
//           documents: backendSettings.mimeTypeWhitelist?.filter((type: string) => 
//             type.startsWith('application/') || type.startsWith('text/')) || []
//         },
//         mimeTypeWhitelist: backendSettings.mimeTypeWhitelist || [],
//         kindWhitelist: backendSettings.kindWhitelist || [],
//         subscription_tiers: backendSettings.subscription_tiers || []
//       };

//       setRelaySettings(transformedSettings);
//       try {
//         localStorage.setItem('relaySettings', JSON.stringify(transformedSettings));
//       } catch (error) {
//         console.error('Error saving settings to localStorage:', error);
//       }

//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, [token, handleLogout]);

//   const updateSettings = useCallback((key: keyof RelaySettings, value: any) => {
//     setRelaySettings(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   }, []);

//   const updateMimeTypeGroup = useCallback((groupName: string, types: CheckboxValueType[]) => {
//     setRelaySettings(prev => ({
//       ...prev,
//       mimeTypeGroups: {
//         ...prev.mimeTypeGroups,
//         [groupName]: types
//       }
//     }));
//   }, []);

//   const saveSettings = useCallback(async () => {
//     try {
//       // Flatten MIME types for backend
//       const settingsForBackend = {
//         ...relaySettings,
//         mimeTypeWhitelist: [
//           ...relaySettings.mimeTypeGroups.images,
//           ...relaySettings.mimeTypeGroups.videos,
//           ...relaySettings.mimeTypeGroups.audio,
//           ...relaySettings.mimeTypeGroups.documents
//         ]
//       };
  
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: settingsForBackend }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }
  
//       localStorage.setItem('relaySettings', JSON.stringify(relaySettings));
//       console.log('Settings saved successfully!');
//     } catch (error) {
//       console.error('Error saving settings:', error);
//     }
//   }, [relaySettings, token]);

//   return { 
//     relaySettings, 
//     fetchSettings, 
//     updateSettings, 
//     updateMimeTypeGroup,
//     saveSettings 
//   };
// };

// export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';

// interface SubscriptionTier {
//   data_limit: string;
//   price: string;
// }

// interface RelaySettings {
//   mode: string;
//   protocol: string[];
//   kinds: string[];
//   dynamicKinds: string[];
//   photos: string[];
//   videos: string[];
//   gitNestr: string[];
//   audio: string[];
//   appBuckets: string[];
//   dynamicAppBuckets: string[];
//   isKindsActive: boolean;
//   isPhotosActive: boolean;
//   isVideosActive: boolean;
//   isGitNestrActive: boolean;
//   isAudioActive: boolean;
//   isFileStorageActive: boolean;
//   subscription_tiers: SubscriptionTier[];
// }

// const getInitialSettings = (): RelaySettings => {
//   const savedSettings = localStorage.getItem('relaySettings');
//   return savedSettings
//     ? JSON.parse(savedSettings)
//     : {
//         mode: 'smart',
//         protocol: ['WebSocket'],
//         dynamicKinds: [],
//         kinds: [],
//         photos: [],
//         videos: [],
//         gitNestr: [],
//         audio: [],
//         appBuckets: [],
//         dynamicAppBuckets: [],
//         isKindsActive: true,
//         isPhotosActive: true,
//         isVideosActive: true,
//         isGitNestrActive: true,
//         isAudioActive: true,
//         isFileStorageActive: false,
//         subscription_tiers: [],
//       };
// };

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<RelaySettings>(getInitialSettings());
//   const handleLogout = useHandleLogout();
//   const token = readToken();

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (response.status === 401) {
//         console.error('Unauthorized: Invalid or expired token');
//         handleLogout();
//       }
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }

//       const data = await response.json();
//       const backendSettings = data.relay_settings;

//       setRelaySettings({
//         ...backendSettings,
//         protocol: Array.isArray(backendSettings.protocol) 
//           ? backendSettings.protocol 
//           : [backendSettings.protocol],
//         appBuckets: backendSettings.appBuckets || [],
//         dynamicAppBuckets: backendSettings.dynamicAppBuckets || [],
//         subscription_tiers: backendSettings.subscription_tiers || [],
//       });

//       localStorage.setItem('relaySettings', JSON.stringify({
//         ...backendSettings,
//         appBuckets: backendSettings.appBuckets || [],
//         dynamicAppBuckets: backendSettings.dynamicAppBuckets || [],
//         subscription_tiers: backendSettings.subscription_tiers || [],
//       }));

//       localStorage.setItem('dynamicAppBuckets', JSON.stringify(backendSettings.dynamicAppBuckets || []));
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, []);

//   const updateSettings = useCallback((category: keyof RelaySettings, value: any) => {
//     setRelaySettings((prevSettings) => ({
//       ...prevSettings,
//       [category]: value,
//     }));
//   }, []);

//   const saveSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: relaySettings }),
//       });
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }
//       localStorage.setItem('settingsCache', JSON.stringify(relaySettings));
//       console.log('Settings saved successfully!');
//     } catch (error) {
//       console.error('Error saving settings:', error);
//     }
//   }, [relaySettings]);

//   return { relaySettings, fetchSettings, updateSettings, saveSettings };
// };

// export default useRelaySettings;

// import { useState, useEffect, useCallback } from 'react';
// import config from '@app/config/config';
// import { readToken } from '@app/services/localStorage.service';
// import { useHandleLogout } from './authUtils';

// interface RelaySettings {
//   mode: string;
//   protocol: string[];
//   kinds: string[];
//   dynamicKinds: string[];
//   photos: string[];
//   videos: string[];
//   gitNestr: string[];
//   audio: string[];
//   appBuckets: string[];
//   dynamicAppBuckets: string[];
//   isKindsActive: boolean;
//   isPhotosActive: boolean;
//   isVideosActive: boolean;
//   isGitNestrActive: boolean;
//   isAudioActive: boolean;
//   isFileStorageActive: boolean;
// }

// const getInitialSettings = (): RelaySettings => {
//   const savedSettings = localStorage.getItem('relaySettings');
//   return savedSettings
//     ? JSON.parse(savedSettings)
//     : {
//       mode: 'smart',
//       protocol: ['WebSocket'],
//       dynamicKinds: [],
//       kinds: [],
//       photos: [],
//       videos: [],
//       gitNestr: [],
//       audio: [],
//       appBuckets: [],
//       dynamicAppBuckets: [],
//       isKindsActive: true,
//       isPhotosActive: true,
//       isVideosActive: true,
//       isGitNestrActive: true,
//       isAudioActive: true,
//       isFileStorageActive: false,
//     };
// };

// const useRelaySettings = () => {
//   const [relaySettings, setRelaySettings] = useState<RelaySettings>(getInitialSettings());

//   useEffect(() => {
//     localStorage.setItem('relaySettings', JSON.stringify(relaySettings));
//   }, [relaySettings]);

//   const handleLogout = useHandleLogout();

//   const token = readToken();

//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (response.status === 401) {
//         console.error('Unauthorized: Invalid or expired token');
//         handleLogout();
//       }
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }

//       const data = await response.json();

//       // Handle app buckets
//       const backendAppBuckets = data.relay_settings.appBuckets || [];
//       const backendDynamicAppBuckets = data.relay_settings.dynamicAppBuckets || [];

//       setRelaySettings({
//         ...data.relay_settings,
//         protocol: Array.isArray(data.relay_settings.protocol)
//           ? data.relay_settings.protocol
//           : [data.relay_settings.protocol],
//         appBuckets: backendAppBuckets,
//         dynamicAppBuckets: backendDynamicAppBuckets,
//       });

//       localStorage.setItem('relaySettings', JSON.stringify({
//         ...data.relay_settings,
//         appBuckets: backendAppBuckets,
//         dynamicAppBuckets: backendDynamicAppBuckets,
//       }));

//       // Update localStorage for dynamicAppBuckets only
//       localStorage.setItem('dynamicAppBuckets', JSON.stringify(backendDynamicAppBuckets));
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   }, []);


//   const updateSettings = useCallback((category: keyof RelaySettings, value: any) => {
//     setRelaySettings((prevSettings) => ({
//       ...prevSettings,
//       [category]: value,
//     }));
//   }, []);

//   const saveSettings = useCallback(async () => {
//     try {
//       const response = await fetch(`${config.baseURL}/api/relay-settings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ relay_settings: relaySettings }),
//       });
//       if (!response.ok) {
//         throw new Error(`Network response was not ok (status: ${response.status})`);
//       }
//       localStorage.setItem('settingsCache', JSON.stringify(relaySettings));
//       console.log('Settings saved successfully!');
//     } catch (error) {
//       console.error('Error saving settings:', error);
//     }
//   }, [relaySettings]);

//   return { relaySettings, fetchSettings, updateSettings, saveSettings };
// };

// export default useRelaySettings;
