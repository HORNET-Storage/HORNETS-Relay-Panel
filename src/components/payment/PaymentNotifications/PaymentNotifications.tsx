import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BasePagination } from '@app/components/common/BasePagination/BasePagination';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { usePaymentNotifications } from '@app/hooks/usePaymentNotifications';
import { PaymentNotification, PaymentNotificationParams } from '@app/api/paymentNotifications.api';
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

  const testNotifications: PaymentNotification[] = [
    {
      id: 1231203013202,
      pubkey: 'npub1examplepubkey1234567890',
      tx_id: 'tx1234567890abcdef',
      amount: 1000, // in satoshis
      subscription_tier: '5GB',
      is_new_subscriber: true,
      expiration_date: '2024-12-31T23:59:59Z',
      created_at: '2024-01-01T12:00:00Z',
      is_read: false,
    },
    {
      id: 1231203013203,
      pubkey: 'npub1anotheruser0987654321',
      tx_id: 'txabcdef1234567890',
      amount: 5000,
      subscription_tier: '10GB',
      is_new_subscriber: false,
      expiration_date: '2024-11-30T23:59:59Z',
      created_at: '2024-02-10T09:30:00Z',
      is_read: true,
    },
    {
      id: 1231203013204,
      pubkey: 'npub1thirduser1122334455',
      tx_id: 'txfedcba0987654321',
      amount: 2500,
      subscription_tier: '5GB',
      is_new_subscriber: true,
      expiration_date: '2024-10-15T23:59:59Z',
      created_at: '2024-03-05T15:45:00Z',
      is_read: false,
    },
    {
      id: 1231203013205,
      pubkey: 'npub1fourthuser5566778899',
      tx_id: 'tx1122334455667788',
      amount: 10000,
      subscription_tier: '20GB',
      is_new_subscriber: false,
      expiration_date: '2024-09-01T23:59:59Z',
      created_at: '2024-04-12T18:20:00Z',
      is_read: true,
    },
    {
      id: 1231203013206,
      pubkey: 'npub1fifthuser9988776655',
      tx_id: 'tx9988776655443322',
      amount: 750,
      subscription_tier: '2GB',
      is_new_subscriber: true,
      expiration_date: '2024-08-20T23:59:59Z',
      created_at: '2024-05-01T08:10:00Z',
      is_read: false,
    },
    {
      id: 1231203013207,
      pubkey: 'npub1sixthuser2233445566',
      tx_id: 'tx2233445566778899',
      amount: 3000,
      subscription_tier: '10GB',
      is_new_subscriber: false,
      expiration_date: '2024-07-15T23:59:59Z',
      created_at: '2024-06-18T13:55:00Z',
      is_read: true,
    },
    {
      id: 1231203013208,
      pubkey: 'npub1seventhuser3344556677',
      tx_id: 'tx3344556677889900',
      amount: 1200,
      subscription_tier: '5GB',
      is_new_subscriber: true,
      expiration_date: '2024-06-10T23:59:59Z',
      created_at: '2024-07-02T11:25:00Z',
      is_read: false,
    },
    {
      id: 1231203013209,
      pubkey: 'npub1eighthuser4455667788',
      tx_id: 'tx4455667788990011',
      amount: 8000,
      subscription_tier: '20GB',
      is_new_subscriber: false,
      expiration_date: '2024-05-05T23:59:59Z',
      created_at: '2024-08-14T16:40:00Z',
      is_read: true,
    },
    {
      id: 1231203013210,
      pubkey: 'npub1ninthuser5566778899',
      tx_id: 'tx5566778899001122',
      amount: 2000,
      subscription_tier: '5GB',
      is_new_subscriber: true,
      expiration_date: '2024-04-25T23:59:59Z',
      created_at: '2024-09-09T10:05:00Z',
      is_read: false,
    },
    {
      id: 1231203013211,
      pubkey: 'npub1tenthuser6677889900',
      tx_id: 'tx6677889900112233',
      amount: 15000,
      subscription_tier: '50GB',
      is_new_subscriber: false,
      expiration_date: '2024-03-15T23:59:59Z',
      created_at: '2024-10-21T19:15:00Z',
      is_read: true,
    },
    {
      id: 1231203013212,
      pubkey: 'npub1eleventhuser7788990011',
      tx_id: 'tx7788990011223344',
      amount: 600,
      subscription_tier: '2GB',
      is_new_subscriber: true,
      expiration_date: '2024-02-28T23:59:59Z',
      created_at: '2024-11-30T07:50:00Z',
      is_read: false,
    },
    {
      id: 123120301321222,
      pubkey: 'npub1eleventhuser7788990011',
      tx_id: 'tx7788990011223344',
      amount: 600,
      subscription_tier: '2GB',
      is_new_subscriber: true,
      expiration_date: '2024-02-28T23:59:59Z',
      created_at: '2024-11-30T07:50:00Z',
      is_read: true,
    },
  ];

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
    <BaseCard
      className={className}
      title={t('payment.notifications.title', 'Payment Notifications')}
      padding="1.25rem 2.5rem"
    >
      <S.FiltersWrapper>
        <BaseRow gutter={[16, 16]} align="middle">
          <BaseCol xs={24} md={8}>
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
              <BaseCol xs={24} md={12}>
                <S.UserInput
                  placeholder={t('payment.notifications.userPlaceholder', 'Enter user pubkey')}
                  value={userPubkey}
                  onChange={handleUserPubkeyChange}
                />
              </BaseCol>
              <BaseCol xs={24} md={4}>
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
      ) : testNotifications.length > 0 ? (
        <>
          <BaseSpace direction="vertical" size={10} split={<div style={{ height: '1rem' }}></div>}>
            {testNotifications.map((notification) => (
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
                          <S.MetaValue>{formatDate(notification.created_at)}</S.MetaValue>
                        </S.MetaItem>

                        <S.MetaItem>
                          <S.MetaLabel>User:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.pubkey.substring(0, 15)}...
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

                        <S.MetaItem>
                          <S.MetaLabel>TX ID:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.tx_id.substring(0, 15)}...
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
                      </S.NotificationMeta>

                      <div>
                        <strong>{t('payment.notifications.amount', 'Amount')}: </strong>
                        {formatAmount(notification.amount)}
                      </div>

                      {formatExpirationDate(notification.expiration_date)}

                      {!notification.is_read && (
                        <S.MarkReadButton onClick={() => markAsRead(notification.id)} size="small" type="link">
                          {t('payment.notifications.markAsRead', 'Mark as read')}
                        </S.MarkReadButton>
                      )}
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
    </BaseCard>
  );
};
