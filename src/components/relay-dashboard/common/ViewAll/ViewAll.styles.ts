import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

interface ViewAllInternalProps {
  $bordered: boolean;
}

export const ViewAllBtn = styled(BaseButton)<ViewAllInternalProps>`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  color: #ffffff;
  padding: 0.4rem 1.2rem;
  height: 32px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  
  /* Match liquid glass styling of Send/Receive buttons */
  background: linear-gradient(to bottom right,
    rgba(20, 184, 166, 0.25), /* from-teal-500/25 */
    rgba(6, 182, 212, 0.20),  /* via-cyan-500/20 */
    rgba(34, 197, 94, 0.25)   /* to-green-500/25 */
  ) !important;
  
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 212, 191, 0.25) !important;
  
  box-shadow:
    inset 0 2px 8px rgba(45, 212, 191, 0.30),
    0 0 15px rgba(6, 182, 212, 0.20);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
      rgba(255, 255, 255, 0.10) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  &:hover {
    color: #ffffff;
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.30),
      rgba(6, 182, 212, 0.25),
      rgba(34, 197, 94, 0.30)
    ) !important;
    
    border-color: rgba(45, 212, 191, 0.35) !important;
    transform: translateY(-2px);
    
    box-shadow:
      inset 0 3px 12px rgba(45, 212, 191, 0.35),
      0 0 25px rgba(6, 182, 212, 0.25);
  }

  &:active {
    transform: translateY(0);
    background: linear-gradient(to bottom right,
      rgba(20, 184, 166, 0.35),
      rgba(6, 182, 212, 0.30),
      rgba(34, 197, 94, 0.35)
    ) !important;
    
    box-shadow:
      inset 0 4px 15px rgba(45, 212, 191, 0.40),
      0 0 20px rgba(6, 182, 212, 0.20);
  }

  ${(props) =>
    props.$bordered &&
    css`
      /* Bordered style overridden by liquid glass style */
    `};
`;
