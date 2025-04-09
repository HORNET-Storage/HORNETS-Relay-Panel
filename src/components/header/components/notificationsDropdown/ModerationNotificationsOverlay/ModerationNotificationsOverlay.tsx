import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { useModerationNotifications } from '@app/hooks/useModerationNotifications';
import { notificationController } from '@app/controllers/notificationController';
import * as S from '../NotificationsOverlay/NotificationsOverlay.styles';
import { ContentTypeTag } from '@app/components/moderation/ModerationNotifications/ModerationNotifications.styles';

export const ModerationNotificationsOverlay: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, markAllAsRead, markAsRead, isLoading } = useModerationNotifications();

  const handleMarkAsRead = useCallback((id: number) => {
    markAsRead(id);
  }, [markAsRead]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <BaseSpace direction="vertical" size={24} style={{ width: '100%' }}>
      <BaseCol span={24}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ marginBottom: '8px' }}>⏳</div>
            <S.Text>
              {t('moderation.notifications.loading', 'Loading notifications...')}
            </S.Text>
          </div>
        ) : notifications.length > 0 ? (
          <BaseSpace direction="vertical" size={10} split={<S.SplitDivider />}>
            {notifications.slice(0, 5).map((notification) => (
              <BaseNotification
                key={notification.id}
                type="error"
                title={
                  <BaseRow align="middle">
                    <ContentTypeTag $type={notification.content_type}>
                      {notification.content_type}
                    </ContentTypeTag>
                    {notification.reason}
                  </BaseRow>
                }
                description={
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light-color)' }}>
                      {formatDate(notification.created_at)}
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <span style={{ color: 'var(--text-light-color)' }}>User: </span>
                      {notification.pubkey.substring(0, 10)}...
                      <BaseButton 
                        type="link" 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(notification.pubkey);
                          notificationController.success({
                            message: 'Pubkey copied to clipboard'
                          });
                        }}
                        style={{ padding: '0 4px', height: 'auto' }}
                      >
                        📋
                      </BaseButton>
                    </div>
                    {notification.thumbnail_url && (
                      <div style={{ marginTop: '0.5rem', maxWidth: '100px' }}>
                        <img 
                          src={notification.thumbnail_url} 
                          alt="Content thumbnail" 
                          style={{ 
                            width: '100%', 
                            height: 'auto', 
                            borderRadius: '4px', 
                            objectFit: 'cover' 
                          }} 
                        />
                      </div>
                    )}
                    {!notification.is_read && (
                      <BaseButton type="link" size="small" onClick={() => handleMarkAsRead(notification.id)}>
                        {t('moderation.notifications.markAsRead', 'Mark as read')}
                      </BaseButton>
                    )}
                  </div>
                }
              />
            ))}
          </BaseSpace>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
            <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
              {t('moderation.notifications.noNotifications', 'No moderation notifications')}
            </S.Text>
            <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '0.85rem' }}>
              {t('moderation.notifications.emptyDescription', 'Moderation alerts will appear here when content is flagged')}
            </S.Text>
          </div>
        )}
        
        <BaseRow gutter={[10, 10]} style={{ marginTop: '0.75rem' }}>
          {notifications.some(n => !n.is_read) && (
            <BaseCol span={12}>
              <S.Btn type="ghost" onClick={() => markAllAsRead()}>
                {t('moderation.notifications.readAll', 'Mark all as read')}
              </S.Btn>
            </BaseCol>
          )}
          <BaseCol span={12}>
            <S.Btn type="link">
              <Link to="/moderation-notifications">{t('moderation.notifications.viewAll', 'View all')}</Link>
            </S.Btn>
          </BaseCol>
        </BaseRow>
      </BaseCol>
    </BaseSpace>
  );
};
