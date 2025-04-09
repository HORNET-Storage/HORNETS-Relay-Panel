import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseBadge } from '@app/components/common/BaseBadge/BaseBadge';
import { NotificationsOverlay } from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay';
import { PaymentNotificationsOverlay } from '@app/components/header/components/notificationsDropdown/PaymentNotificationsOverlay';
import ReportNotificationsOverlay from '@app/components/header/components/notificationsDropdown/ReportNotificationsOverlay';
import { notifications as fetchedNotifications, Notification, Message } from '@app/api/notifications.api';
import { useModerationNotifications } from '@app/hooks/useModerationNotifications';
import { usePaymentNotifications } from '@app/hooks/usePaymentNotifications';
import { useReportNotifications } from '@app/hooks/useReportNotifications';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

// Create a map to transform moderation notifications into regular notifications
const transformModerationToRegular = (modNotification: any): Message => ({
  id: 3, // moderation type (using same ID as error but will use moderation display type)
  description: `moderation.notification.${modNotification.content_type}`,
  moderationData: {
    id: modNotification.id,
    pubkey: modNotification.pubkey,
    event_id: modNotification.event_id,
    reason: modNotification.reason,
    created_at: modNotification.created_at,
    is_read: modNotification.is_read,
    content_type: modNotification.content_type,
    media_url: modNotification.media_url,
    thumbnail_url: modNotification.thumbnail_url
  }
});

export const NotificationsDropdown: React.FC = () => {
  const { t } = useTranslation();
  const [allNotifications, setAllNotifications] = useState<Notification[]>(fetchedNotifications);
  const [isOpened, setOpened] = useState(false);
  
  const { 
    notifications: allModerationNotifications, 
    markAsRead: markModerationAsRead,
    fetchNotifications: refreshModerationNotifications
  } = useModerationNotifications();
  
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
  
  // Filter to only show unread moderation notifications in the dropdown
  const moderationNotifications = allModerationNotifications.filter(notification => !notification.is_read);
  
  // Filter to only show unread notifications in the dropdown
  const paymentNotifications = allPaymentNotifications.filter(notification => !notification.is_read);

  // Filter to only show unread report notifications in the dropdown
  const reportNotifications = allReportNotifications.filter(notification => !notification.is_read);
  
  // Use ref to track if we've processed these notifications before
  const processedModerationIdsRef = useRef<Set<number>>(new Set());
  
  // When moderation notifications change, update the combined notifications list
  useEffect(() => {
    // Check if we have new notifications
    const currentIds = new Set(allModerationNotifications.map(n => n.id));
    const hasChanges = allModerationNotifications.some(n => !processedModerationIdsRef.current.has(n.id)) ||
      processedModerationIdsRef.current.size !== currentIds.size;
    
    // Only update if there are changes to avoid unnecessary rerenders
    if (hasChanges) {
      // Only transform and show unread notifications
      const transformedModNotifications = allModerationNotifications
        .filter(notification => !notification.is_read)
        .map(transformModerationToRegular);
      
      setAllNotifications([
        ...fetchedNotifications,
        ...transformedModNotifications
      ]);
      
      // Update processed IDs
      processedModerationIdsRef.current = currentIds;
    }
  }, [allModerationNotifications]);
  
  // Initialize all notification types
  useEffect(() => {
    refreshModerationNotifications({ filter: 'unread' });
    refreshPaymentNotifications({ filter: 'unread' });
    refreshReportNotifications({ filter: 'unread' });
  }, [refreshModerationNotifications, refreshPaymentNotifications, refreshReportNotifications]);
  
  // Refresh all notifications, only showing unread ones
  const handleRefresh = useCallback(() => {
    refreshModerationNotifications({ filter: 'unread' });
    refreshPaymentNotifications({ filter: 'unread' });
    refreshReportNotifications({ filter: 'unread' });
  }, [refreshModerationNotifications, refreshPaymentNotifications, refreshReportNotifications]);
  
  // Handle clearing all notifications, including moderation ones
  const handleClearAll = useCallback(() => {
    // For regular notifications
    setAllNotifications([]);
    
    // Mark all moderation notifications as read
    moderationNotifications.forEach(notification => {
      if (!notification.is_read) {
        markModerationAsRead(notification.id);
      }
    });
  }, [moderationNotifications, markModerationAsRead]);
  
  // Check specifically for unread notifications
  const hasUnreadModerationNotifications = moderationNotifications.some(notification => !notification.is_read);
  const hasUnreadPaymentNotifications = paymentNotifications.some(notification => !notification.is_read);
  const hasUnreadReportNotifications = reportNotifications.some(notification => !notification.is_read);
  const hasUnreadNotifications = hasUnreadModerationNotifications || hasUnreadPaymentNotifications || hasUnreadReportNotifications;
  
  // Count unread notifications
  const unreadModerationCount = moderationNotifications.filter(notification => !notification.is_read).length;
  const unreadPaymentCount = paymentNotifications.filter(notification => !notification.is_read).length;
  const unreadReportCount = reportNotifications.filter(notification => !notification.is_read).length;
  const totalUnreadCount = unreadModerationCount + unreadPaymentCount + unreadReportCount;

  // Handle clearing all payment notifications
  const handleClearAllPayments = useCallback(() => {
    return markAllPaymentsAsRead();
  }, [markAllPaymentsAsRead]);

  // Handle clearing all report notifications
  const handleClearAllReports = useCallback(() => {
    return markAllReportsAsRead();
  }, [markAllReportsAsRead]);

  // Get translated tab names
  const moderationLabel = t('moderation.notifications.title', 'Moderation');
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
          {moderationLabel}
          {unreadModerationCount > 0 && (
            <BaseBadge count={unreadModerationCount} size="small" style={{ marginLeft: '5px' }} />
          )}
        </span>
      ),
      children: (
        <div style={tabContentStyle}>
          <NotificationsOverlay 
          notifications={allNotifications} 
          setNotifications={(arr) => {
            // This function wrapper allows us to ignore the parameter and call handleClearAll instead
            handleClearAll();
            return Promise.resolve();
          }}
          markModerationAsRead={markModerationAsRead}
          onRefresh={() => {
            refreshModerationNotifications({ filter: 'unread' });
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
      key: '3',
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
