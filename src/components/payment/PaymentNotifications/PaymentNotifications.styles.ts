import styled from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { Card } from 'antd';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

export const FiltersWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const FooterWrapper = styled.div`
  margin-top: 1.5rem;
`;

export const SplitDivider = styled.div`
  height: 1px;
  background-color: var(--border-color);
  width: 100%;
`;

export const NotificationItem = styled(Card)<{ $isRead: boolean; $isNew?: boolean }>`
  position: relative;
  transition: all 0.3s ease;
  width: 100%;
  background-color: var(--additional-background-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  border: none;
  .ant-space {
    background-color: transparent;
  }
  .anticon-info-circle {
    color: var(--text-light-color);
    width: 2.4rem;
    padding: 0 0.2rem;
  }
  ${(props) =>
    !props.$isRead &&
    `
    border-radius: ${BORDER_RADIUS};
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -1.1rem;
      top: 2.4rem;
      transform: translateY(-50%);
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: var(--primary-color);

      @media only screen and ${media.lg} {
        left: -2rem;
      }
    }
  `}

  ${(props) =>
    props.$isNew &&
    `
    border-left: 3px solid var(--success-color) !important;
  `}
`;
export const NotificationHeader = styled(BaseRow)`
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.md};
`;
export const NotificationContent = styled.div`
  padding-top: 0.5rem;
`;

export const NotificationMeta = styled.div`
  display: flex;

  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const MetaItem = styled.div`
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.xs};
  display: flex;
  align-items: center;
`;

export const MetaLabel = styled.span`
  font-weight: ${FONT_WEIGHT.semibold};
  margin-right: 0.5rem;
  font-size: ${FONT_SIZE.md};
`;

export const MetaValue = styled.span`
  display: inline-flex;
  font-size: ${FONT_SIZE.md};
  color: var(--text-main-color);
  align-items: center;
`;

export const CopyButton = styled(BaseButton)`
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${FONT_SIZE.xs};
  padding: 2px 6px;
  height: 24px;
  border-radius: ${BORDER_RADIUS};
  background-color: var(--background-color);

  &:hover {
    background-color: var(--secondary-background-color);
  }
`;

export const MarkReadButton = styled(BaseButton)`
  padding: 0;
  height: auto;
  font-size: ${FONT_SIZE.xs};
`;

export const UserInput = styled(BaseInput)`
  width: 100%;
  background-color: var(--input-bg-color);
`;

export const Text = styled(BaseTypography.Text)`
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const TierTag = styled.span<{ $tier: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: ${BORDER_RADIUS};
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.semibold};
  margin-right: 0.5rem;
  background-color: var(--primary-color);
  color: var(--text-secondary-color);
  text-transform: uppercase;
`;

export const NewSubscriberBadge = styled.span`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: ${BORDER_RADIUS};
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.semibold};
  margin-left: 0.5rem;
  background-color: var(--success-color);
  height: 1.5rem;
  color: var(--text-secondary-color);
`;

export const AmountDisplay = styled.div`
  display: flex;
  font-size: ${FONT_SIZE.lg};
  flex-direction: column;
  align-items: flex-end;
`;

export const SatAmount = styled.span`
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const BtcAmount = styled.span`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-light-color);
`;

export const ExpirationInfo = styled.div`
  margin-top: 0.5rem;
  font-size: ${FONT_SIZE.xs};
  color: var(--text-light-color);
  font-weight: ${FONT_WEIGHT.regular};

  ${(props) =>
    props.color === 'warning' &&
    `
    color: var(--warning-color);
  `}

  ${(props) =>
    props.color === 'error' &&
    `
    color: var(--error-color);
  `}
`;
export const Root = styled(BaseCard)`
  padding: 0;
  padding-top: 1.25rem;

  .ant-space.ant-space-horizontal {
    width: 100%;
  }
  @media only screen and ${media.lg} {
    padding-left: 3rem;
  }
`;
export const TransactionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  min-width: 30rem;
  @media only screen and ${media.lg} {
    min-width: 40vw;
`;
export const LeftSideTX = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  ;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
