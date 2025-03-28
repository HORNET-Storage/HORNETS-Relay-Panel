import React, { useMemo, ReactNode } from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { capitalize } from '@app/utils/utils';
import { Mention, Notification as NotificationType } from 'api/notifications.api';
import { notificationsSeverities } from 'constants/notificationsSeverities';
import * as S from './NotificationsOverlay.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

interface NotificationsOverlayProps {
  notifications: NotificationType[];
  setNotifications: (state: NotificationType[]) => void;
  markModerationAsRead?: (id: number) => Promise<void>;
  onRefresh?: () => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  markModerationAsRead,
  onRefresh,
  ...props
}) => {
  const { t } = useTranslation();

  const noticesList = useMemo(
    () =>
      notifications.map((notification, index) => {
        const type = notificationsSeverities.find((dbSeverity) => dbSeverity.id === notification.id)?.name;
        const isModerationNotification = !!notification.moderationData;

        // Handle moderation notification specially
        if (isModerationNotification) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const modData = notification.moderationData!;
          return (
            <BaseNotification
              key={`mod-${modData.id}`}
              type="moderation"
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{capitalize('moderation')}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 6px', 
                    background: 'rgba(var(--error-rgb-color), 0.1)', 
                    color: 'var(--error-color)',
                    borderRadius: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {modData.content_type}
                  </span>
                </div>
              }
              description={
                <div>
                  <div>{modData.reason}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light-color)', marginTop: '4px' }}>
                    {new Date(modData.created_at).toLocaleString()}
                  </div>
                  {/* Thumbnail removed - content will be viewable in detail view */}
                  {!modData.is_read && markModerationAsRead && (
                    <BaseButton 
                      type="link" 
                      size="small" 
                      onClick={() => markModerationAsRead(modData.id)}
                      style={{ padding: '4px 0', height: 'auto', marginTop: '4px' }}
                    >
                      {t('moderation.notifications.markAsRead', 'Mark as read')}
                    </BaseButton>
                  )}
                  <div style={{ marginTop: '4px' }}>
                    <Link to="/moderation-notifications" style={{ fontSize: '0.85rem' }}>
                      {t('moderation.notifications.viewDetails', 'View details')}
                    </Link>
                  </div>
                </div>
              }
            />
          );
        }

        // Regular notification
        return (
          <BaseNotification
              key={index}
              type={type || 'warning'}
              title={capitalize(type || 'warning')}
            description={t(notification.description)}
            {...(type === 'mention' && {
              mentionIconSrc: (notification as Mention).userIcon,
              title: (notification as Mention).userName,
              description: (
                <Trans i18nKey={(notification as Mention).description}>
                  <S.LinkBtn type="link" href={(notification as Mention).href}>
                    {
                      { place: t((notification as Mention).place) } as unknown as ReactNode // todo: remove casting
                    }
                  </S.LinkBtn>
                </Trans>
              ),
            })}
          />
        );
      }),
    [notifications, t, markModerationAsRead],
  );

  return (
    <S.NoticesOverlayMenu {...props}>
      <BaseRow gutter={[20, 20]}>
        <BaseCol span={24}>
          {notifications.length > 0 ? (
            <BaseSpace direction="vertical" size={10} split={<S.SplitDivider />}>
              {noticesList}
            </BaseSpace>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📬</div>
              <S.Text style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                {t('header.notifications.noNotifications', 'No notifications')}
              </S.Text>
              <S.Text style={{ display: 'block', color: 'var(--text-light-color)', fontSize: '0.85rem' }}>
                {t('header.notifications.emptyDescription', 'New system notifications will appear here')}
              </S.Text>
            </div>
          )}
        </BaseCol>
        <BaseCol span={24}>
          <BaseRow gutter={[10, 10]}>
            {notifications.length > 0 && (
              <BaseCol span={24}>
                <S.Btn type="ghost" onClick={() => setNotifications([])}>
                  {t('header.notifications.readAll', 'Mark all as read')}
                </S.Btn>
              </BaseCol>
            )}
            <BaseCol span={24}>
              <S.Btn type="ghost" onClick={onRefresh}>
                {t('header.notifications.refresh', 'Refresh')}
              </S.Btn>
            </BaseCol>
            <BaseCol span={24}>
              <S.Btn type="link">
                <Link to="/moderation-notifications">{t('header.notifications.viewAll', 'View all')}</Link>
              </S.Btn>
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </S.NoticesOverlayMenu>
  );
};
