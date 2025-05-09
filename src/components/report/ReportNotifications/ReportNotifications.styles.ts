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
      border-left: 4px solid var(--warning-color);
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

export const ReportBanner = styled.div<{ $reportType: string }>`
  padding: 4px 8px;
  background-color: rgba(var(--warning-rgb-color), 0.1);
  color: var(--warning-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 6px;

  ${({ $reportType }) => {
    switch ($reportType) {
      case 'nudity':
      case 'illegal':
        return css`
          background-color: rgba(var(--error-rgb-color), 0.1);
          color: var(--error-color);
        `;
      case 'spam':
      case 'profanity':
        return css`
          background-color: rgba(var(--warning-rgb-color), 0.1);
          color: var(--warning-color);
        `;
      case 'impersonation':
        return css`
          background-color: rgba(var(--primary-rgb-color), 0.1);
          color: var(--primary-color);
        `;
      default:
        return css`
          background-color: rgba(var(--text-light-rgb-color), 0.1);
          color: var(--text-light-color);
        `;
    }
  }}
`;

export const ContentPreviewContainer = styled.div`
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: ${BORDER_RADIUS};
  width: 100%;
  border: 1px solid var(--border-color);
  white-space: pre-wrap;
  word-break: break-word;
  font-size: ${FONT_SIZE.xs};
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
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

export const ReportCountBadge = styled(Badge)`
  margin-left: 0.5rem;
  
  .ant-badge-count {
    background-color: var(--warning-color);
  }
`;

export const ReportTypeTag = styled(Tag)<{ $type: string }>`
  border-radius: 12px;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.semibold};
  text-transform: uppercase;
  margin-right: 8px;

  ${({ $type }) => {
    switch ($type) {
      case 'nudity':
        return css`
          color: var(--error-color);
          background: rgba(var(--error-rgb-color), 0.1);
          border-color: var(--error-color);
        `;
      case 'illegal':
        return css`
          color: var(--error-color);
          background: rgba(var(--error-rgb-color), 0.1);
          border-color: var(--error-color);
        `;
      case 'spam':
        return css`
          color: var(--warning-color);
          background: rgba(var(--warning-rgb-color), 0.1);
          border-color: var(--warning-color);
        `;
      case 'profanity':
        return css`
          color: var(--warning-color);
          background: rgba(var(--warning-rgb-color), 0.1);
          border-color: var(--warning-color);
        `;
      case 'impersonation':
        return css`
          color: var(--primary-color);
          background: rgba(var(--primary-rgb-color), 0.1);
          border-color: var(--primary-color);
        `;
      default:
        return css`
          color: var(--text-main-color);
          background: rgba(var(--text-light-rgb-color), 0.1);
          border-color: var(--text-light-color);
        `;
    }
  }}
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const DeleteButton = styled(Button)`
  background-color: var(--error-color);
  border-color: var(--error-color);
  color: #fff;
  
  &:hover, &:focus {
    background-color: var(--error-color);
    border-color: var(--error-color);
    color: #fff;
    opacity: 0.8;
  }
`;

export const ViewButton = styled(Button)`
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
  
  &:hover, &:focus {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
    opacity: 0.8;
  }
`;
