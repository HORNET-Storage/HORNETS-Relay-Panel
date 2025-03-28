import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseBadge } from '@app/components/common/BaseBadge/BaseBadge';
import { NotificationsOverlay } from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay';
import { notifications as fetchedNotifications, Notification, Message } from '@app/api/notifications.api';
import { useModerationNotifications } from '@app/hooks/useModerationNotifications';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { useTranslation } from 'react-i18next';

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
    notifications: moderationNotifications, 
    markAsRead: markModerationAsRead,
    fetchNotifications: refreshModerationNotifications
  } = useModerationNotifications();
  
  // Use ref to track if we've processed these notifications before
  const processedModerationIdsRef = useRef<Set<number>>(new Set());
  
  // When moderation notifications change, update the combined notifications list
  useEffect(() => {
    // Check if we have new notifications
    const currentIds = new Set(moderationNotifications.map(n => n.id));
    const hasChanges = moderationNotifications.some(n => !processedModerationIdsRef.current.has(n.id)) ||
      processedModerationIdsRef.current.size !== currentIds.size;
    
    // Only update if there are changes to avoid unnecessary rerenders
    if (hasChanges) {
      const transformedModNotifications = moderationNotifications
        .map(transformModerationToRegular);
      
      setAllNotifications([
        ...fetchedNotifications,
        ...transformedModNotifications
      ]);
      
      // Update processed IDs
      processedModerationIdsRef.current = currentIds;
    }
  }, [moderationNotifications]);
  
  // Refresh all notifications
  const handleRefresh = useCallback(() => {
    refreshModerationNotifications();
  }, [refreshModerationNotifications]);
  
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
  const hasUnreadNotifications = allNotifications.some(notification => {
    // Check if it's a moderation notification first 
    if (notification.moderationData) {
      return !notification.moderationData.is_read;
    }
    
    // For non-moderation notifications - since we're only using moderation ones currently,
    // we can safely return false, but keep this extendable for the future
    return false;
  });

  return (
    <BasePopover
      trigger="click"
      content={
        <div style={{ maxWidth: '360px', minWidth: '300px' }}>
          <NotificationsOverlay 
            notifications={allNotifications} 
            setNotifications={(arr) => {
              // This function wrapper allows us to ignore the parameter and call handleClearAll instead
              handleClearAll();
            }}
            markModerationAsRead={markModerationAsRead}
            onRefresh={handleRefresh}
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
            <BaseBadge dot={hasUnreadNotifications}>
              <BellOutlined />
            </BaseBadge>
          }
        />
      </HeaderActionWrapper>
    </BasePopover>
  );
};
