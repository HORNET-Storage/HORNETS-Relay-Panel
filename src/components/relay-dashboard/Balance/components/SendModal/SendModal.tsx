import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import SendForm from '../SendForm/SendForm';
import ResultScreen from '../SendForm/components/ResultScreen/ResultScreen';
import { useFullscreenContainer } from '@app/hooks/useFullscreenContainer';

interface SendModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

interface SuccessScreenProps {
  isSuccess: boolean;
  amount: number;
  address: string;
  txid?: string; // New field for transaction ID
  message?: string; // Optional message from the transaction response
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [successScreenState, setSuccessScreenState] = useState<SuccessScreenProps | null>(null);
  const fullscreenContainer = useFullscreenContainer();

  const onFinish = (status: boolean, address: string, amount: number, txid?: string, message?: string) => {
    setSuccessScreenState({ isSuccess: status, address, amount, txid, message });
    setIsFinished(true);
  };

  const handleFinish = () => {
    setSuccessScreenState(null);
    setIsFinished(false);
    onOpenChange();
  };

  // Use fullscreen container if available, otherwise render to body
  const portalContainer = fullscreenContainer || document.body;

  return ReactDOM.createPortal(
    <BaseModal
      centered={true}
      width={600}
      open={isOpen}
      onCancel={handleFinish}
      footer={null}
      destroyOnClose
    >
      <BaseSpin spinning={isLoading}>
        {isFinished && successScreenState ? (
          <ResultScreen
            isSuccess={successScreenState.isSuccess}
            amount={successScreenState.amount}
            receiver={successScreenState.address}
            txid={successScreenState.txid || ""} // Provide a default value
            message={successScreenState.message}
          />

        ) : (
          <SendForm onSend={onFinish} />
        )}
      </BaseSpin>
    </BaseModal>,
    portalContainer
  );
};

export default SendModal;

