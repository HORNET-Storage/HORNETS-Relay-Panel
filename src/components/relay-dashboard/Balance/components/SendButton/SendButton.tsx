import React, { useState } from 'react';
import { SendOutlined } from '@ant-design/icons';
import * as S from '../TopUpBalanceButton/TopUpBalanceButton.styles';
import SendModal from '../SendModal/SendModal';

const SendButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <S.TopUpButton
        type="primary"
        block
        onClick={handleButtonClick}
        icon={<SendOutlined />}
      >
        Send
      </S.TopUpButton>
      <SendModal isOpen={isModalOpen} onOpenChange={handleModalClose} />
    </>
  );
};

export default SendButton;
