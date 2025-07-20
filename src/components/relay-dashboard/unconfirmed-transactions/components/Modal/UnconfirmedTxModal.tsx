import React from 'react';
import ReactDOM from 'react-dom';
import * as S from './UnconfirmedTxModal.styles';
import UnconfirmedTransactions from '../../UnconfirmedTransactions';

interface UnconfirmedTxModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const UnconfirmedTxModal: React.FC<UnconfirmedTxModalProps> = ({ isOpen, onOpenChange }) => {
  return ReactDOM.createPortal(
    <S.Modal open={isOpen} centered={true} onCancel={onOpenChange} footer={null} destroyOnClose>
      <UnconfirmedTransactions />
    </S.Modal>,
    document.body
  );
};

export default UnconfirmedTxModal;

