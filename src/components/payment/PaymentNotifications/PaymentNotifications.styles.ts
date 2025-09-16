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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1rem;
  
  /* Glass morphism background matching Paid Subscribers */
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.08),  /* from-teal-500/8 */
    rgba(6, 182, 212, 0.06),   /* via-cyan-500/6 */
    rgba(34, 197, 94, 0.08)    /* to-green-500/8 */
  );
  
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 212, 191, 0.2);
  position: relative;
  overflow: hidden;
  
  /* Glass overlay effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  ${({ $isRead }) =>
    !$isRead &&
    css`
      background: linear-gradient(to bottom right,
        rgba(20, 184, 166, 0.12),
        rgba(6, 182, 212, 0.10),
        rgba(34, 197, 94, 0.12)
      );
      border-left: 3px solid rgba(45, 212, 191, 0.6);
      box-shadow:
        inset 0 2px 8px rgba(45, 212, 191, 0.15),
        0 0 20px rgba(6, 182, 212, 0.15);
    `}

  &:hover {
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.15),
      rgba(6, 182, 212, 0.12),
      rgba(34, 197, 94, 0.15)
    );
    border-color: rgba(45, 212, 191, 0.35);
    transform: translateY(-2px);
    box-shadow:
      inset 0 3px 12px rgba(45, 212, 191, 0.2),
      0 0 30px rgba(6, 182, 212, 0.2);
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
  
  /* Liquid glass effect matching theme */
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.15),
    rgba(6, 182, 212, 0.12),
    rgba(34, 197, 94, 0.15)
  );
  color: rgba(45, 212, 191, 0.9);
  border: 1px solid rgba(45, 212, 191, 0.25);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.20),
      rgba(6, 182, 212, 0.18),
      rgba(34, 197, 94, 0.20)
    );
    color: rgba(45, 212, 191, 1);
    border-color: rgba(45, 212, 191, 0.4);
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
    transform: scale(1.05);
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
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  border-radius: 6px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $paymentType }) => {
    if ($paymentType === 'new') {
      return css`
        background: linear-gradient(to bottom right,
          rgba(20, 184, 166, 0.20),
          rgba(6, 182, 212, 0.18),
          rgba(34, 197, 94, 0.20)
        );
        color: rgba(45, 212, 191, 1);
        border: 1px solid rgba(45, 212, 191, 0.3);
        box-shadow:
          inset 0 2px 6px rgba(45, 212, 191, 0.2),
          0 0 12px rgba(6, 182, 212, 0.15);
          
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08) 0%,
            transparent 100%
          );
          pointer-events: none;
        }
      `;
    }
    return css`
      background: linear-gradient(to bottom right,
        rgba(20, 184, 166, 0.12),
        rgba(6, 182, 212, 0.10),
        rgba(34, 197, 94, 0.12)
      );
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(45, 212, 191, 0.2);
    `;
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
  
  /* Liquid glass button styling */
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.20),
    rgba(6, 182, 212, 0.15),
    rgba(34, 197, 94, 0.20)
  ) !important;
  
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(45, 212, 191, 0.25) !important;
  color: rgba(45, 212, 191, 0.95) !important;
  
  box-shadow:
    inset 0 2px 8px rgba(45, 212, 191, 0.25),
    0 0 12px rgba(6, 182, 212, 0.15);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.25),
      rgba(6, 182, 212, 0.20),
      rgba(34, 197, 94, 0.25)
    ) !important;
    
    border-color: rgba(45, 212, 191, 0.35) !important;
    transform: translateY(-1px);
    
    box-shadow:
      inset 0 3px 10px rgba(45, 212, 191, 0.30),
      0 0 20px rgba(6, 182, 212, 0.20);
  }
  
  &:active {
    transform: translateY(0);
  }
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
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  ${({ $type }) => {
    if ($type === 'new') {
      return css`
        color: rgba(45, 212, 191, 1);
        background: linear-gradient(135deg,
          rgba(20, 184, 166, 0.18),
          rgba(6, 182, 212, 0.15)
        );
        border: 1px solid rgba(45, 212, 191, 0.35);
        box-shadow: 0 0 8px rgba(6, 182, 212, 0.2);
        
        &:hover {
          background: linear-gradient(135deg,
            rgba(20, 184, 166, 0.25),
            rgba(6, 182, 212, 0.20)
          );
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
        }
      `;
    }
    return css`
      color: rgba(255, 255, 255, 0.85);
      background: linear-gradient(135deg,
        rgba(45, 212, 191, 0.08),
        rgba(6, 182, 212, 0.06)
      );
      border: 1px solid rgba(45, 212, 191, 0.2);
      
      &:hover {
        background: linear-gradient(135deg,
          rgba(45, 212, 191, 0.12),
          rgba(6, 182, 212, 0.10)
        );
        border-color: rgba(45, 212, 191, 0.3);
      }
    `;
  }}
`;
