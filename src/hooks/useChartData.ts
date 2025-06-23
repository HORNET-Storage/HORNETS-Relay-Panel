// src/hooks/useChartData.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { message } from 'antd';
import { useHandleLogout } from './authUtils';
import { FileCountResponse } from '@app/types/newSettings.types';

interface ChartDataItem {
  value: number;
  name: string;
}

const useChartData = () => {
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = readToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.baseURL}/api/relay/count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();
            throw new Error('Authentication failed. You have been logged out.');
          }
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }

        const data: FileCountResponse = await response.json();

        // Process the data into chartDataItems using translated names
        // Handle dynamic media types while maintaining UI compatibility
        const newChartData: ChartDataItem[] = [];
        
        // Always include kinds first
        newChartData.push({ value: data.kinds, name: t('categories.kinds') });
        
        // Destructure to separate kinds from media types
        const { kinds, ...mediaCounts } = data;
        
        // Map dynamic media types to chart data with fallback translations
        Object.entries(mediaCounts).forEach(([mediaType, count]) => {
          let translationKey = '';
          let fallbackName = '';
          
          // Map new media types to existing translation keys for UI compatibility
          switch (mediaType) {
            case 'image':
              translationKey = 'categories.photos';
              fallbackName = 'Photos';
              break;
            case 'video':
              translationKey = 'categories.videos';
              fallbackName = 'Videos';
              break;
            case 'audio':
              translationKey = 'categories.audio';
              fallbackName = 'Audio';
              break;
            case 'git':
              translationKey = 'categories.misc';
              fallbackName = 'Git';
              break;
            default:
              // For any new media types not yet in translations
              translationKey = `categories.${mediaType}`;
              fallbackName = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
              break;
          }
          
          // Use translation if available, otherwise use fallback
          const displayName = t(translationKey, { defaultValue: fallbackName });
          newChartData.push({ value: count, name: displayName });
        });

        setChartData(newChartData);
      } catch (error) {
        console.error('Error:', error);
        message.error(error instanceof Error ? error.message : 'An error occurred');
        setChartData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t, handleLogout]);

  return { chartData, isLoading };
};

export default useChartData;
