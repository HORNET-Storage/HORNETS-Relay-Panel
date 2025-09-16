import styled, { css } from 'styled-components';
import { BaseAvatar } from '../BaseAvatar/BaseAvatar';
import { BaseSpace } from '../BaseSpace/BaseSpace';
import { BaseTypography } from '../BaseTypography/BaseTypography';
import { NotificationType } from './BaseNotification';

interface SpacewWrapperProps {
  type: NotificationType;
}

export const NotificationIcon = styled(BaseAvatar)``;

export const Title = styled(BaseTypography.Text)`
  font-size: 0.875rem;
  font-weight: 600;
`;

export const Description = styled(BaseTypography.Text)`
  font-size: 0.875rem;
`;

export const SpaceWrapper = styled(BaseSpace)<SpacewWrapperProps>`
  background-color: var(--background-color);

  & ${Title}, span[role='img'] {
    ${(props) => {
      switch (props.type) {
        case 'error':
        case 'moderation':
          return css`
            color: var(--error-color);
          `;
        case 'warning':
        case 'success':
          return css`
            color: var(--${props.type}-color);
          `;
        case 'info':
          return css`
            /* Liquid cyan theme colors to match Paid Subscribers */
            color: rgba(45, 212, 191, 0.95);
            filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.3));
          `;
        case 'mention':
          return css`
            color: var(--primary-color);
          `;
        default:
          return '';
      }
    }}
  }

  & span[role='img'] {
    font-size: 2rem;
    
    /* Add glow effect for info icons */
    ${(props) => props.type === 'info' && css`
      animation: pulseGlow 2s ease-in-out infinite;
      
      @keyframes pulseGlow {
        0% {
          filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.3));
        }
        50% {
          filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.5));
        }
        100% {
          filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.3));
        }
      }
    `}
  }
`;
