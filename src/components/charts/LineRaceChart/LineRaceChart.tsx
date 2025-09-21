import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { liquidBlueTheme } from '@app/styles/themes/liquidBlue/liquidBlueTheme';
import useLineChartData from '@app/hooks/useLineChartData';

export const LineRaceChart: React.FC = () => {
  const { data, isLoading } = useLineChartData();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <BaseCard
        padding="0 0 1.875rem"
        title={t('charts.protocols')}
        className="liquid-glass-card liquid-dashboard-element"
      >
        <div className="liquid-loading-container">
          <div className="liquid-loader"></div>
          <p className="liquid-text">{t('common.loading')}</p>
        </div>
      </BaseCard>
    );
  }

  const noData = !data || data.length === 0;

  const seriesList = [
    {
      name: t('categories.npubs'),
      type: 'line',
      data: noData ? [] : data.map((item) => [item.month, item.profiles]),
      showSymbol: false,
      lineStyle: {
        color: liquidBlueTheme.chartColor1, // Use liquid blue theme colors
        width: 3,
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.npubs')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          color: liquidBlueTheme.chartColor1,
          width: 4,
          shadowColor: liquidBlueTheme.chartColor1,
          shadowBlur: 8,
        },
      },
      encode: {
        x: 'month',
        y: 'profiles',
        label: ['month', 'profiles'],
        itemName: 'month',
        tooltip: ['npubs'],
      },
    },
    {
      name: t('categories.lightningABV'),
      type: 'line',
      data: noData ? [] : data.map((item) => [item.month, item.lightning_addr]),
      showSymbol: false,
      lineStyle: {
        color: liquidBlueTheme.chartColor2, // Use liquid blue theme colors
        width: 3,
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.lightningABV')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          color: liquidBlueTheme.chartColor2,
          width: 4,
          shadowColor: liquidBlueTheme.chartColor2,
          shadowBlur: 8,
        },
      },
      encode: {
        x: 'month',
        y: 'lightning_addr',
        label: ['month', 'lightning_addr'],
        itemName: 'month',
        tooltip: [''],
      },
    },
    {
      name: t('categories.bolt'),
      type: 'line',
      data: noData ? [] : data.map((item) => [item.month, item.dht_key]),
      showSymbol: false,
      lineStyle: {
        color: liquidBlueTheme.chartColor3, // Use liquid blue theme colors
        width: 3,
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.bolt')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          color: liquidBlueTheme.chartColor3,
          width: 4,
          shadowColor: liquidBlueTheme.chartColor3,
          shadowBlur: 8,
        },
      },
      encode: {
        x: 'month',
        y: 'dht_key',
        label: ['month', 'dht_key'],
        itemName: 'month',
        tooltip: ['dht_key'],
      },
    },
    {
      name: t('categories.lightningAndDHT'),
      type: 'line',
      data: noData ? [] : data.map((item) => [item.month, item.lightning_and_dht]),
      showSymbol: false,
      lineStyle: {
        color: liquidBlueTheme.chartColor4, // Use liquid blue theme colors
        width: 3,
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.lightningAndDHT')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          color: liquidBlueTheme.chartColor4,
          width: 4,
          shadowColor: liquidBlueTheme.chartColor4,
          shadowBlur: 8,
        },
      },
      encode: {
        x: 'month',
        y: 'lightning_and_dht',
        label: ['month', 'lightning_and_dht'],
        itemName: 'month',
        tooltip: ['lightning_and_dht'],
      },
    },
  ];

  const option = {
    animationDuration: 3000,
    animationEasing: 'cubicOut',
    dataset: [
      {
        id: 'dataset_raw',
        source: noData ? [] : data,
      },
    ],
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: liquidBlueTheme.primary,
      textStyle: {
        color: liquidBlueTheme.textMain,
      },
      shadowColor: liquidBlueTheme.shadow,
      shadowBlur: 8,
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle',
      data: noData ? [] : data.map((item) => item.month),
      axisLabel: {
        interval: 0,
        rotate: 45,
        margin: 16,
        color: liquidBlueTheme.textLight,
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: liquidBlueTheme.border,
        },
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        formatter: '{value}',
        color: liquidBlueTheme.textLight,
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: liquidBlueTheme.border,
        },
      },
      splitLine: {
        lineStyle: {
          color: liquidBlueTheme.borderBase,
          opacity: 0.3,
        },
      },
    },
    grid: {
      left: 65,
      right: 78,
      top: 20,
      bottom: 60,
    },
    series: seriesList,
    graphic: noData
      ? {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: t('charts.noData'),
            fontSize: 16,
            fill: liquidBlueTheme.textMain,
            fontWeight: 'bold',
          },
        }
      : null,
  };

  return (
    <BaseCard
      padding="0 0 1.875rem"
      title={<span className="liquid-glow-text">{t('charts.protocols')}</span>}
      className="liquid-glass-card liquid-dashboard-element"
    >
      <div className="liquid-chart-container">
        <BaseChart key={JSON.stringify(data)} option={option} height="24rem" />
      </div>
    </BaseCard>
  );
};