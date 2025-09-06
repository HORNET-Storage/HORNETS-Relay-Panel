import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NFTCard } from '@app/components/relay-dashboard/common/NFTCard/NFTCard';
import { TopUpBalanceButton } from './components/TopUpBalanceButton/TopUpBalanceButton';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './Balance.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import useBalanceData from '@app/hooks/useBalanceData';
import { formatBalance } from '@app/utils/balanceFormatter';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import SendButton from './components/SendButton/SendButton';

export const Balance: React.FC = () => {
  const { balanceData, transactions, isLoading } = useBalanceData();
  const [displayUSD, setDisplayUSD] = useState(true);

  const userId = useAppSelector((state) => state.user.user?.id);

  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="liquid-loader-container">
        <div className="liquid-loader"></div>
        <p>Loading Balance...</p>
      </div>
    );
  }

  const handleSwitchChange = () => {
    setDisplayUSD(!displayUSD);
  };

  return (
    <div className="liquid-dashboard-card">
      <BaseRow>
        <BaseCol span={24}>
          <S.TitleText level={2} className="neon-text">{t('nft.yourBalance')}</S.TitleText>
        </BaseCol>

        <BaseCol span={24}>
          <NFTCard isSider className="liquid-glass-card">
            <BaseRow justify="space-between" align={'middle'}>
              <BaseCol>
                <S.TitleBalanceText level={3} className="liquid-glow-text">
                  {displayUSD
                    ? balanceData &&
                      getCurrencyPrice(formatNumberWithCommas(balanceData.balance_usd), CurrencyTypeEnum.USD, false)
                    : balanceData && formatBalance(balanceData.latest_balance ?? 0)}
                </S.TitleBalanceText>
              </BaseCol>

              <BaseCol>
                <BaseSwitch
                  className={`balanceSwitch liquid-switch ${displayUSD ? 'usd-active' : ''}`}
                  checked={displayUSD}
                  onChange={handleSwitchChange}
                />
                <S.LabelSpan className="liquid-text">{displayUSD ? 'USD' : 'Sats'}</S.LabelSpan>
              </BaseCol>
            </BaseRow>

            <BaseRow gutter={[30, 30]}>
              <BaseCol span={24}>
                <BaseRow gutter={[14, 14]}>
                  <BaseCol span={24}>
                    <S.SubtitleBalanceText className="liquid-secondary-text">
                      {displayUSD
                        ? balanceData && formatBalance(balanceData.latest_balance ?? 0)
                        : balanceData &&
                          getCurrencyPrice(formatNumberWithCommas(balanceData.balance_usd), CurrencyTypeEnum.USD, false)}
                    </S.SubtitleBalanceText>
                  </BaseCol>
                </BaseRow>
              </BaseCol>
              <S.BalanceButtonsContainers gutter={[0,20]}>
                <BaseCol span={24}>
                  <SendButton />
                </BaseCol>
                <BaseCol span={24}>
                  <TopUpBalanceButton />
                </BaseCol>
              </S.BalanceButtonsContainers>
            </BaseRow>
          </NFTCard>
        </BaseCol>
      </BaseRow>
    </div>
  );
};