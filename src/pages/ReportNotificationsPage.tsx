import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import ReportNotifications from '@app/components/report/ReportNotifications';
import { useTranslation } from 'react-i18next';

const ReportNotificationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('report.notifications.pageTitle', 'Content Reports')}</PageTitle>
      <ReportNotifications />
    </>
  );
};

export default ReportNotificationsPage;
