import React from 'react';
import { Modal, ModalProps } from 'antd';
import { modalSizes } from 'constants/modalSizes';

// Extend ModalProps to include our custom props
interface BaseModalProps extends Omit<ModalProps, 'visible'> {
  size?: 'small' | 'medium' | 'large';
  visible?: boolean; // Deprecated prop
  open?: boolean; // New prop that will replace visible
}

interface BaseModalInterface extends React.FC<BaseModalProps> {
  info: typeof Modal.info;
  success: typeof Modal.success;
  warning: typeof Modal.warning;
  error: typeof Modal.error;
}

export const BaseModal: BaseModalInterface = ({ 
  size = 'medium', 
  visible, 
  open, 
  children, 
  ...props 
}) => {
  const modalSize = Object.entries(modalSizes).find((sz) => sz[0] === size)?.[1];
  
  // If open is provided, use it. Otherwise, fall back to visible.
  // This ensures backward compatibility while supporting the new prop.
  const isOpen = open !== undefined ? open : visible;

  // Show deprecation warning in development mode
  if (process.env.NODE_ENV === 'development' && visible !== undefined && open === undefined) {
    console.warn(
      '[antd: Modal] `visible` will be removed in next major version, please use `open` instead.'
    );
  }

  // Determine the container based on fullscreen status
  const getModalContainer = document.fullscreenElement
    ? () => document.fullscreenElement as HTMLElement
    : false;

  return (
    <Modal
      getContainer={getModalContainer}
      width={modalSize}
      open={isOpen}
      {...props}
    >
      {children}
    </Modal>
  );
};

BaseModal.info = Modal.info;
BaseModal.success = Modal.success;
BaseModal.warning = Modal.warning;
BaseModal.error = Modal.error;
