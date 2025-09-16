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
import { PaymentNotificationParams } from '@app/api/paymentNotifications.api';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './PaymentNotifications.styles';

interface PaymentNotificationsProps {
  className?: string;
}

export const PaymentNotifications: React.FC<PaymentNotificationsProps> = ({ className }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { notifications, pagination, isLoading, fetchNotifications, markAsRead, markAllAsRead } =
    usePaymentNotifications();

  // Fetch unread notifications on component mount
  useEffect(() => {
    fetchNotifications({
      page: 1,
      limit: pagination?.pageSize || 10,
      filter: 'all'
    });
  }, [fetchNotifications, pagination?.pageSize]);

  const handleFilterChange = (value: unknown) => {
    const filterValue = value as 'all' | 'unread';
    setFilter(filterValue);

    fetchNotifications({
      page: 1,
      limit: pagination?.pageSize || 10,
      filter: filterValue
    });
  };

  const handlePageChange = (page: number) => {
    const params: PaymentNotificationParams = {
      page,
      limit: pagination?.pageSize || 10,
      filter
    };

    fetchNotifications(params);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <BaseCard className={className} title={t('payment.notifications.title', 'Payment Notifications')} padding="0">
      <S.ScrollableContent>
        <S.ContentPadding>
          <S.FiltersWrapper>
            <BaseRow gutter={[16, 16]} align="middle">
              <BaseCol xs={24} md={8}>
                <BaseSelect
                  value={filter}
                  onChange={handleFilterChange}
                  options={[
                    { value: 'all', label: t('payment.notifications.filters.all', 'All Notifications') },
                    { value: 'unread', label: t('payment.notifications.filters.unread', 'Unread') }
                  ]}
                />
              </BaseCol>
            </BaseRow>
          </S.FiltersWrapper>

          {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '28px', marginBottom: '16px' }}>⏳</div>
          <S.Text style={{ fontSize: '16px' }}>
            {t('common.loading', 'Loading...')}
          </S.Text>
        </div>
      ) : notifications.length > 0 ? (
        <>
          <BaseSpace direction="vertical" size={10} split={<S.SplitDivider />}>
            {notifications.map((notification) => (
              <S.NotificationItem key={notification.id} $isRead={notification.is_read}>
                <BaseNotification
                  type="info"
                  title={
                    <BaseRow align="middle">
                      <S.PaymentTypeTag $type={notification.is_new_subscriber ? 'new' : 'renewal'}>
                        {notification.subscription_tier}
                      </S.PaymentTypeTag>
                      {t(
                        notification.is_new_subscriber
                          ? 'payment.notifications.newSubscription'
                          : 'payment.notifications.renewalSubscription',
                        notification.is_new_subscriber ? 'New Subscription' : 'Subscription Renewal'
                      )}
                      {notification.is_new_subscriber && (
                        <S.PaymentCountBadge count={1} />
                      )}
                    </BaseRow>
                  }
                  description={
                    <S.NotificationContent>
                      <S.NotificationMeta>
                        <S.MetaItem>
                          <S.MetaLabel>Date:</S.MetaLabel>
                          <S.MetaValue>{formatDate(notification.created_at)}</S.MetaValue>
                        </S.MetaItem>

                        <S.MetaItem>
                          <S.MetaLabel>User:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.pubkey.substring(0, 10)}...
                            <S.CopyButton
                              onClick={() => {
                                navigator.clipboard.writeText(notification.pubkey);
                                notificationController.success({
                                  message: 'User pubkey copied to clipboard'
                                });
                              }}
                            >
                              Copy
                            </S.CopyButton>
                          </S.MetaValue>
                        </S.MetaItem>

                        <S.MetaItem>
                          <S.MetaLabel>Transaction:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.tx_id.substring(0, 10)}...
                            <S.CopyButton
                              onClick={() => {
                                navigator.clipboard.writeText(notification.tx_id);
                                notificationController.success({
                                  message: 'Transaction ID copied to clipboard'
                                });
                              }}
                            >
                              Copy
                            </S.CopyButton>
                          </S.MetaValue>
                        </S.MetaItem>
                      </S.NotificationMeta>

                      <S.ContentContainer>
                        <S.PaymentBanner $paymentType={notification.is_new_subscriber ? 'new' : 'renewal'}>
                          💰 {notification.amount.toLocaleString()} sats ({(notification.amount / 100000000).toFixed(8)} BTC)
                        </S.PaymentBanner>

                        <S.PaymentDetails>
                          <S.ExpirationInfo>
                            Expires: {formatDate(notification.expiration_date)}
                          </S.ExpirationInfo>
                        </S.PaymentDetails>
                      </S.ContentContainer>

                      {!notification.is_read && (
                        <S.MarkReadButton
                          onClick={() => markAsRead(notification.id)}
                          size="small"
                        >
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
                {notifications.some(n => !n.is_read) && (
                  <BaseButton type="default" onClick={markAllAsRead}>
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
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
          <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500, fontSize: '18px' }}>
            {t('payment.notifications.noNotifications', 'No payment notifications')}
          </S.Text>
          <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            {t('payment.notifications.emptyDescription', 'Payment notifications will appear here when users subscribe to your services')}
          </S.Text>
        </div>
          )}
        </S.ContentPadding>
      </S.ScrollableContent>
    </BaseCard>
  );
};
