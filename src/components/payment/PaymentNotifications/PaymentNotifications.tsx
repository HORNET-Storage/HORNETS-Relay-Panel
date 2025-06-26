import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BasePagination } from '@app/components/common/BasePagination/BasePagination';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { usePaymentNotifications } from '@app/hooks/usePaymentNotifications';
import { PaymentNotificationParams } from '@app/api/paymentNotifications.api';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './PaymentNotifications.styles';

interface PaymentNotificationsProps {
  className?: string;
}

export const PaymentNotifications: React.FC<PaymentNotificationsProps> = ({ className }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread' | 'user'>('unread');
  const [userPubkey, setUserPubkey] = useState<string>('');

  const { notifications, pagination, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
    usePaymentNotifications();

  // Fetch unread notifications on component mount
  useEffect(() => {
    fetchNotifications({
      page: 1,
      limit: pagination?.pageSize || 10,
      filter: 'unread',
    });
  }, [fetchNotifications, pagination?.pageSize]);

  const handleFilterChange = (value: unknown) => {
    const filterValue = value as 'all' | 'unread' | 'user';
    setFilter(filterValue);

    // Only fetch immediately for "all" and "unread" filters
    // For "user" filter, wait for the user to click the Filter button
    if (filterValue !== 'user') {
      fetchNotifications({
        page: 1,
        limit: pagination?.pageSize || 10,
        filter: filterValue,
      });
    }
  };

  const handlePageChange = (page: number) => {
    const params: PaymentNotificationParams = {
      page,
      limit: pagination?.pageSize || 10,
      filter,
    };

    if (filter === 'user' && userPubkey) {
      params.pubkey = userPubkey;
    }

    fetchNotifications(params);
  };

  const handleUserPubkeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPubkey(e.target.value);
  };

  const handleUserPubkeyFilter = () => {
    if (userPubkey && filter === 'user') {
      fetchNotifications({
        page: 1,
        limit: pagination?.pageSize || 10,
        filter: 'user',
        pubkey: userPubkey,
      });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAmount = (satoshis: number) => {
    const btc = satoshis / 100000000;
    return (
      <S.AmountDisplay>
        <S.SatAmount>{satoshis.toLocaleString()} sats</S.SatAmount>
        <S.BtcAmount>({btc.toFixed(8)} BTC)</S.BtcAmount>
      </S.AmountDisplay>
    );
  };

  const formatExpirationDate = (dateString: string) => {
    const expiration = new Date(dateString);
    const now = new Date();
    const daysUntilExpiration = Math.floor((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let color: 'default' | 'warning' | 'error' = 'default';
    if (daysUntilExpiration <= 3) {
      color = 'error';
    } else if (daysUntilExpiration <= 7) {
      color = 'warning';
    }

    return (
      <S.ExpirationInfo color={color}>
        {daysUntilExpiration <= 0
          ? t('payment.notifications.expired', 'Expired')
          : t('payment.notifications.expiresInDays', 'Expires in {{days}} days', { days: daysUntilExpiration })}
        {' - '}
        {formatDate(dateString)}
      </S.ExpirationInfo>
    );
  };

  return (
    <S.Root
      className={className}
      title={t('payment.notifications.title', 'Payment Notifications')}
      padding="1.25rem 1.5rem"
    >
      <S.FiltersWrapper>
        <BaseRow gutter={[16, 16]} align="middle">
          <BaseCol xs={24} sm={10} md={12}>
            <BaseSelect
              value={filter}
              onChange={handleFilterChange}
              options={[
                { value: 'all', label: t('payment.notifications.filters.all', 'All Payments') },
                { value: 'unread', label: t('payment.notifications.filters.unread', 'Unread') },
                { value: 'user', label: t('payment.notifications.filters.user', 'By User') },
              ]}
            />
          </BaseCol>

          {filter === 'user' && (
            <>
              <BaseCol xs={24} md={9}>
                <S.UserInput
                  placeholder={t('payment.notifications.userPlaceholder', 'Enter user pubkey')}
                  value={userPubkey}
                  onChange={handleUserPubkeyChange}
                />
              </BaseCol>
              <BaseCol xs={24} md={3}>
                <BaseButton type="primary" onClick={handleUserPubkeyFilter}>
                  {t('payment.notifications.filter', 'Filter')}
                </BaseButton>
              </BaseCol>
            </>
          )}
        </BaseRow>
      </S.FiltersWrapper>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '28px', marginBottom: '16px' }}>⏳</div>
          <S.Text style={{ fontSize: '16px' }}>{t('common.loading', 'Loading...')}</S.Text>
        </div>
      ) : notifications.length > 0 ? (
        <>
          <BaseSpace direction="vertical" size={10} split={<div style={{ height: '1rem' }}></div>}>
            {notifications.map((notification) => (
              <S.NotificationItem
                key={notification.id}
                $isRead={notification.is_read}
                $isNew={notification.is_new_subscriber}
              >
                <BaseNotification
                  type="info"
                  title={
                    <S.NotificationHeader align="middle">
                      <S.TierTag $tier={notification.subscription_tier}>{notification.subscription_tier}</S.TierTag>
                      {t(
                        notification.is_new_subscriber
                          ? 'payment.notifications.newSubscription'
                          : 'payment.notifications.renewalSubscription',
                        notification.is_new_subscriber ? 'New Subscription' : 'Subscription Renewal',
                      )}
                      {notification.is_new_subscriber && (
                        <S.NewSubscriberBadge>{t('payment.notifications.new', 'NEW')}</S.NewSubscriberBadge>
                      )}
                    </S.NotificationHeader>
                  }
                  description={
                    <S.NotificationContent>
                      <S.NotificationMeta>
                        <S.MetaItem>
                          <S.MetaLabel>User:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.pubkey.substring(0, 10)}...
                            <S.CopyButton
                              onClick={() => {
                                navigator.clipboard.writeText(notification.pubkey);
                                notificationController.success({
                                  message: 'User pubkey copied to clipboard',
                                });
                              }}
                            >
                              Copy Pubkey
                            </S.CopyButton>
                          </S.MetaValue>
                        </S.MetaItem>
                      </S.NotificationMeta>
                      <S.TransactionWrapper>
                        <S.LeftSideTX>
                          <S.MetaItem>
                            <S.MetaValue>{formatDate(notification.created_at)}</S.MetaValue>
                          </S.MetaItem>
                          <S.MetaItem>
                            <S.MetaLabel>TX ID:</S.MetaLabel>
                            <S.MetaValue>
                              {notification.tx_id.substring(0, 10)}...
                              <S.CopyButton
                                onClick={() => {
                                  navigator.clipboard.writeText(notification.tx_id);
                                  notificationController.success({
                                    message: 'Transaction ID copied to clipboard',
                                  });
                                }}
                              >
                                Copy TX ID
                              </S.CopyButton>
                            </S.MetaValue>
                          </S.MetaItem>
                        </S.LeftSideTX>
                        <div>{formatAmount(notification.amount)}</div>
                      </S.TransactionWrapper>
                      <S.CardFooter>
                        {formatExpirationDate(notification.expiration_date)}

                        {!notification.is_read && (
                          <S.MarkReadButton onClick={() => markAsRead(notification.id)} size="small" type="link">
                            {t('payment.notifications.markAsRead', 'Mark as read')}
                          </S.MarkReadButton>
                        )}
                      </S.CardFooter>
                    </S.NotificationContent>
                  }
                />
              </S.NotificationItem>
            ))}
          </BaseSpace>

          <S.FooterWrapper>
            <BaseRow justify="space-between" align="middle">
              <BaseCol>
                {notifications.some((n) => !n.is_read) && (
                  <BaseButton type="default" onClick={() => markAllAsRead()}>
                    {t('payment.notifications.readAll', 'Mark all as read')}
                  </BaseButton>
                )}
              </BaseCol>
              <BaseCol>
                {pagination && (
                  <BasePagination
                    current={pagination.currentPage}
                    pageSize={pagination.pageSize}
                    total={pagination.totalItems}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                )}
              </BaseCol>
            </BaseRow>
          </S.FooterWrapper>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            minHeight: '55vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
          <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500, fontSize: '18px' }}>
            {t('payment.notifications.noNotifications', 'No payment notifications')}
          </S.Text>
          <S.Text
            style={{
              display: 'block',
              color: 'var(--text-light-color)',
              fontSize: '14px',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            {t(
              'payment.notifications.emptyDescription',
              'Payment notifications will appear here when users subscribe to your services',
            )}
          </S.Text>
        </div>
      )}
    </S.Root>
  );
};
