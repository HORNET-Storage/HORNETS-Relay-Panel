import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { ModerationNotifications } from '@app/components/moderation/ModerationNotifications/ModerationNotifications';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const ModerationNotificationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('moderation.notifications.pageTitle', 'Moderation Notifications')}</PageTitle>
      <ModerationNotifications />
    </>
  );
};

export default ModerationNotificationsPage;
