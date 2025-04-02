import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Typography, Descriptions, Divider } from 'antd';
import { notification } from 'antd';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BasePagination } from '@app/components/common/BasePagination/BasePagination';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { DeleteOutlined, EyeOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useReportNotifications } from '@app/hooks/useReportNotifications';
import { ReportNotification, ReportNotificationParams } from '@app/api/reportNotifications.api';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './ReportNotifications.styles';
import { NostrEvent } from '@app/api/reportNotifications.api';

const { confirm } = Modal;
const { Paragraph, Text } = Typography;

interface ReportNotificationsProps {
  className?: string;
}

export const ReportNotifications: React.FC<ReportNotificationsProps> = ({ className }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [reportedEvent, setReportedEvent] = useState<NostrEvent | null>(null);
  const [currentNotification, setCurrentNotification] = useState<ReportNotification | null>(null);

  const {
    notifications,
    pagination,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteReportedEvent,
    getReportedEventContent
  } = useReportNotifications();

  // Fetch unread notifications on component mount
  useEffect(() => {
    fetchNotifications({
      page: 1,
      limit: pagination?.pageSize || 10,
      filter: 'unread'
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
    const params: ReportNotificationParams = {
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

  const handleViewContent = async (reportNotification: ReportNotification) => {
    try {
      if (!reportNotification.is_read) {
        await markAsRead(reportNotification.id);
      }
      
      const result = await getReportedEventContent(reportNotification.event_id);
      if (result && result.event) {
        setReportedEvent(result.event);
        setCurrentNotification(reportNotification);
        setViewModalVisible(true);
      } else {
        notification.error({
          message: 'Error',
          description: 'Could not retrieve event content'
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load content'
      });
    }
  };

  const handleDeleteEvent = (reportNotification: ReportNotification) => {
    confirm({
      title: 'Are you sure you want to delete this content?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. The content will be permanently removed from the relay.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const success = await deleteReportedEvent(reportNotification.event_id);
          if (success) {
            if (viewModalVisible) {
              setViewModalVisible(false);
            }
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to delete content'
          });
        }
      }
    });
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'nudity':
      case 'illegal':
        return <ExclamationCircleOutlined />;
      case 'spam':
      case 'profanity':
      case 'impersonation':
        return <WarningOutlined />;
      default:
        return <WarningOutlined />;
    }
  };

  return (
    <BaseCard className={className} title={t('report.notifications.title', 'Report Notifications')} padding="1.25rem">
      <S.FiltersWrapper>
        <BaseRow gutter={[16, 16]} align="middle">
          <BaseCol xs={24} md={8}>
            <BaseSelect
              value={filter}
              onChange={handleFilterChange}
              options={[
                { value: 'all', label: t('report.notifications.filters.all', 'All Notifications') },
                { value: 'unread', label: t('report.notifications.filters.unread', 'Unread') }
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
                  type="warning"
                  title={
                    <BaseRow align="middle">
                      <S.ReportTypeTag $type={notification.report_type}>
                        {notification.report_type}
                      </S.ReportTypeTag>
                      {notification.report_content}
                      <S.ReportCountBadge count={notification.report_count} />
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
                          <S.MetaLabel>Content Author:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.pubkey.substring(0, 10)}...
                            <S.CopyButton
                              onClick={() => {
                                navigator.clipboard.writeText(notification.pubkey);
                                notificationController.success({
                                  message: 'Author pubkey copied to clipboard'
                                });
                              }}
                            >
                              Copy
                            </S.CopyButton>
                          </S.MetaValue>
                        </S.MetaItem>

                        <S.MetaItem>
                          <S.MetaLabel>Reporter:</S.MetaLabel>
                          <S.MetaValue>
                            {notification.reporter_pubkey.substring(0, 10)}...
                            <S.CopyButton
                              onClick={() => {
                                navigator.clipboard.writeText(notification.reporter_pubkey);
                                notificationController.success({
                                  message: 'Reporter pubkey copied to clipboard'
                                });
                              }}
                            >
                              Copy
                            </S.CopyButton>
                          </S.MetaValue>
                        </S.MetaItem>
                      </S.NotificationMeta>

                      <S.ContentContainer>
                        <S.ReportBanner $reportType={notification.report_type}>
                          {getReportTypeIcon(notification.report_type)}
                          {t('report.notifications.reportedContent', 'Reported Content')}
                        </S.ReportBanner>

                        <S.ActionsContainer>
                          <S.ViewButton 
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewContent(notification)}
                          >
                            View Content
                          </S.ViewButton>
                          <S.DeleteButton
                            type="primary" 
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteEvent(notification)}
                          >
                            Delete Content
                          </S.DeleteButton>
                        </S.ActionsContainer>
                      </S.ContentContainer>

                      {!notification.is_read && (
                        <S.MarkReadButton
                          onClick={() => markAsRead(notification.id)}
                          size="small"
                        >
                          {t('report.notifications.markAsRead', 'Mark as read')}
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
                    {t('report.notifications.readAll', 'Mark all as read')}
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
            {t('report.notifications.noNotifications', 'No report notifications')}
          </S.Text>
          <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            {t('report.notifications.emptyDescription', 'Content reports from users will appear here')}
          </S.Text>
        </div>
      )}

      {/* Event content modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <S.ReportTypeTag $type={currentNotification?.report_type || 'other'}>
              {currentNotification?.report_type || 'Report'}
            </S.ReportTypeTag>
            <span>Reported Content</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              if (currentNotification) {
                handleDeleteEvent(currentNotification);
              }
            }}
          >
            Delete Content
          </Button>
        ]}
        width={700}
      >
        {reportedEvent ? (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Author">{reportedEvent.pubkey}</Descriptions.Item>
              <Descriptions.Item label="Created">{new Date(reportedEvent.created_at * 1000).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Kind">{reportedEvent.kind}</Descriptions.Item>
              <Descriptions.Item label="Report Type">{currentNotification?.report_type}</Descriptions.Item>
              <Descriptions.Item label="Report Count">{currentNotification?.report_count}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Text strong>Content:</Text>
            <S.ContentPreviewContainer>
              {reportedEvent.content}
            </S.ContentPreviewContainer>
            {reportedEvent.tags && reportedEvent.tags.length > 0 && (
              <>
                <Text strong>Tags:</Text>
                <ul>
                  {reportedEvent.tags.map((tag, index) => (
                    <li key={index}>{JSON.stringify(tag)}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '16px' }}>⏳</div>
            <Paragraph>Loading content...</Paragraph>
          </div>
        )}
      </Modal>
    </BaseCard>
  );
};
