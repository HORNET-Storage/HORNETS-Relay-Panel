import React from 'react';
import { PaymentNotifications } from '@app/components/payment/PaymentNotifications';
import { DashboardWrapper } from '@app/pages/DashboardPages/DashboardPage.styles';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useTranslation } from 'react-i18next';

const PaymentNotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <DashboardWrapper>
      <PageTitle>{t('payment.notifications.title', 'Payment Notifications')}</PageTitle>
      <PaymentNotifications />
    </DashboardWrapper>
  );
};

export default PaymentNotificationsPage;
