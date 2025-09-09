import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

interface ViewAllInternalProps {
  $bordered: boolean;
}

export const ViewAllBtn = styled(BaseButton)<ViewAllInternalProps>`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  color: var(--text-main-color);
  padding: 0.4rem 1.2rem;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
              0 0 10px rgba(0, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent);
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
    border-radius: 50%;
  }

  &:hover {
    color: #00ffff;
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15),
                0 0 20px rgba(0, 255, 255, 0.3);
    
    &::before {
      width: 150%;
      height: 150%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  ${(props) =>
    props.$bordered &&
    css`
      /* Bordered style overridden by floating style */
    `};
`;
