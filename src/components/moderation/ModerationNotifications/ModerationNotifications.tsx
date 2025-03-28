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
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { EyeOutlined } from '@ant-design/icons';
import { useModerationNotifications } from '@app/hooks/useModerationNotifications';
import { ModerationNotification, ModerationNotificationParams } from '@app/hooks/useModerationNotifications';
import * as S from './ModerationNotifications.styles';

interface ModerationNotificationsProps {
  className?: string;
}

export const ModerationNotifications: React.FC<ModerationNotificationsProps> = ({ className }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread' | 'user'>('unread');
  const [userPubkey, setUserPubkey] = useState<string>('');

  const { 
    notifications, 
    pagination, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useModerationNotifications();
  
  // Fetch unread notifications on component mount
  useEffect(() => {
    fetchNotifications({
      page: 1,
      limit: pagination?.pageSize || 10,
      filter: 'unread'
    });
  }, [fetchNotifications, pagination?.pageSize]);

  const handleFilterChange = (value: unknown) => {
    const filterValue = value as 'all' | 'unread' | 'user';
    setFilter(filterValue);
    
    const params: ModerationNotificationParams = {
      page: 1,
      limit: pagination?.pageSize || 10,
      filter: filterValue
    };
    
    if (filterValue === 'user' && userPubkey) {
      params.pubkey = userPubkey;
    }
    
    fetchNotifications(params);
  };

  const handlePageChange = (page: number) => {
    const params: ModerationNotificationParams = {
      page,
      limit: pagination?.pageSize || 10,
      filter
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
        pubkey: userPubkey
      });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <BaseCard className={className} title={t('moderation.notifications.title', 'Moderation Notifications')} padding="1.25rem">
      <S.FiltersWrapper>
        <BaseRow gutter={[16, 16]} align="middle">
          <BaseCol xs={24} md={8}>
            <BaseSelect 
              value={filter}
              onChange={handleFilterChange}
              options={[
                { value: 'all', label: t('moderation.notifications.filters.all', 'All Notifications') },
                { value: 'unread', label: t('moderation.notifications.filters.unread', 'Unread') },
                { value: 'user', label: t('moderation.notifications.filters.user', 'By User') }
              ]}
            />
          </BaseCol>
          
          {filter === 'user' && (
            <>
              <BaseCol xs={24} md={12}>
                <S.UserInput 
                  placeholder={t('moderation.notifications.userPlaceholder', 'Enter user pubkey')}
                  value={userPubkey}
                  onChange={handleUserPubkeyChange}
                />
              </BaseCol>
              <BaseCol xs={24} md={4}>
                <BaseButton type="primary" onClick={handleUserPubkeyFilter}>
                  {t('moderation.notifications.filter', 'Filter')}
                </BaseButton>
              </BaseCol>
            </>
          )}
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
                  type="error"
                  title={
                    <BaseRow align="middle">
                      <S.ContentTypeTag $type={notification.content_type}>
                        {notification.content_type}
                      </S.ContentTypeTag>
                      {notification.reason}
                    </BaseRow>
                  }
                  description={
                    <S.NotificationContent>
                      <S.NotificationMeta>
                        <S.MetaItem>📅 {formatDate(notification.created_at)}</S.MetaItem>
                        <S.MetaItem>👤 {notification.pubkey.substring(0, 10)}...</S.MetaItem>
                        <S.MetaItem>🔗 {notification.event_id.substring(0, 10)}...</S.MetaItem>
                      </S.NotificationMeta>
                      
                      {notification.thumbnail_url || notification.media_url ? (
                        <S.ContentContainer>
                          <S.ModerationBanner>
                            <EyeOutlined />
                            {t('moderation.notifications.sensitiveContent', 'Sensitive content')}
                          </S.ModerationBanner>
                          
                          {(() => {
                            // Get the media URL
                            const mediaUrl = notification.media_url || notification.thumbnail_url;
                            
                            if (!mediaUrl) {
                              return (
                                <S.MediaError>
                                  {t('moderation.notifications.noMedia', 'No media available')}
                                </S.MediaError>
                              );
                            }
                            
                            // Format the full URL
                            const fullMediaUrl = mediaUrl.startsWith('http') 
                              ? mediaUrl 
                              : `${window.location.origin}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`;
                            
                            // Mark notification as read when media is loaded
                            const handleMediaLoad = () => {
                              if (!notification.is_read) {
                                markAsRead(notification.id);
                              }
                            };
                            
                            const handleMediaError = () => {
                              console.error(`Failed to load media: ${fullMediaUrl}`);
                            };
                            
                            // Render the appropriate media element based on content type
                            return (
                              <S.MediaWrapper>
                                {notification.content_type.includes('image') ? (
                                  <S.StyledImage 
                                    src={fullMediaUrl} 
                                    alt="Moderated content"
                                    onLoad={handleMediaLoad}
                                    onError={handleMediaError}
                                  />
                                ) : notification.content_type.includes('video') ? (
                                  <S.StyledVideo 
                                    controls 
                                    src={fullMediaUrl}
                                    onLoadedData={handleMediaLoad}
                                    onError={handleMediaError}
                                  />
                                ) : notification.content_type.includes('audio') ? (
                                  <S.StyledAudio 
                                    controls 
                                    src={fullMediaUrl}
                                    onLoadedData={handleMediaLoad}
                                    onError={handleMediaError}
                                  />
                                ) : (
                                  <S.MediaError>
                                    {t('moderation.notifications.unsupportedType', 'Unsupported content type')}: {notification.content_type}
                                  </S.MediaError>
                                )}
                              </S.MediaWrapper>
                            );
                          })()}
                        </S.ContentContainer>
                      ) : null}
                      
                      {!notification.is_read && (
                        <S.MarkReadButton 
                          onClick={() => markAsRead(notification.id)}
                          size="small"
                        >
                          {t('moderation.notifications.markAsRead', 'Mark as read')}
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
                    {t('moderation.notifications.readAll', 'Mark all as read')}
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
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
          <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500, fontSize: '18px' }}>
            {t('moderation.notifications.noNotifications', 'No moderation notifications')}
          </S.Text>
          <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            {t('moderation.notifications.emptyDescription', 'Moderation alerts will appear here when content is flagged by the system')}
          </S.Text>
        </div>
      )}
    </BaseCard>
  );
};
