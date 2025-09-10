import styled, { css } from 'styled-components';
import { Input, Button, Divider, Badge, Tag } from 'antd';
import { FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from '@app/styles/themes/constants';

export const FiltersWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const SplitDivider = styled(Divider)`
  margin: 0.5rem 0;
`;

export const NotificationItem = styled.div<{ $isRead: boolean }>`
  padding: 0.75rem;
  border-radius: ${BORDER_RADIUS};
  transition: background-color 0.3s ease;
  margin-bottom: 1rem;

  ${({ $isRead }) =>
    !$isRead &&
    css`
      background-color: var(--background-color);
      border-left: 4px solid var(--primary-color);
    `}

  &:hover {
    background-color: var(--secondary-background-color);
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
  background-color: var(--background-color);

  &:hover {
    background-color: var(--secondary-background-color);
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
  padding: 4px 8px;
  background-color: rgba(var(--primary-rgb-color), 0.1);
  color: var(--primary-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 6px;

  ${({ $paymentType }) => {
    if ($paymentType === 'new') {
      return css`
        background-color: rgba(var(--success-rgb-color), 0.1);
        color: var(--success-color);
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
  border-top: 1px solid var(--border-color);
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
    background-color: var(--success-color);
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
        color: var(--success-color);
        background: rgba(var(--success-rgb-color), 0.1);
        border-color: var(--success-color);
      `;
    }
    return css`
      color: var(--primary-color);
      background: rgba(var(--primary-rgb-color), 0.1);
      border-color: var(--primary-color);
    `;
  }}
`;
