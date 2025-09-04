import { shadeColor } from '@app/utils/utils';
import { graphic } from 'echarts';
import { BASE_COLORS } from '../constants';
import { ITheme } from '../types';

// Liquid Blue Theme - Futuristic AI Interface inspired by Tony Stark/Jarvis
const chartColors = {
  chartTooltipLabel: '#00FFFF',
  chartAxisLabel: '#ffffff',
  chartColor1: '#00FFFF', // Electric cyan
  chartColor1Tint: '#00DDFF',
  chartColor2: '#00FFAA', // Neon turquoise
  chartColor2Tint: '#00FF88',
  chartColor3: '#14B8A6', // Teal
  chartColor3Tint: '#06B6D4',
  chartColor4: '#5EEAD4', // Light turquoise
  chartColor4Tint: '#99F6E4',
  chartColor5: '#00DDFF', // Bright teal
  chartColor5Tint: '#67E8F9',
  chartPrimaryGradient: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(0, 255, 255, 0.35)',
    },
    {
      offset: 1,
      color: 'rgba(0, 255, 255, 0)',
    },
  ]),
  chartSecondaryGradient: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(0, 255, 170, 0.35)',
    },
    {
      offset: 1,
      color: 'rgba(0, 255, 170, 0)',
    },
  ]),
  chartSecondaryGradientSpecular: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(255, 255, 255, 0)',
    },
    {
      offset: 1,
      color: 'rgba(0, 255, 255, 0.5)',
    },
  ]),
};

export const liquidBlueTheme: ITheme = {
  // Primary colors - Bright neon cyan/turquoise
  primary: '#00FFFF',        // Electric cyan
  primary1: '#00FFAA',       // Neon turquoise
  primaryGradient: 'linear-gradient(135deg, #00FFFF 0%, #00FFAA 100%)',
  light: '#5EEAD4',
  secondary: '#00DDFF',       // Bright teal
  error: '#EF4444',          // Red for errors
  warning: '#F59E0B',        // Amber warnings
  success: '#06B6D4',        // Cyan success
  
  // Backgrounds with turquoise/teal tint
  background: 'rgba(20, 184, 166, 0.08)',
  secondaryBackground: 'rgba(94, 234, 212, 0.12)',
  secondaryBackgroundSelected: 'rgba(153, 246, 228, 0.16)',
  additionalBackground: 'rgba(20, 184, 166, 0.1)',
  collapseBackground: 'rgba(20, 184, 166, 0.08)',
  timelineBackground: 'rgba(0, 255, 255, 0.05)',
  siderBackground: 'rgba(0, 255, 255, 0.06)',
  spinnerBase: '#00FFFF',
  scroll: 'rgba(0, 255, 255, 0.3)',
  
  // Borders with turquoise glow
  border: 'rgba(20, 184, 166, 0.15)',
  borderNft: 'rgba(0, 255, 255, 0.2)',
  
  // Text colors - keep white for visibility
  textMain: 'rgba(255, 255, 255, 0.95)',
  textLight: 'rgba(255, 255, 255, 0.9)',
  textSuperLight: 'rgba(255, 255, 255, 0.8)',
  textSecondary: 'rgba(255, 255, 255, 0.85)',
  textDark: 'rgba(255, 255, 255, 0.7)',
  textNftLight: 'rgba(255, 255, 255, 0.75)',
  textSiderPrimary: '#00FFFF',
  textSiderSecondary: 'rgba(255, 255, 255, 0.75)',
  subText: 'rgba(255, 255, 255, 0.7)',
  
  // Shadows with cyan glow
  shadow: 'rgba(0, 255, 255, 0.1)',
  boxShadow: '0 0 20px rgba(0, 255, 255, 0.15)',
  boxShadowHover: '0 0 30px rgba(0, 255, 255, 0.25)',
  boxShadowNft: '0px 16px 24px rgba(0, 255, 255, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.04)',
  boxShadowNftSecondary: '0px 10px 20px rgba(0, 255, 255, 0.08), 0px 2px 6px rgba(0, 0, 0, 0.04)',
  
  // Dashboard specific
  dashboardMapBackground: 'rgba(20, 184, 166, 0.1)',
  dashboardMapCircleColor: '#00FFFF',
  dashboardMapControlDisabledBackground: 'rgba(0, 255, 255, 0.2)',
  
  // Notifications with cyan tint
  notificationSuccess: 'rgba(6, 182, 212, 0.1)',
  notificationPrimary: 'rgba(0, 255, 255, 0.1)',
  notificationWarning: 'rgba(245, 158, 11, 0.1)',
  notificationError: 'rgba(239, 68, 68, 0.1)',
  
  // Additional properties
  heading: '#ffffff',
  borderBase: 'rgba(0, 255, 255, 0.15)',
  disable: 'rgba(255, 255, 255, 0.3)',
  disabledBg: 'rgba(0, 255, 255, 0.05)',
  layoutBodyBg: 'transparent',
  layoutHeaderBg: 'rgba(0, 255, 255, 0.08)',
  layoutSiderBg: 'rgba(0, 255, 255, 0.06)',
  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
  inputBg: 'rgba(0, 255, 255, 0.06)',
  itemHoverBg: 'rgba(0, 255, 255, 0.08)',
  backgroundColorBase: 'rgba(0, 255, 255, 0.05)',
  avatarBg: 'rgba(0, 255, 255, 0.1)',
  alertTextColor: '#ffffff',
  breadcrumb: 'rgba(255, 255, 255, 0.7)',
  icon: 'rgba(255, 255, 255, 0.75)',
  iconHover: '#00FFFF',
  ...chartColors,
};

export const antLiquidBlueTheme = {
  successBg: 'rgba(6, 182, 212, 0.1)',
  successBorder: 'rgba(6, 182, 212, 0.3)',
};