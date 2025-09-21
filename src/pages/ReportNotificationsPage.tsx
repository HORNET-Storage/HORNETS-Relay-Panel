import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import ReportNotifications from '@app/components/report/ReportNotifications';
import { useTranslation } from 'react-i18next';
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';

const ReportNotificationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <DashboardWrapper>
      <PageTitle>{t('report.notifications.pageTitle', 'Content Reports')}</PageTitle>
      <ReportNotifications />
    </DashboardWrapper>
  );
};

export default ReportNotificationsPage;
