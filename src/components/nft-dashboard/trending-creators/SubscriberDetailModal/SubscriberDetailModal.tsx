import React, { useState } from 'react';
import { Modal, message, Button } from 'antd';
import { 
  UserOutlined, 
  KeyOutlined, 
  CalendarOutlined, 
  CrownOutlined, 
  CloseOutlined,
  CopyOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { SubscriberProfile } from '@app/hooks/usePaidSubscribers';
import * as S from './SubscriberDetailModal.styles';

interface SubscriberDetailModalProps {
  subscriber: SubscriberProfile | null;
  isVisible: boolean;
  onClose: () => void;
}

export const SubscriberDetailModal: React.FC<SubscriberDetailModalProps> = ({ 
  subscriber, 
  isVisible, 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);
  
  if (!subscriber) {
    return null;
  }
  
  // Function to copy public key
  const copyPublicKey = () => {
    navigator.clipboard.writeText(subscriber.pubkey)
      .then(() => {
        setCopied(true);
        message.success('Public key copied to clipboard');
        
        // Reset copied state after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(() => {
        message.error('Failed to copy public key');
      });
  };
  
  // Format public key for display
  const formatPublicKey = (key: string) => {
    if (key.length <= 16) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={null}
      width={500}
      title={null}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header with title */}
      <S.HeaderSection>
        <S.ModalTitle level={4}>Subscriber Profile</S.ModalTitle>
      </S.HeaderSection>
      
      {/* Avatar section with profile picture and name */}
      <S.AvatarSection>
        <S.AvatarContainer>
          <img 
            src={subscriber.picture} 
            alt={subscriber.name || 'Subscriber'}
          />
        </S.AvatarContainer>
        <S.UserName level={3}>
          {subscriber.name || 'Anonymous Subscriber'}
        </S.UserName>
        
        {subscriber.about && (
          <S.AboutText>
            {subscriber.about}
          </S.AboutText>
        )}
      </S.AvatarSection>
      
      {/* Information section */}
      <S.InfoSection>
        {/* Public Key Card */}
        <S.InfoCard bordered={false}>
          <S.InfoHeader>
            <S.IconWrapper>
              <KeyOutlined />
            </S.IconWrapper>
            <S.InfoTitle>Public Key</S.InfoTitle>
          </S.InfoHeader>
          
          <S.CopyContainer>
            <S.StyledKeyText>{formatPublicKey(subscriber.pubkey)}</S.StyledKeyText>
            <S.CopyButton 
              type="text" 
              onClick={copyPublicKey}
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            >
              {copied ? 'Copied' : 'Copy'}
            </S.CopyButton>
          </S.CopyContainer>
        </S.InfoCard>
        
        {/* Subscription Tier Card (if available) */}
        {subscriber.metadata?.subscriptionTier && (
          <S.InfoCard bordered={false}>
            <S.InfoHeader>
              <S.IconWrapper>
                <CrownOutlined />
              </S.IconWrapper>
              <S.InfoTitle>Subscription Tier</S.InfoTitle>
            </S.InfoHeader>
            <S.InfoContent>
              {subscriber.metadata.subscriptionTier}
            </S.InfoContent>
          </S.InfoCard>
        )}
        
        {/* Subscription Date Card (if available) */}
        {subscriber.metadata?.subscribedSince && (
          <S.InfoCard bordered={false}>
            <S.InfoHeader>
              <S.IconWrapper>
                <CalendarOutlined />
              </S.IconWrapper>
              <S.InfoTitle>Subscribed Since</S.InfoTitle>
            </S.InfoHeader>
            <S.InfoContent>
              {subscriber.metadata.subscribedSince}
            </S.InfoContent>
          </S.InfoCard>
        )}
      </S.InfoSection>
    </Modal>
  );
};
