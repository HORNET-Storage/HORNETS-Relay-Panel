import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { TopUpBalanceModal } from '../TopUpBalanceModal/TopUpBalanceModal';
import config from '@app/config/config';
import * as S from './TopUpBalanceButton.styles';

export const TopUpBalanceButton: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useAppSelector((state) => state.theme);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    if (!config.isWalletEnabled) {
      message.warning('Wallet functionality is not available. Please rebuild the panel with REACT_APP_WALLET_BASE_URL configured in your environment file.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFinish = () => {
    console.log('Finish button clicked');
  };

  return (
    <>
      <S.TopUpButton type={theme === 'dark' ? 'ghost' : 'primary'} block onClick={handleButtonClick}>
        {t('nft.receivingAddresses')}
      </S.TopUpButton>
      <TopUpBalanceModal
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        cards={[]}
        loading={false}
        onFinish={handleFinish}
      />
    </>
  );
};
