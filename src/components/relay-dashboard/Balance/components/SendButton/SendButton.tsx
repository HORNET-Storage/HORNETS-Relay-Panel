import React, { useState } from 'react';
import { message } from 'antd';
import * as S from '../TopUpBalanceButton/TopUpBalanceButton.styles';
import SendModal from '../SendModal/SendModal';
import { useAppSelector } from '@app/hooks/reduxHooks';
import config from '@app/config/config';

const SendButton: React.FC = () => {
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
  return (
    <>
      <S.TopUpButton type={theme === 'dark' ? 'ghost' : 'primary'} block onClick={handleButtonClick}>
        {'Send'}
      </S.TopUpButton>
      <SendModal isOpen={isModalOpen} onOpenChange={handleModalClose} />
    </>
  );
};

export default SendButton;
