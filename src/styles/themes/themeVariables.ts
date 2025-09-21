import { ThemeType } from '@app/interfaces/interfaces';
import { hexToRGB } from '@app/utils/utils';
import { css } from 'styled-components';
import { BASE_COLORS } from './constants';
import { liquidBlueTheme, antLiquidBlueTheme } from './liquidBlue/liquidBlueTheme';

export const themeObject = {
  'liquid-blue': liquidBlueTheme,
};

export const antThemeObject = {
  'liquid-blue': antLiquidBlueTheme,
};

const getThemeVariables = () => css`
  color-scheme: dark;
  --primary-color: ${liquidBlueTheme.primary};
  --primary1-color: ${liquidBlueTheme.primary1};
  --primary-gradient-color: ${liquidBlueTheme.primaryGradient};
  --info-color: var(--primary-color);
  --secondary-color: ${liquidBlueTheme.secondary};
  --error-color: ${liquidBlueTheme.error};
  --warning-color: ${liquidBlueTheme.warning};
  --success-color: ${liquidBlueTheme.success};
  --background-color: ${liquidBlueTheme.background};
  --secondary-background-color: ${liquidBlueTheme.secondaryBackground};
  --secondary-background-selected-color: ${liquidBlueTheme.secondaryBackgroundSelected};
  --additional-background-color: ${liquidBlueTheme.additionalBackground};
  --collapse-background-color: ${liquidBlueTheme.collapseBackground};
  --timeline-background-color: ${liquidBlueTheme.timelineBackground};
  --spinner-base-color: ${liquidBlueTheme.spinnerBase};
  --sider-background-color: ${liquidBlueTheme.siderBackground};
  --shadow-color: ${liquidBlueTheme.shadow};
  --border-color: ${liquidBlueTheme.border};
  --border-nft-color: ${liquidBlueTheme.borderNft};
  --scroll-color: ${liquidBlueTheme.scroll};

  --primary-rgb-color: 0, 255, 255;
  --info-rgb-color: 0, 255, 255;
  --secondary-rgb-color: 0, 221, 255;
  --error-rgb-color: 239, 68, 68;
  --warning-rgb-color: 245, 158, 11;
  --success-rgb-color: 6, 182, 212;
  --background-rgb-color: 20, 184, 166;

  --text-main-color: ${liquidBlueTheme.textMain};
  --text-light-color: ${liquidBlueTheme.textLight};
  --text-superLight-color: ${liquidBlueTheme.textSuperLight};
  --text-secondary-color: ${liquidBlueTheme.textSecondary};
  --text-dark-color: ${liquidBlueTheme.textDark};
  --text-nft-light-color: ${liquidBlueTheme.textNftLight};
  --text-sider-primary-color: ${liquidBlueTheme.textSiderPrimary};
  --text-sider-secondary-color: ${liquidBlueTheme.textSiderSecondary};
  --subtext-color: ${liquidBlueTheme.subText};

  --dashboard-map-background-color: ${liquidBlueTheme.dashboardMapBackground};
  --dashboard-map-circle-color: ${liquidBlueTheme.dashboardMapCircleColor};
  --dashboard-map-control-disabled-background-color: ${liquidBlueTheme.dashboardMapControlDisabledBackground};

  --chart-tooltip-label-color: ${liquidBlueTheme.chartTooltipLabel};
  --chart-color1: ${liquidBlueTheme.chartColor1};
  --chart-rgb-color1: 0, 255, 255;
  --chart-color1-tint: ${liquidBlueTheme.chartColor1Tint};
  --chart-color2: ${liquidBlueTheme.chartColor2};
  --chart-color2-tint: ${liquidBlueTheme.chartColor2Tint};
  --chart-color3: ${liquidBlueTheme.chartColor3};
  --chart-color3-tint: ${liquidBlueTheme.chartColor3Tint};
  --chart-color4: ${liquidBlueTheme.chartColor4};
  --chart-color4-tint: ${liquidBlueTheme.chartColor4Tint};
  --chart-color5: ${liquidBlueTheme.chartColor5};
  --chart-rgb-color5: 0, 221, 255;
  --chart-color5-tint: ${liquidBlueTheme.chartColor5Tint};
  --chart-axis-label-color: ${liquidBlueTheme.chartAxisLabel};

  --notification-success-color: ${liquidBlueTheme.notificationSuccess};
  --notification-primary-color: ${liquidBlueTheme.notificationPrimary};
  --notification-warning-color: ${liquidBlueTheme.notificationWarning};
  --notification-error-color: ${liquidBlueTheme.notificationError};

  --icon-color: ${liquidBlueTheme.icon};
  --icon-hover-color: ${liquidBlueTheme.iconHover};
  --box-shadow: ${liquidBlueTheme.boxShadow};
  --box-shadow-hover: ${liquidBlueTheme.boxShadowHover};
  --box-shadow-nft-color: ${liquidBlueTheme.boxShadowNft};
  --box-shadow-nft-secondary-color: ${liquidBlueTheme.boxShadowNftSecondary};

  --heading-color: ${liquidBlueTheme.heading};
  --item-hover-bg: ${liquidBlueTheme.itemHoverBg};
  --background-base-color: ${liquidBlueTheme.backgroundColorBase};
  --border-base-color: ${liquidBlueTheme.borderBase};
  --disabled-color: ${liquidBlueTheme.disable};
  --disabled-bg-color: ${liquidBlueTheme.disabledBg};
  --layout-body-bg-color: ${liquidBlueTheme.layoutBodyBg};
  --layout-header-bg-color: ${liquidBlueTheme.layoutHeaderBg};
  --layout-sider-bg-color: ${liquidBlueTheme.layoutSiderBg};
  --input-placeholder-color: ${liquidBlueTheme.inputPlaceholder};
  --input-bg-color: ${liquidBlueTheme.inputBg};
  --avatar-bg: ${liquidBlueTheme.avatarBg};
  --alert-text-color: ${liquidBlueTheme.alertTextColor};
  --breadcrumb-color: ${liquidBlueTheme.breadcrumb};
`;

export const liquidBlueThemeVariables = css`
  ${getThemeVariables()}
  --ant-success-color-deprecated-bg: ${antLiquidBlueTheme.successBg} !important;
  --ant-success-color-deprecated-border: ${antLiquidBlueTheme.successBorder} !important;
`;

export const commonThemeVariables = css`
  color-scheme: dark;
  --white: ${BASE_COLORS.white};
  --black: ${BASE_COLORS.black};
  --green: ${BASE_COLORS.green};
  --orange: ${BASE_COLORS.orange};
  --gray: ${BASE_COLORS.gray};
  --lightgrey: ${BASE_COLORS.lightgrey};
  --violet: ${BASE_COLORS.violet};
  --lightgreen: ${BASE_COLORS.lightgreen};
  --pink: ${BASE_COLORS.pink};
  --blue: ${BASE_COLORS.blue};
  --skyblue: ${BASE_COLORS.skyblue};
  --red: ${BASE_COLORS.red};
`;

export const antOverrideCssVariables = css`
  --ant-primary-1: var(--primary1-color) !important;
`;