// src/hooks/useChartData.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';
import { message } from 'antd';
import { useHandleLogout } from './authUtils';

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

        const data = await response.json();

        // Process the data into chartDataItems using translated names
        const newChartData: ChartDataItem[] = [
          { value: data.kinds, name: t('categories.kinds') },
          { value: data.photos, name: t('categories.photos') },
          { value: data.videos, name: t('categories.videos') },
          { value: data.audio, name: t('categories.audio') },
          { value: data.misc, name: t('categories.misc') },
        ];

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
