import React, { CSSProperties, useEffect, useState } from 'react';
import { EChartsOption } from 'echarts-for-react';
import ReactECharts from 'echarts-for-react';
import { Loading } from '../Loading/Loading';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { ITheme } from '@app/styles/themes/types';
import { BORDER_RADIUS } from '@app/styles/themes/constants';

export interface BaseChartProps {
  option?: EChartsOption;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvents?: Record<string, (e: any) => void>;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  classname?: string;
}

interface DefaultTooltipStyles {
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  backgroundColor?: string;
  extraCssText?: string;
  textStyle: {
    fontWeight: number;
    fontSize: number;
    color: string;
  };
}

export const getChartColors = (theme: ITheme): string[] => [
  theme.chartColor1,
  theme.chartColor2,
  theme.chartColor3,
  theme.chartColor4,
  theme.chartColor5,
];

export const getDefaultTooltipStyles = (theme: ITheme): DefaultTooltipStyles => ({
  borderColor: 'rgba(0, 255, 255, 0.6)',
  borderWidth: 1,
  borderRadius: 8,
  backgroundColor: 'rgba(0, 12, 24, 0.95)',
  extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 255, 255, 0.15);',
  textStyle: {
    fontWeight: 400,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
  },
});

export const BaseChart: React.FC<BaseChartProps> = ({ option, width, height, onEvents, style, ...props }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [loading, setLoading] = useState(true);

  const chartHeight = height || '400px';

  const defaultOption = {
    color: getChartColors(themeObject[theme]),
  };

  useEffect(() => {
    // TODO FIXME workaround to make sure that parent container is initialized before the chart
    setTimeout(() => {
      setLoading(false);
    }, 1000 / 2);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <ReactECharts
      {...props}
      option={{ ...defaultOption, ...option }}
      style={{
        ...style,
        height: chartHeight,
        minHeight: height === '100%' ? 400 : 'unset',
        width,
        zIndex: 0,
      }}
      onEvents={onEvents}
    />
  );
};
