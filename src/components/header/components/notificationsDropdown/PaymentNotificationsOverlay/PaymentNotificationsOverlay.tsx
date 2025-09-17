import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { PaymentNotification } from '@app/api/paymentNotifications.api';
import * as S from '../NotificationsOverlay/NotificationsOverlay.styles';

interface PaymentNotificationsOverlayProps {
  notifications: PaymentNotification[];
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onRefresh: () => Promise<void>;
  onClose?: () => void;
}

export const PaymentNotificationsOverlay: React.FC<PaymentNotificationsOverlayProps> = ({
  notifications,
  markAsRead,
  markAllAsRead,
  onRefresh,
  onClose,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleViewAll = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setTimeout(() => {
      navigate('/payment-notifications');
    }, 0);
  }, [onClose, navigate]);
  
  const handleViewDetails = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setTimeout(() => {
      navigate('/payment-notifications');
    }, 0);
  }, [onClose, navigate]);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAmount = (satoshis: number) => {
    const btc = satoshis / 100000000;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
        <div style={{ fontWeight: 'bold', fontSize: "1rem"}}>{satoshis.toLocaleString()} sats</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light-color)' }}>
          ({btc.toFixed(8)} BTC)
        </div>
      </div>
    );
  };

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const noticesList = notifications.map((notification) => (
    <S.RootNotification
      key={notification.id}
      type="info"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '10px',
            textTransform: 'uppercase'
          }}>
            {notification.subscription_tier}
          </span>
          <span>
            {t(
              notification.is_new_subscriber 
                ? 'payment.notifications.newSubscription' 
                : 'payment.notifications.renewalSubscription', 
              notification.is_new_subscriber 
                ? 'New Subscription' 
                : 'Subscription Renewal'
            )}
          </span>
          {notification.is_new_subscriber && (
            <span style={{
              fontSize: '0.7rem',
              padding: '2px 6px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '10px',
              textTransform: 'uppercase'
            }}>
              {t('payment.notifications.new', 'NEW')}
            </span>
          )}
        </div>
      }
      description={
        <div>
          <S.TransactionWrapper>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light-color)', marginBottom: '4px' }}>
            {formatDate(notification.created_at)}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            {formatAmount(notification.amount)}
          </div>
          </S.TransactionWrapper>
          
          {/* <div style={{ fontSize: '0.85rem', color: 'var(--text-light-color)', marginTop: '4px' }}>
            {t('payment.notifications.expiration', 'Expires')}: {formatDate(notification.expiration_date)}
          </div> */}
          <S.ActionRow>
            <a
              onClick={handleViewDetails}
              style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer' }}
            >
              {t('payment.notifications.viewDetails', 'View details')}
            </a>
          {!notification.is_read && (
            <BaseButton
              type="link"
              size="small"
              onClick={() => markAsRead(notification.id)}
              style={{
                padding: '4px 0',
                height: 'auto',
                marginTop: '4px',
                fontSize: '0.85rem',
                color: '#00ffff'
              }}
            >
              {t('payment.notifications.markAsRead', 'Mark as read')}
            </BaseButton>
          )}
          
          
          </S.ActionRow>
        </div>
      }
    />
  ));

  return (
    <S.NoticesOverlayMenu {...props}>
      <BaseRow gutter={[20, 20]}>
        <BaseCol span={24}>
          {notifications.length > 0 ? (
            <S.NotificationsList>
              <S.NotificationsWrapper direction="vertical" size={10} split={<S.SplitDivider />} style={{ width: '95%' }}>
                {noticesList}
              </S.NotificationsWrapper>
            </S.NotificationsList>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
              <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                {t('payment.notifications.noNotifications', 'No payment notifications')}
              </S.Text>
              <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '0.85rem' }}>
                {t('payment.notifications.emptyDescription', 'Payment notifications will appear here when users subscribe to your services')}
              </S.Text>
            </div>
          )}
        </BaseCol>
        <BaseCol span={24}>
          <BaseRow gutter={[10, 10]}>
            {notifications.some(n => !n.is_read) && (
              <BaseCol span={24}>
                <S.Btn type="ghost" onClick={handleMarkAllAsRead}>
                  {t('payment.notifications.readAll', 'Mark all as read')}
                </S.Btn>
              </BaseCol>
            )}
            <BaseCol span={24}>
              <S.Btn type="ghost" onClick={onRefresh}>
                {t('payment.notifications.refresh', 'Refresh')}
              </S.Btn>
            </BaseCol>
            <BaseCol span={24}>
              <S.Btn type="link" onClick={handleViewAll}>
                {t('payment.notifications.viewAll', 'View all')}
              </S.Btn>
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </S.NoticesOverlayMenu>
  );
};
