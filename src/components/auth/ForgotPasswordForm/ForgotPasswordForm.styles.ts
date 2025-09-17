import styled, { keyframes } from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const buttonGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 4px 15px rgba(0, 255, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 4px 25px rgba(0, 255, 255, 0.5),
      0 0 40px rgba(0, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

export const Description = styled.div`
  margin-bottom: 1.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  line-height: 1.5;

  @media only screen and ${media.xs} {
    font-size: ${FONT_SIZE.xxs};
  }

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xs};
  }
`;

export const SubmitButton = styled(BaseButton)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 100%;
  margin-top: 1.125rem;
  margin-bottom: 1rem;
  height: 48px;
  background: linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${buttonGlow} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #00DDFF 0%, #00FFAA 100%);
    border-color: rgba(0, 255, 255, 0.6);
    color: white;
    
    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    animation: none;
  }

  &.ant-btn-loading {
    &::after {
      border-color: rgba(255, 255, 255, 0.3);
      border-top-color: white;
    }
  }
`;