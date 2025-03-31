import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BlockedPubkeys } from '@app/components/blocked-pubkeys';

const BlockedPubkeysPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.blockedPubkeys', 'Blocked Pubkeys')}</PageTitle>
      <BlockedPubkeys />
    </>
  );
};

export default BlockedPubkeysPage;
