import React, { useState, useEffect, useRef } from 'react';
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
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useModerationNotifications } from '@app/hooks/useModerationNotifications';
import { ModerationNotification, ModerationNotificationParams } from '@app/hooks/useModerationNotifications';
import { BlockedEventResponse } from '@app/api/moderationNotifications.api';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './ModerationNotifications.styles';

interface ModerationNotificationsProps {
  className?: string;
}

export const ModerationNotifications: React.FC<ModerationNotificationsProps> = ({ className }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread' | 'user'>('unread');
  const [userPubkey, setUserPubkey] = useState<string>('');

  // State for event details modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [blockedEventDetails, setBlockedEventDetails] = useState<BlockedEventResponse | null>(null);
  const [isEventLoading, setIsEventLoading] = useState(false);
  
  // Ref for the container to control scroll position
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Flag to track if we need to reset scroll position
  const [shouldResetScroll, setShouldResetScroll] = useState(false);

  const { 
    notifications, 
    pagination, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    getBlockedEvent,
    unblockEvent,
    deleteEvent
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
    
    // Only fetch immediately for "all" and "unread" filters
    // For "user" filter, wait for the user to click the Filter button
    if (filterValue !== 'user') {
      fetchNotifications({
        page: 1,
        limit: pagination?.pageSize || 10,
        filter: filterValue
      });
    }
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

  // Function to handle viewing event details
  const handleViewEvent = async (eventId: string) => {
    setSelectedEventId(eventId);
    setIsEventLoading(true);
    
    try {
      const details = await getBlockedEvent(eventId);
      setBlockedEventDetails(details);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      notificationController.error({
        message: 'Failed to fetch event details',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsEventLoading(false);
    }
  };

  // Function to handle unblocking an event
  const handleUnblock = async () => {
    if (!selectedEventId) return;
    
    setIsEventLoading(true);
    
    try {
      const result = await unblockEvent(selectedEventId);
      if (result.success) {
        notificationController.success({
          message: 'Event unblocked successfully',
          description: 'The event has been unblocked and will now be visible to users'
        });
        setIsModalVisible(false);
        
        // Refresh the notifications list
        fetchNotifications({
          page: pagination?.currentPage || 1,
          limit: pagination?.pageSize || 10,
          filter
        });
      }
    } catch (error) {
      console.error('Failed to unblock event:', error);
      notificationController.error({
        message: 'Failed to unblock event',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsEventLoading(false);
    }
  };

  // Function to handle permanent deletion of an event
  const handleDelete = async (eventId: string) => {
    setIsEventLoading(true);
    
    try {
      const result = await deleteEvent(eventId);
      if (result.success) {
        notificationController.success({
          message: 'Event deleted permanently',
          description: 'The event has been permanently removed from the system'
        });
        
        // Close modal if it was open
        if (isModalVisible) {
          setIsModalVisible(false);
        }
        
        // Set flag to reset scroll position after data is fetched
        setShouldResetScroll(true);
        
        // Refresh the notifications list
        fetchNotifications({
          page: pagination?.currentPage || 1,
          limit: pagination?.pageSize || 10,
          filter
        });
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      notificationController.error({
        message: 'Failed to delete event',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsEventLoading(false);
    }
  };
  
  // Effect to reset scroll position when notifications change or after deletion
  useEffect(() => {
    // Reset scroll position when notifications change and shouldResetScroll is true
    if (shouldResetScroll && containerRef.current) {
      // Reset scroll position to top
      containerRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
      
      // Reset the flag
      setShouldResetScroll(false);
    }
  }, [notifications, shouldResetScroll]);

  // Confirmation dialog before deletion
  const confirmDelete = (eventId: string) => {
    Modal.confirm({
      title: t('moderation.notifications.confirmDelete', 'Permanently Delete Event'),
      content: t('moderation.notifications.confirmDeleteMessage', 'This action cannot be undone. The event will be permanently removed from the system.'),
      okText: t('moderation.notifications.delete', 'Delete'),
      okType: 'danger',
      cancelText: t('common.cancel', 'Cancel'),
      onOk: () => handleDelete(eventId)
    });
  };

  return (
    <div ref={containerRef}>
      <BaseCard 
        className={className} 
        title={t('moderation.notifications.title', 'Moderation Notifications')} 
        padding="1.25rem"
      >
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
                                Copy Pubkey
                              </S.CopyButton>
                            </S.MetaValue>
                          </S.MetaItem>
                          
                          <S.MetaItem>
                            <S.MetaLabel>Event ID:</S.MetaLabel>
                            <S.MetaValue>
                              {notification.event_id.substring(0, 10)}...
                              <S.CopyButton 
                                onClick={() => {
                                  navigator.clipboard.writeText(notification.event_id);
                                  notificationController.success({
                                    message: 'Event ID copied to clipboard'
                                  });
                                }}
                              >
                                Copy Event ID
                              </S.CopyButton>
                            </S.MetaValue>
                          </S.MetaItem>
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
                        
                        <S.ActionButtons>
                          {!notification.is_read && (
                            <S.MarkReadButton 
                              onClick={() => markAsRead(notification.id)}
                              size="small"
                            >
                              {t('moderation.notifications.markAsRead', 'Mark as read')}
                            </S.MarkReadButton>
                          )}
                          <S.ViewEventButton
                            onClick={() => handleViewEvent(notification.event_id)}
                            size="small"
                            icon={<EyeOutlined />}
                          >
                            {t('moderation.notifications.viewEvent', 'View Full Event')}
                          </S.ViewEventButton>
                          <BaseButton
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => confirmDelete(notification.event_id)}
                          >
                            {t('moderation.notifications.delete', 'Delete Permanently')}
                          </BaseButton>
                        </S.ActionButtons>
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

        {/* Event Details Modal */}
        <BaseModal
          title={t('moderation.notifications.eventDetails', 'Blocked Event Details')}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <BaseButton
                  key="delete"
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  loading={isEventLoading}
                  onClick={() => selectedEventId && confirmDelete(selectedEventId)}
                >
                  {t('moderation.notifications.delete', 'Delete Permanently')}
                </BaseButton>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <BaseButton key="close" onClick={() => setIsModalVisible(false)}>
                  {t('common.close', 'Close')}
                </BaseButton>
                <BaseButton
                  key="unblock"
                  type="primary"
                  loading={isEventLoading}
                  onClick={handleUnblock}
                >
                  {t('moderation.notifications.unblock', 'Unblock Event')}
                </BaseButton>
              </div>
            </div>
          }
          size="large"
          bodyStyle={{ padding: '16px', maxHeight: '70vh', overflow: 'auto' }}
        >
          {blockedEventDetails ? (
            <S.EventDetailsContainer>
              <S.EventSection>
                <S.SectionTitle>{t('moderation.notifications.moderationDetails', 'Moderation Details')}</S.SectionTitle>
                <S.DetailItem>
                  <S.DetailLabel>{t('moderation.notifications.reason', 'Reason')}:</S.DetailLabel>
                  <S.DetailValue>{blockedEventDetails.moderation_details.reason}</S.DetailValue>
                </S.DetailItem>
                <S.DetailItem>
                  <S.DetailLabel>{t('moderation.notifications.contentType', 'Content Type')}:</S.DetailLabel>
                  <S.DetailValue>{blockedEventDetails.moderation_details.content_type}</S.DetailValue>
                </S.DetailItem>
                <S.DetailItem>
                  <S.DetailLabel>{t('moderation.notifications.date', 'Date')}:</S.DetailLabel>
                  <S.DetailValue>{formatDate(blockedEventDetails.moderation_details.created_at)}</S.DetailValue>
                </S.DetailItem>
              </S.EventSection>
              
              <S.EventSection>
                <S.SectionTitle>{t('moderation.notifications.eventContent', 'Event Content')}</S.SectionTitle>
                {blockedEventDetails.event && (
                  <>
                    <S.DetailItem>
                      <S.DetailLabel>{t('moderation.notifications.pubkey', 'Pubkey')}:</S.DetailLabel>
                      <S.DetailValue>{blockedEventDetails.event.pubkey}</S.DetailValue>
                    </S.DetailItem>
                    <S.DetailItem>
                      <S.DetailLabel>{t('moderation.notifications.kind', 'Kind')}:</S.DetailLabel>
                      <S.DetailValue>{blockedEventDetails.event.kind}</S.DetailValue>
                    </S.DetailItem>
                    <S.DetailItem>
                      <S.DetailLabel>{t('moderation.notifications.content', 'Content')}:</S.DetailLabel>
                      <S.EventContent>
                        {blockedEventDetails.event.content}
                      </S.EventContent>
                    </S.DetailItem>
                    
                    {blockedEventDetails.moderation_details.media_url && (
                      <S.MediaContainer>
                        <S.ModerationBanner>
                          <EyeOutlined />
                          {t('moderation.notifications.sensitiveContent', 'Sensitive content')}
                        </S.ModerationBanner>
                        
                        {(() => {
                          const mediaUrl = blockedEventDetails.moderation_details.media_url;
                          const fullMediaUrl = mediaUrl.startsWith('http') 
                            ? mediaUrl 
                            : `${window.location.origin}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`;
                          
                          const contentType = blockedEventDetails.moderation_details.content_type;
                          
                          return (
                            <S.MediaWrapper>
                              {contentType.includes('image') ? (
                                <S.StyledImage 
                                  src={fullMediaUrl} 
                                  alt="Moderated content"
                                />
                              ) : contentType.includes('video') ? (
                                <S.StyledVideo 
                                  controls 
                                  src={fullMediaUrl}
                                />
                              ) : contentType.includes('audio') ? (
                                <S.StyledAudio 
                                  controls 
                                  src={fullMediaUrl}
                                />
                              ) : (
                                <S.MediaError>
                                  {t('moderation.notifications.unsupportedType', 'Unsupported content type')}: {contentType}
                                </S.MediaError>
                              )}
                            </S.MediaWrapper>
                          );
                        })()}
                      </S.MediaContainer>
                    )}
                  </>
                )}
              </S.EventSection>
            </S.EventDetailsContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>⏳</div>
              <S.Text style={{ fontSize: '16px' }}>
                {t('common.loading', 'Loading...')}
              </S.Text>
            </div>
          )}
        </BaseModal>
      </BaseCard>
    </div>
  );
};
