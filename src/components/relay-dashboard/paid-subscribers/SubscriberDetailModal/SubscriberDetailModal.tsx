import React, { useState } from 'react';
import { Modal, message, Spin, Typography } from 'antd';
import {
  KeyOutlined,
  CalendarOutlined,
  CrownOutlined,
  CloseOutlined,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { SubscriberProfile } from '@app/hooks/usePaidSubscribers';
import * as S from './SubscriberDetailModal.styles';

interface SubscriberDetailModalProps {
  subscriber: SubscriberProfile | null;
  loading?: boolean;
  fetchFailed?: boolean;
  isVisible: boolean;
  onClose: () => void;
}

export const SubscriberDetailModal: React.FC<SubscriberDetailModalProps> = ({ subscriber, isVisible, onClose, loading = false, fetchFailed = false }) => {
  const [copied, setCopied] = useState(false);
  // Loading state
  if (!subscriber && loading && !fetchFailed) {
    return (
      <S.StateModal open={isVisible} footer={null} onCancel={onClose} centered>
        <Spin tip="Loading..." />
      </S.StateModal>
    );
  }

  // Error state
  if (!subscriber && !loading && fetchFailed) {
    return (
      <S.StateModal open={isVisible} footer={null} onCancel={onClose} centered>
        <Typography.Text type="danger">Failed to fetch subscriber profile. Please try again.</Typography.Text>
      </S.StateModal>
    );
  }

  // Not found state
  if (!subscriber && !loading &&  !fetchFailed) {
    return (
      <S.StateModal open={isVisible} footer={null} onCancel={onClose} centered>
        <Typography.Text type="secondary">Couldn&apos;t find this subscriber profile.</Typography.Text>
      </S.StateModal>
    );
  }
  if (!subscriber) {
    return null;
  }

  // Function to copy public key
  const copyPublicKey = () => {
    navigator.clipboard
      .writeText(subscriber.pubkey)
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

  // Format date for display
  const formatDate = (dateString: string) => {
    // Check if it's a zero time value (Go default)
    if (dateString === '0001-01-01T00:00:00Z' || !dateString) {
      return 'Not available';
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  const subscribed: boolean = !!subscriber.metadata?.subscriptionTier && !!subscriber.metadata?.subscribedSince && subscriber.metadata.subscribedSince !== '0001-01-01T00:00:00Z';
  const subscribedLabel = subscribed ? 'Subscribed' : 'Not Subscribed';

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={<CloseOutlined />}
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
        <S.SubscriptionBadge subscribed={subscribed} text={subscribedLabel}>
          <S.AvatarContainer>
            <img src={subscriber.picture} alt={subscriber.name || 'Subscriber'} />
          </S.AvatarContainer>
        </S.SubscriptionBadge>
          <S.UserName level={3}>{subscriber.name || 'Anonymous Subscriber'}</S.UserName>

        {subscriber.about && <S.AboutText>{subscriber.about}</S.AboutText>}
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
            <S.CopyButton type="text" onClick={copyPublicKey} icon={copied ? <CheckOutlined /> : <CopyOutlined />}>
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
            <S.InfoContent>{subscriber.metadata.subscriptionTier}</S.InfoContent>
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
            <S.InfoContent>{formatDate(subscriber.metadata.subscribedSince)}</S.InfoContent>
          </S.InfoCard>
        )}
      </S.InfoSection>
    </Modal>
  );
};
