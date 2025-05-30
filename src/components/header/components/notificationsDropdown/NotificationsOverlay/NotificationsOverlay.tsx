import React, { useMemo, ReactNode } from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BaseNotification } from '@app/components/common/BaseNotification/BaseNotification';
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
  onRefresh?: () => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notifications,
  setNotifications,
  onRefresh,
  ...props
}) => {
  const { t } = useTranslation();

  const noticesList = useMemo(
    () =>
      notifications.map((notification, index) => {
        const type = notificationsSeverities.find((dbSeverity) => dbSeverity.id === notification.id)?.name;

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
    [notifications, t],
  );

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
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </S.NoticesOverlayMenu>
  );
};
