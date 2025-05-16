import React, { useEffect, useState } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { TopUpDataProps } from '../../interfaces/interfaces';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import { AddressList } from '../AddressList/AddressList';
import axios from 'axios';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useHandleLogout } from '@app/hooks/authUtils';

interface TopUpBalanceModalProps extends TopUpDataProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

interface Address {
  index: string;
  address: string;
}

export const TopUpBalanceModal: React.FC<TopUpBalanceModalProps> = ({
  cards,
  loading,
  isOpen,
  onOpenChange,
  onFinish,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = useHandleLogout();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const token = readToken(); // Read the JWT token from local storage
      if (!token) {
        handleLogout();
        return;
      }

      axios
        .get(`${config.baseURL}/api/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
          },
        })
        .then((response) => {
          // Ensure we always have a valid array, even if the API returns null
          setAddresses(response.data || []);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            handleLogout(); // Log out if token is invalid or expired
          } else {
            console.error('Error fetching addresses:', error);
            setError('Failed to load addresses. Please try again later.');
          }
          setIsLoading(false);
        });
    }
  }, [isOpen, handleLogout]);

  return (
    <BaseModal centered={true} width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
      <BaseSpin spinning={isLoading}>
        {error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ff4d4f' }}>
            {error}
          </div>
        ) : (
          <AddressList addresses={addresses} />
        )}
      </BaseSpin>
    </BaseModal>
  );
};
