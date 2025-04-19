import styled, { css } from 'styled-components';
import { Input, Button, Divider } from 'antd';
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

  ${({ $isRead }) =>
    !$isRead &&
    css`
      background-color: var(--background-color);
      border-left: 4px solid var(--error-color);
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

export const ModerationBanner = styled.div`
  padding: 4px 8px;
  background-color: rgba(var(--error-rgb-color), 0.1);
  color: var(--error-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const MediaWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: ${BORDER_RADIUS};
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

export const StyledImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
  background-color: #000;
`;

export const StyledVideo = styled.video`
  max-width: 100%;
  max-height: 300px;
  display: block;
  background-color: #000;
`;

export const StyledAudio = styled.audio`
  width: 100%;
  margin-top: 8px;
`;

export const MediaError = styled.div`
  padding: 1rem;
  background-color: var(--secondary-background-color);
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.xs};
  border-radius: ${BORDER_RADIUS};
  text-align: center;
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

export const ContentTypeTag = styled.span<{ $type: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.semibold};
  text-transform: uppercase;
  margin-right: 8px;
  
  ${({ $type }) => {
    switch ($type) {
      case 'image':
        return css`
          background-color: rgba(var(--success-rgb-color), 0.1);
          color: var(--success-color);
        `;
      case 'video':
        return css`
          background-color: rgba(var(--warning-rgb-color), 0.1);
          color: var(--warning-color);
        `;
      default:
        return css`
          background-color: rgba(var(--primary-rgb-color), 0.1);
          color: var(--primary-color);
        `;
    }
  }}
`;

// Action buttons container
export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// View event button
export const ViewEventButton = styled(Button)`
  display: flex;
  align-items: center;
`;

// Event details modal styles
export const EventDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1rem;
`;

export const EventSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background-color: var(--background-color);
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h3`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
  margin-bottom: 0.5rem;
  color: var(--heading-color);
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const DetailLabel = styled.span`
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.xs};
`;

export const DetailValue = styled.span`
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.md};
  word-break: break-all;
`;

export const EventContent = styled.pre`
  background-color: var(--secondary-background-color);
  padding: 1rem;
  border-radius: ${BORDER_RADIUS};
  overflow-x: auto;
  font-family: monospace;
  font-size: ${FONT_SIZE.xs};
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
`;

export const MediaContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.5rem;
`;
