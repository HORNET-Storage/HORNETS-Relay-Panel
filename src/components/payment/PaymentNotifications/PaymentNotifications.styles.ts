import styled, { css } from 'styled-components';
import { Input, Button, Divider, Badge, Tag } from 'antd';
import { FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT, LAYOUT } from '@app/styles/themes/constants';

export const ScrollableWrapper = styled.div`
  height: calc(100vh - ${LAYOUT.desktop.headerHeight} - 4rem);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
  
  /* Hide scrollbars completely while maintaining functionality */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
  
  /* Firefox */
  scrollbar-width: none;
  
  /* IE/Edge */
  -ms-overflow-style: none;
`;

export const ScrollableContent = styled.div`
  height: calc(100vh - ${LAYOUT.desktop.headerHeight} - 8rem);
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Hide scrollbars completely while maintaining functionality */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
  
  /* Firefox */
  scrollbar-width: none;
  
  /* IE/Edge */
  -ms-overflow-style: none;
`;

export const ContentPadding = styled.div`
  padding: 1.25rem;
`;

export const FiltersWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const SplitDivider = styled(Divider)`
  margin: 0.5rem 0;
`;

export const NotificationItem = styled.div<{ $isRead: boolean }>`
  padding: 0.75rem;
  border-radius: ${BORDER_RADIUS};
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  background: rgba(0, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.1);

  ${({ $isRead }) =>
    !$isRead &&
    css`
      background: rgba(0, 255, 255, 0.05);
      border-left: 3px solid rgba(0, 255, 255, 0.4);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
    `}

  &:hover {
    background: rgba(0, 255, 255, 0.06);
    border-color: rgba(0, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 255, 255, 0.15);
  }
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const NotificationText = styled.div`
  font-size: ${FONT_SIZE.md};
  color: var(--text-main-color);
`;

export const NotificationMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: ${FONT_SIZE.xs};
  color: var(--text-light-color);
  margin-bottom: 0.75rem;
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

export const MetaLabel = styled.span`
  font-weight: ${FONT_WEIGHT.semibold};
  margin-right: 0.5rem;
`;

export const MetaValue = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const CopyButton = styled(Button)`
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${FONT_SIZE.xs};
  padding: 2px 6px;
  height: 20px;
  border-radius: ${BORDER_RADIUS};
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const ContentContainer = styled.div`
  margin-top: 0.75rem;
  max-width: 100%;
  border-radius: ${BORDER_RADIUS};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

export const PaymentBanner = styled.div<{ $paymentType: string }>`
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  border-radius: 6px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${({ $paymentType }) => {
    if ($paymentType === 'new') {
      return css`
        background: rgba(6, 182, 212, 0.12);
        color: rgba(6, 182, 212, 0.9);
        border-color: rgba(6, 182, 212, 0.2);
      `;
    }
    return '';
  }}
`;

export const PaymentDetails = styled.div`
  width: 100%;
`;

export const ExpirationInfo = styled.div`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-light-color);
`;

export const MarkReadButton = styled(Button)`
  align-self: flex-start;
  margin-top: 0.5rem;
`;

export const UserInput = styled(Input)`
  width: 100%;
`;

export const FooterWrapper = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const Text = styled.span`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);
`;

export const RedDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--error-color);
  margin-left: 5px;
`;

export const PaymentCountBadge = styled(Badge)`
  margin-left: 0.5rem;
  
  .ant-badge-count {
    background: linear-gradient(135deg, #00ffff 0%, #06b6d4 100%);
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    box-shadow:
      0 0 8px rgba(0, 255, 255, 0.5),
      0 0 16px rgba(0, 255, 255, 0.3);
    border: none;
  }
`;

export const PaymentTypeTag = styled(Tag)<{ $type: string }>`
  border-radius: 12px;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.semibold};
  text-transform: uppercase;
  margin-right: 8px;

  ${({ $type }) => {
    if ($type === 'new') {
      return css`
        color: rgba(6, 182, 212, 0.9);
        background: rgba(6, 182, 212, 0.12);
        border-color: rgba(6, 182, 212, 0.3);
      `;
    }
    return css`
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    `;
  }}
`;
