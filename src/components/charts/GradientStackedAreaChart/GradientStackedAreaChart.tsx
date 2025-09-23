import React from 'react';
import { useTranslation } from 'react-i18next';
import * as echarts from 'echarts';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { graphic } from 'echarts';

export const GradientStackedAreaChart: React.FC = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);

  const option = {
    tooltip: {
      ...getDefaultTooltipStyles(themeObject[theme]),
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(0, 255, 255, 0.8)',
        },
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.3)',
          width: 1,
        },
      },
    },
    legend: {
      data: [`coal`, `hydro`, `nuclear`, `gas`, `oil`].map((item) => t(`charts.${item}`)),
      top: 0,
      left: 10,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    grid: {
      top: 80,
      left: 20,
      right: 20,
      bottom: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Canada', 'China', 'Russia', 'Australia', 'Germany', 'France'],
        axisLabel: {
          fontSize: FONT_SIZE.xxs,
          fontWeight: FONT_WEIGHT.light,
          color: themeObject[theme].primary,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'TWh',
        axisLabel: {
          fontSize: FONT_SIZE.xxs,
          fontWeight: FONT_WEIGHT.light,
          color: themeObject[theme].textMain,
        },
      },
    ],
    series: [
      {
        name: t('charts.coal'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 1,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00FFFF',
            },
            {
              offset: 0.5,
              color: 'rgba(0, 255, 255, 0.5)',
            },
            {
              offset: 1,
              color: 'rgba(0, 255, 255, 0.1)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [140, 232, 101, 264, 90, 340, 250],
      },
      {
        name: t('charts.hydro'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(253, 156, 51, 0.8)',
            },
            {
              offset: 0.5,
              color: 'rgba(253, 156, 51, 0.4)',
            },
            {
              offset: 1,
              color: 'rgba(253, 156, 51, 0.1)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [120, 282, 111, 234, 220, 340, 310],
      },
      {
        name: t('charts.nuclear'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(25, 230, 141, 0.8)',
            },
            {
              offset: 0.5,
              color: 'rgba(25, 230, 141, 0.4)',
            },
            {
              offset: 1,
              color: 'rgba(25, 230, 141, 0.1)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [320, 132, 201, 334, 190, 130, 220],
      },
      {
        name: t('charts.gas'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(142, 48, 235, 0.8)',
            },
            {
              offset: 0.5,
              color: 'rgba(142, 48, 235, 0.4)',
            },
            {
              offset: 1,
              color: 'rgba(142, 48, 235, 0.1)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [220, 402, 231, 134, 190, 230, 120],
      },
      {
        name: t('charts.oil'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(233, 75, 47, 0.8)',
            },
            {
              offset: 0.5,
              color: 'rgba(233, 75, 47, 0.4)',
            },
            {
              offset: 1,
              color: 'rgba(233, 75, 47, 0.1)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [220, 302, 181, 234, 210, 290, 150],
      },
    ],
  };

  return (
    <BaseCard padding="0 0 1.875rem" title={t('charts.gradientLabel')}>
      <div className="liquid-chart-container">
        <BaseChart option={option} height="24rem" />
      </div>
    </BaseCard>
  );
};
