import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseChart, getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { liquidBlueTheme } from '@app/styles/themes/liquidBlue/liquidBlueTheme';
import { themeObject } from '@app/styles/themes/themeVariables';
import useLineChartData from '@app/hooks/useLineChartData';
import { graphic } from 'echarts';

export const LineRaceChart: React.FC = () => {
  const { data, isLoading } = useLineChartData();
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.theme);

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
      symbol: 'circle',
      symbolSize: 8,
      smooth: 0.4,
      lineStyle: {
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(51, 156, 253, 0.9)',
          },
          {
            offset: 1,
            color: 'rgba(51, 156, 253, 0.6)',
          },
        ]),
        width: 3,
        shadowColor: 'rgba(51, 156, 253, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 3,
      },
      itemStyle: {
        color: 'rgba(51, 156, 253, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.15,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(51, 156, 253, 0.3)',
          },
          {
            offset: 1,
            color: 'rgba(51, 156, 253, 0.05)',
          },
        ]),
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.npubs')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
        textShadowBlur: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        showSymbol: true,
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(51, 156, 253, 0.6)',
          shadowBlur: 15,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3,
          shadowColor: 'rgba(51, 156, 253, 0.5)',
          shadowBlur: 10,
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
      symbol: 'circle',
      symbolSize: 8,
      smooth: 0.4,
      lineStyle: {
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(253, 156, 51, 0.9)',
          },
          {
            offset: 1,
            color: 'rgba(253, 156, 51, 0.6)',
          },
        ]),
        width: 3,
        shadowColor: 'rgba(253, 156, 51, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 3,
      },
      itemStyle: {
        color: 'rgba(253, 156, 51, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.15,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(253, 156, 51, 0.3)',
          },
          {
            offset: 1,
            color: 'rgba(253, 156, 51, 0.05)',
          },
        ]),
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.lightningABV')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
        textShadowBlur: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        showSymbol: true,
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(253, 156, 51, 0.6)',
          shadowBlur: 15,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3,
          shadowColor: 'rgba(253, 156, 51, 0.5)',
          shadowBlur: 10,
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
      symbol: 'circle',
      symbolSize: 8,
      smooth: 0.4,
      lineStyle: {
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(25, 230, 141, 0.9)',
          },
          {
            offset: 1,
            color: 'rgba(25, 230, 141, 0.6)',
          },
        ]),
        width: 3,
        shadowColor: 'rgba(25, 230, 141, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 3,
      },
      itemStyle: {
        color: 'rgba(25, 230, 141, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.15,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(25, 230, 141, 0.3)',
          },
          {
            offset: 1,
            color: 'rgba(25, 230, 141, 0.05)',
          },
        ]),
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.bolt')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
        textShadowBlur: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        showSymbol: true,
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(25, 230, 141, 0.6)',
          shadowBlur: 15,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3,
          shadowColor: 'rgba(25, 230, 141, 0.5)',
          shadowBlur: 10,
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
      symbol: 'circle',
      symbolSize: 8,
      smooth: 0.4,
      lineStyle: {
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(142, 48, 235, 0.9)',
          },
          {
            offset: 1,
            color: 'rgba(142, 48, 235, 0.6)',
          },
        ]),
        width: 3,
        shadowColor: 'rgba(142, 48, 235, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 3,
      },
      itemStyle: {
        color: 'rgba(142, 48, 235, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.15,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(142, 48, 235, 0.3)',
          },
          {
            offset: 1,
            color: 'rgba(142, 48, 235, 0.05)',
          },
        ]),
      },
      endLabel: {
        show: !noData,
        formatter: (params: { value: string[] }) => `${t('categories.lightningAndDHT')}: ${params.value[1]}`,
        color: liquidBlueTheme.textMain,
        fontSize: 12,
        fontWeight: 'bold',
        textShadowBlur: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
        showSymbol: true,
        lineStyle: {
          width: 4,
          shadowColor: 'rgba(142, 48, 235, 0.6)',
          shadowBlur: 15,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3,
          shadowColor: 'rgba(142, 48, 235, 0.5)',
          shadowBlur: 10,
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
      ...getDefaultTooltipStyles(themeObject[theme]),
      order: 'valueDesc',
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(0, 255, 255, 0.3)',
        },
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.3)',
          width: 1,
        },
      },
      formatter: function(params: any[]) {
        if (!params || params.length === 0) return '';
        
        const monthName = new Date(params[0].name + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });
        
        const colorMap: Record<string, string> = {
          [t('categories.npubs')]: 'rgba(51, 156, 253, 0.9)',
          [t('categories.lightningABV')]: 'rgba(253, 156, 51, 0.9)',
          [t('categories.bolt')]: 'rgba(25, 230, 141, 0.9)',
          [t('categories.lightningAndDHT')]: 'rgba(142, 48, 235, 0.9)',
        };
        
        let content = `
          <div style="padding: 4px;">
            <div style="color: rgba(0, 255, 255, 0.9); font-weight: 500; margin-bottom: 8px; border-bottom: 1px solid rgba(0, 255, 255, 0.2); padding-bottom: 6px;">
              ${monthName}
            </div>
        `;
        
        // Sort by value descending for better readability
        const sortedParams = [...params].sort((a, b) => b.value[1] - a.value[1]);
        
        sortedParams.forEach(param => {
          const color = colorMap[param.seriesName] || 'rgba(0, 255, 255, 0.9)';
          const gradientStyle = `background: linear-gradient(135deg, ${color}, ${color.replace('0.9', '0.4')})`;
          const value = param.value[1];
          
          content += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; ${gradientStyle}; display: inline-block; margin-right: 8px;"></span>
              <span style="color: rgba(255, 255, 255, 0.85); flex: 1;">${param.seriesName}: </span>
              <span style="color: ${color}; font-weight: 600; margin-left: auto;">${value.toLocaleString()}</span>
            </div>
          `;
        });
        
        content += '</div>';
        return content;
      },
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
          color: 'rgba(0, 255, 255, 0.3)',
        },
      },
      splitLine: {
        show: false,
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
          color: 'rgba(0, 255, 255, 0.3)',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.15)',
          type: 'dashed',
        },
      },
    },
    grid: {
      left: 65,
      right: 78,
      top: 20,
      bottom: 60,
      backgroundColor: 'transparent',
      borderColor: 'rgba(0, 255, 255, 0.1)',
      borderWidth: 1,
      shadowColor: 'rgba(0, 255, 255, 0.1)',
      shadowBlur: 10,
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