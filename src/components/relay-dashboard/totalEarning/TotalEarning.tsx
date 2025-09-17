import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { NFTCard } from '@app/components/relay-dashboard/common/NFTCard/NFTCard';
import { TotalEarningChart } from '@app/components/relay-dashboard/totalEarning/TotalEarningChart/TotalEarningChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './TotalEarning.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useBitcoinRates } from '@app/hooks/useBitcoinRates';

export const TotalEarning: React.FC = () => {
  const { t } = useTranslation();
  const { rates: bitcoinRates, isLoading, error } = useBitcoinRates();

  const { totalEarningData, days } = useMemo(() => {
    const earningData = {
      data: bitcoinRates.map((item) => item.usd_value),
    };
    const daysData = bitcoinRates.map((item) => Dates.getDate(item.date).format('L LTS'));

    return {
      totalEarningData: earningData,
      days: daysData,
    };
  }, [bitcoinRates]);

  const latestRate = bitcoinRates.length > 0 ? Number(bitcoinRates[bitcoinRates.length - 1]?.usd_value) : undefined;
  const previousRate = bitcoinRates.length > 1 ? Number(bitcoinRates[bitcoinRates.length - 2]?.usd_value) : undefined;
  const isIncreased = latestRate && previousRate ? latestRate > previousRate : false;
  const rateDifference = latestRate && previousRate ? ((latestRate - previousRate) / previousRate) * 100 : 0;


  if (isLoading) {
    return (
      <div className="liquid-loading-container">
        <div className="liquid-loader"></div>
        <p className="liquid-text">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="liquid-error-container">
        <h3 className="liquid-glow-text">{t('common.error')}:</h3>
        <span className="liquid-text">{error}</span>
      </div>
    );
  }

  const formattedLatestRate = latestRate !== undefined && !isNaN(latestRate) ? Math.round(latestRate) : 0;
  return (
    <NFTCard isSider className="liquid-glass-card">
      <BaseRow gutter={[14, 14]}>
        <BaseCol span={24}>
          <BaseRow wrap={false} justify="space-between">
            <BaseCol>
              <S.Title level={3} className="liquid-glow-text">{t('nft.bitcoinPrice')}</S.Title>
            </BaseCol>
            <BaseCol>
              <div className={`liquid-rate-indicator ${isIncreased ? 'success' : 'error'}`}>
                {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />}
                <span>{rateDifference.toFixed(2)}</span>
                <span className="percentage-symbol">%</span>
              </div>
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <BaseCol span={24}>
          <S.Text className="liquid-price-display">
            {getCurrencyPrice(`${formatNumberWithCommas(formattedLatestRate)}`, CurrencyTypeEnum.USD)}
          </S.Text>
        </BaseCol>

        <BaseCol span={24}>
          <BaseRow wrap={false} justify="space-between" gutter={[20, 20]}>
            <BaseCol flex={1}>
              <div className="liquid-chart-container">
                <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
              </div>
            </BaseCol>
          </BaseRow>
        </BaseCol>
      </BaseRow>
    </NFTCard>
  );
};