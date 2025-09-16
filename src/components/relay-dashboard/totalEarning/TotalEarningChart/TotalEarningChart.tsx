import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { ChartData, CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
// import { formatDate } from '@app/utils/dateFormatter';

interface LineData {
  data: ChartData;
}

interface TotalEarningChartProps {
  xAxisData: number[] | string[];
  earningData: LineData;
}

export const TotalEarningChart: React.FC<TotalEarningChartProps> = ({ xAxisData, earningData }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { t } = useTranslation();


  // Ensure all values are numbers and handle empty arrays
  const numericData = earningData.data.map(val => Number(val)).filter(val => !isNaN(val));
  const minYValue = numericData.length > 0 ? Math.min(...numericData) : 0;
  const maxYValue = numericData.length > 0 ? Math.max(...numericData) : 1000;

  const roundDown = (value: number, interval: number) => Math.floor(value / interval) * interval;
  const roundUp = (value: number, interval: number) => Math.ceil(value / interval) * interval;

  const interval = 1000;
  const minY = roundDown(minYValue * 0.99, interval);
  const maxY = roundUp(maxYValue * 1.01, interval);

  const yAxisTickInterval = (maxY - minY) / 5;

  const seriesList = [
    {
      name: t('nft.earnings'),
      type: 'line',
      data: earningData.data.map((value, index) => [xAxisData[index], value]),
      showSymbol: false,
      smooth: true,
      lineStyle: {
        width: 3,
        color: themeObject[theme].chartColor3,
        shadowColor: 'rgba(0, 255, 255, 0.4)',
        shadowBlur: 10,
        shadowOffsetY: 3,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 255, 255, 0.2)' },
            { offset: 1, color: 'rgba(0, 255, 255, 0.02)' }
          ],
        },
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          width: 4,
        },
      },
      encode: {
        x: 'date',
        y: 'usd_value',
        label: ['date', 'usd_value'],
        itemName: 'date',
        tooltip: ['usd_value'],
      },
    },
  ];

  const option = {
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
      confine: true,
      formatter: (data: any) => {
        const currentSeries = data[0];
        const roundedValue = Math.round(currentSeries.value[1]); // Round to nearest dollar
        return `${currentSeries.name} - ${getCurrencyPrice(
          formatNumberWithCommas(roundedValue),
          CurrencyTypeEnum.USD,
        )}`;
      },
    },
    grid: {
      top: 20,
      left: 60,
      right: 20,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: themeObject[theme].chartAxisLabel,
        },
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      min: minY,
      max: maxY,
      interval: yAxisTickInterval, // Ensure even spacing
      axisLine: {
        lineStyle: {
          color: themeObject[theme].chartAxisLabel,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#444',
        },
      },
      axisLabel: {
        formatter: (value: number) => `$${formatNumberWithCommas(value)}`,
        color: themeObject[theme].chartAxisLabel,
        fontSize: 13,
        fontFamily: 'Arial',
      },
    },
    series: seriesList,
  };

  return <BaseChart option={option} width="100%" height="12rem" />;
};
