import React, { useState, useEffect, useCallback } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseBadge } from '@app/components/common/BaseBadge/BaseBadge';
import { PaymentNotificationsOverlay } from '@app/components/header/components/notificationsDropdown/PaymentNotificationsOverlay';
import ReportNotificationsOverlay from '@app/components/header/components/notificationsDropdown/ReportNotificationsOverlay';
import { usePaymentNotifications } from '@app/hooks/usePaymentNotifications';
import { useReportNotifications } from '@app/hooks/useReportNotifications';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

export const NotificationsDropdown: React.FC = () => {
  const { t } = useTranslation();
  const [isOpened, setOpened] = useState(false);
  
  const {
    notifications: allPaymentNotifications,
    markAsRead: markPaymentAsRead,
    markAllAsRead: markAllPaymentsAsRead,
    fetchNotifications: refreshPaymentNotifications
  } = usePaymentNotifications();

  const {
    notifications: allReportNotifications,
    markAsRead: markReportAsRead,
    markAllAsRead: markAllReportsAsRead,
    fetchNotifications: refreshReportNotifications
  } = useReportNotifications();
  
  // Filter to only show unread notifications in the dropdown
  const paymentNotifications = allPaymentNotifications.filter(notification => !notification.is_read);

  // Filter to only show unread report notifications in the dropdown
  const reportNotifications = allReportNotifications.filter(notification => !notification.is_read);
  
  // Initialize all notification types
  useEffect(() => {
    refreshPaymentNotifications({ filter: 'unread' });
    refreshReportNotifications({ filter: 'unread' });
  }, [refreshPaymentNotifications, refreshReportNotifications]);
  
  // Refresh all notifications, only showing unread ones
  const handleRefresh = useCallback(() => {
    refreshPaymentNotifications({ filter: 'unread' });
    refreshReportNotifications({ filter: 'unread' });
  }, [refreshPaymentNotifications, refreshReportNotifications]);
  
  // Check specifically for unread notifications
  const hasUnreadPaymentNotifications = paymentNotifications.some(notification => !notification.is_read);
  const hasUnreadReportNotifications = reportNotifications.some(notification => !notification.is_read);
  const hasUnreadNotifications = hasUnreadPaymentNotifications || hasUnreadReportNotifications;
  
  // Count unread notifications
  const unreadPaymentCount = paymentNotifications.filter(notification => !notification.is_read).length;
  const unreadReportCount = reportNotifications.filter(notification => !notification.is_read).length;
  const totalUnreadCount = unreadPaymentCount + unreadReportCount;

  // Handle clearing all payment notifications
  const handleClearAllPayments = useCallback(() => {
    return markAllPaymentsAsRead();
  }, [markAllPaymentsAsRead]);

  // Handle clearing all report notifications
  const handleClearAllReports = useCallback(() => {
    return markAllReportsAsRead();
  }, [markAllReportsAsRead]);

  // Get translated tab names
  const paymentsLabel = t('payment.notifications.title', 'Payments');
  const reportsLabel = t('report.notifications.title', 'Reports');

  // Custom tab style to ensure content overflow is handled correctly
  const tabContentStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden'
  };

  // Define the items for the tabs
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          {paymentsLabel}
          {unreadPaymentCount > 0 && (
            <BaseBadge count={unreadPaymentCount} size="small" style={{ marginLeft: '5px' }} />
          )}
        </span>
      ),
      children: (
        <div style={tabContentStyle}>
          <PaymentNotificationsOverlay
            notifications={paymentNotifications}
            markAsRead={markPaymentAsRead}
            markAllAsRead={handleClearAllPayments}
            onRefresh={() => {
              refreshPaymentNotifications({ filter: 'unread' });
              return Promise.resolve();
            }}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          {reportsLabel}
          {unreadReportCount > 0 && (
            <BaseBadge count={unreadReportCount} size="small" style={{ marginLeft: '5px' }} />
          )}
        </span>
      ),
      children: (
        <div style={tabContentStyle}>
          <ReportNotificationsOverlay
            notifications={reportNotifications}
            markAsRead={markReportAsRead}
            markAllAsRead={handleClearAllReports}
            onRefresh={() => {
              refreshReportNotifications({ filter: 'unread' });
              return Promise.resolve();
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <BasePopover
      trigger="click"
      content={
        <div style={{ maxWidth: '400px', minWidth: '320px', maxHeight: '450px' }}>
          <Tabs 
            defaultActiveKey="1" 
            items={tabItems}
            destroyInactiveTabPane={false}
            style={{ height: '100%' }}
          />
        </div>
      }
      onOpenChange={setOpened}
      placement="bottomRight"
    >
      <HeaderActionWrapper>
        <BaseButton
          type={isOpened ? 'ghost' : 'text'}
          icon={
            <BaseBadge count={totalUnreadCount > 0 ? totalUnreadCount : 0} overflowCount={99} dot={false}>
              <BellOutlined />
            </BaseBadge>
          }
        />
      </HeaderActionWrapper>
    </BasePopover>
  );
};
