import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import styled, { keyframes } from 'styled-components';

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

export const LoginDescription = styled.div`
  margin-bottom: 1.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: ${FONT_SIZE.xs};
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  line-height: 1.5;

  @media only screen and ${media.xs} {
    margin-bottom: 1.5625rem;
    font-weight: ${FONT_WEIGHT.medium};
  }

  @media only screen and ${media.md} {
    margin-bottom: 1.75rem;
    font-weight: ${FONT_WEIGHT.regular};
  }

  @media only screen and ${media.xl} {
    margin-bottom: 1.875rem;
  }
`;

export const RememberMeText = styled.span`
  color: rgba(0, 255, 255, 0.9);
  font-size: ${FONT_SIZE.xs};
  transition: color 0.3s ease;

  &:hover {
    color: #00FFFF;
  }
`;

export const ForgotPasswordText = styled.span`
  color: rgba(0, 255, 255, 0.8);
  font-size: ${FONT_SIZE.xs};
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #00FFFF;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #00FFFF;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
    
    &::after {
      width: 100%;
    }
  }
`;

export const HiddenInput = styled.div`
  display: none;
`;
