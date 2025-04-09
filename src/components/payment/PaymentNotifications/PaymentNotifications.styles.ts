import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

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

export const NotificationItem = styled.div<{ $isRead: boolean; $isNew?: boolean }>`
  position: relative;
  transition: all 0.3s ease;

  ${(props) =>
    !props.$isRead &&
    `
    background-color: var(--background-color);
    border-radius: ${BORDER_RADIUS};
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -0.5rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: var(--primary-color);
    }
  `}

  ${(props) =>
    props.$isNew &&
    `
    border-left: 3px solid var(--success-color);
  `}
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
`;

export const MetaValue = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const CopyButton = styled(BaseButton)`
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

export const MarkReadButton = styled(BaseButton)`
  margin-top: 0.75rem;
  padding: 0;
  height: auto;
`;

export const UserInput = styled(BaseInput)`
  width: 100%;
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
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: ${BORDER_RADIUS};
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.semibold};
  margin-left: 0.5rem;
  background-color: var(--success-color);
  color: var(--text-secondary-color);
`;

export const AmountDisplay = styled.div`
  display: flex;
  flex-direction: column;
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
  
  ${(props) => props.color === 'warning' && `
    color: var(--warning-color);
  `}
  
  ${(props) => props.color === 'error' && `
    color: var(--error-color);
  `}
`;
