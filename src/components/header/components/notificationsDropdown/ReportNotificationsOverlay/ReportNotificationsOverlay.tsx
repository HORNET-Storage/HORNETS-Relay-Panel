import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ReportNotification } from '@app/api/reportNotifications.api';
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as S from '../NotificationsOverlay/NotificationsOverlay.styles';

interface ReportNotificationsOverlayProps {
  notifications: ReportNotification[];
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const ReportNotificationsOverlay: React.FC<ReportNotificationsOverlayProps> = ({
  notifications,
  markAsRead,
  markAllAsRead,
  onRefresh,
  ...props
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
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

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const noticesList = notifications.map((notification) => (
    <BaseNotification
      key={notification.id}
      type="warning"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            background: notification.report_type === 'impersonation' ?
              'rgba(6, 182, 212, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: notification.report_type === 'impersonation' ?
              'rgba(6, 182, 212, 0.9)' : 'rgba(245, 158, 11, 0.85)',
            borderRadius: '10px',
            textTransform: 'uppercase'
          }}>
            {notification.report_type}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            {t('report.notifications.reportedContent', 'Reported Content')}
          </span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            background: notification.report_type === 'impersonation' ?
              'rgba(6, 182, 212, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: notification.report_type === 'impersonation' ?
              'rgba(6, 182, 212, 0.9)' : 'rgba(245, 158, 11, 0.85)',
            borderRadius: '10px'
          }}>
            {notification.report_count}
          </span>
        </div>
      }
      description={
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light-color)', marginBottom: '4px' }}>
            {formatDate(notification.created_at)}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>{t('report.notifications.reason', 'Reason')}: </strong>
            {notification.report_content}
          </div>

          <div style={{ marginBottom: '4px' }}>
            <strong>{t('report.notifications.reporter', 'Reporter')}: </strong>
            <span style={{ fontFamily: 'monospace' }}>
              {notification.reporter_pubkey.substring(0, 10)}...
            </span>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>{t('report.notifications.author', 'Content Author')}: </strong>
            <span style={{ fontFamily: 'monospace' }}>
              {notification.pubkey.substring(0, 10)}...
            </span>
          </div>

          {!notification.is_read && (
            <BaseButton
              type="link"
              size="small"
              onClick={() => markAsRead(notification.id)}
              style={{ padding: '4px 0', height: 'auto', marginTop: '4px' }}
            >
              {t('report.notifications.markAsRead', 'Mark as read')}
            </BaseButton>
          )}

          <div style={{ marginTop: '4px' }}>
            <Link to="/report-notifications" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('report.notifications.viewDetails', 'View details')}
            </Link>
          </div>
        </div>
      }
    />
  ));

  return (
    <S.NoticesOverlayMenu {...props}>
      <BaseRow gutter={[20, 20]}>
        <BaseCol span={24}>
          {notifications.length > 0 ? (
            <S.NotificationsList>
              <BaseSpace direction="vertical" size={10} split={<S.SplitDivider />}>
                {noticesList}
              </BaseSpace>
            </S.NotificationsList>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚨</div>
              <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                {t('report.notifications.noNotifications', 'No content reports')}
              </S.Text>
              <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '0.85rem' }}>
                {t('report.notifications.emptyDescription', 'Reports from users will appear here when content is flagged')}
              </S.Text>
            </div>
          )}
        </BaseCol>
        <BaseCol span={24}>
          <BaseRow gutter={[10, 10]}>
            {notifications.some(n => !n.is_read) && (
              <BaseCol span={24}>
                <S.Btn type="ghost" onClick={handleMarkAllAsRead}>
                  {t('report.notifications.readAll', 'Mark all as read')}
                </S.Btn>
              </BaseCol>
            )}
            <BaseCol span={24}>
              <S.Btn type="ghost" onClick={onRefresh}>
                {t('report.notifications.refresh', 'Refresh')}
              </S.Btn>
            </BaseCol>
            <BaseCol span={24}>
              <S.Btn type="link">
                <Link to="/report-notifications">{t('report.notifications.viewAll', 'View all')}</Link>
              </S.Btn>
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </S.NoticesOverlayMenu>
  );
};
