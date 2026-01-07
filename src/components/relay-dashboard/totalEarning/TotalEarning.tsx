import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { NFTCard } from '@app/components/relay-dashboard/common/NFTCard/NFTCard';
import { TotalEarningChart } from './TotalEarningChart/TotalEarningChart';
import { useBitcoinRatesWithRange } from '@app/hooks/useBitcoinRatesWithRange';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { Dates } from '@app/constants/Dates';
import * as S from './TotalEarning.styles';
export const TotalEarning: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');
  const { rates: bitcoinRates, isLoading, error } = useBitcoinRatesWithRange({ timeRange });

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
  const firstRate = bitcoinRates.length > 1 ? Number(bitcoinRates[0]?.usd_value) : undefined;
  const isIncreased = latestRate && firstRate ? latestRate > firstRate : false;
  const rateDifference = latestRate && firstRate ? ((latestRate - firstRate) / firstRate) * 100 : 0;


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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <span style={{ color: isIncreased ? '#34D399' : '#E94B2F' }}>
                  {isIncreased ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </span>
                <span>{rateDifference.toFixed(2)}%</span>
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
          <div className="liquid-chart-container">
            <TotalEarningChart xAxisData={days} earningData={totalEarningData} />
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </BaseCol>
      </BaseRow>
    </NFTCard>
  );
};