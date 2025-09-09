import styled, { keyframes } from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput as CommonInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { InputPassword as CommonInputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

// Liquid flow animation
const liquidFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Glow pulse animation
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 170, 0.2);
  }
`;

// Rotate animation for background effect
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
`;

export const BackgroundWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #001a1a 0%,
    #002626 25%,
    #003333 50%,
    #004040 75%,
    #001a1a 100%
  );
  background-size: 400% 400%;
  animation: ${liquidFlow} 20s ease infinite;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at 30% 40%,
      rgba(0, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(0, 255, 170, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(20, 184, 166, 0.06) 0%,
      transparent 70%
    );
    animation: ${rotate} 30s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at top,
      rgba(0, 255, 255, 0.05) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at bottom,
      rgba(20, 184, 166, 0.05) 0%,
      transparent 60%
    );
  }
`;

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

export const FormWrapper = styled.div`
  padding: 2.5rem;
  width: 31.75rem;
  overflow: auto;
  background: rgba(0, 40, 40, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: ${BORDER_RADIUS};
  box-shadow:
    0 8px 32px 0 rgba(0, 255, 255, 0.15),
    inset 0 1px 0 0 rgba(0, 255, 255, 0.1),
    inset 0 -1px 0 0 rgba(0, 255, 255, 0.05);
  animation: ${glowPulse} 4s ease-in-out infinite;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 255, 0.4),
      transparent
    );
  }

  @media only screen and ${media.xs} {
    padding: 2.5rem 1.25rem;
    width: 20.75rem;
    max-height: calc(100vh - 3rem);
  }

  @media only screen and ${media.md} {
    padding: 2.5rem;
    width: 31.75rem;
    max-height: calc(100vh - 3rem);
  }
`;

export const FormTitle = styled.div`
  color: #00FFFF;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  text-align: center;
  background: linear-gradient(135deg, #00FFFF 0%, #14B8A6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media only screen and ${media.xs} {
    margin-bottom: 0.625rem;
    font-size: ${FONT_SIZE.lg};
    font-weight: ${FONT_WEIGHT.bold};
    line-height: 1.5625rem;
  }

  @media only screen and ${media.md} {
    margin-bottom: 0.875rem;
    font-size: ${FONT_SIZE.xxl};
    font-weight: ${FONT_WEIGHT.bold};
    line-height: 1.9375rem;
  }

  @media only screen and ${media.xl} {
    margin-bottom: 0.9375rem;
    font-size: ${FONT_SIZE.xxxl};
    font-weight: ${FONT_WEIGHT.extraBold};
    line-height: 2.125rem;
  }
`;

export const FormCheckbox = styled(BaseCheckbox)`
  display: flex;
  padding-left: 0.125rem;

  & .ant-checkbox-inner {
    border-radius: 3px;
    transform: scale(1.375);
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  & .ant-checkbox-input {
    transform: scale(1.375);
  }

  &:hover .ant-checkbox-inner {
    border-color: rgba(0, 255, 255, 0.6);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  }

  & .ant-checkbox-checked .ant-checkbox-inner {
    background: linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%);
    border-color: rgba(0, 255, 255, 0.6);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);

    &::after {
      border-color: white;
    }
  }

  & + span {
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const FormItem = styled(BaseForm.Item)`
  margin-bottom: 1rem;
  & .ant-form-item-control-input {
    min-height: 3.125rem;
  }

  & .ant-form-item-explain-error {
    font-size: ${FONT_SIZE.xs};
    color: #FF6B6B;
    margin-top: 0.25rem;
  }

  & label {
    color: rgba(0, 255, 255, 0.9);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;
    font-weight: ${FONT_WEIGHT.medium};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &.ant-form-item-has-feedback .ant-input-affix-wrapper .ant-input-suffix {
    padding-right: 1.5rem;
  }
`;

export const FormInput = styled(CommonInput)`
  color: rgba(255, 255, 255, 0.95);
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;

  & input.ant-input {
    background: transparent;
    color: rgba(255, 255, 255, 0.95);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  &:hover {
    border-color: rgba(0, 255, 255, 0.4);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
  }

  &:focus,
  &.ant-input-focused {
    background: rgba(0, 255, 255, 0.08);
    border-color: rgba(0, 255, 255, 0.6);
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.1),
                0 0 20px rgba(0, 255, 255, 0.2);
  }
`;

export const FormInputPassword = styled(CommonInputPassword)`
  color: rgba(255, 255, 255, 0.95);
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;

  & input.ant-input {
    background: transparent;
    color: rgba(255, 255, 255, 0.95);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  & .ant-input-suffix {
    color: rgba(0, 255, 255, 0.6);
  }

  &:hover {
    border-color: rgba(0, 255, 255, 0.4);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
  }

  &:focus-within {
    background: rgba(0, 255, 255, 0.08);
    border-color: rgba(0, 255, 255, 0.6);
    box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.1),
                0 0 20px rgba(0, 255, 255, 0.2);
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  align-items: center;
`;

export const Text = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
`;

export const LinkText = styled(Text)`
  text-decoration: none;
  color: #00FFFF;
  transition: all 0.3s ease;
  position: relative;

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
    color: #00FFAA;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
    
    &::after {
      width: 100%;
    }
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

export const SubmitButton = styled(BaseButton)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 100%;
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

export const SocialButton = styled(BaseButton)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  color: rgba(0, 255, 255, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.3);
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.5);
    color: #00FFFF;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FooterWrapper = styled.div`
  margin-top: 1.25rem;
  text-align: center;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0, 255, 255, 0.1);
`;

export const BackIcon = styled(LeftOutlined)`
  font-size: 0.75rem;
  margin-right: 0.75rem;
  transition: transform 0.3s ease;
`;

export const BackWrapper = styled.div`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1.25rem;
  color: rgba(0, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:hover {
    color: #00FFFF;
    transform: translateX(-4px);
    
    ${BackIcon} {
      transform: translateX(-4px);
    }
  }
`;

export const SocialIconWrapper = styled.div`
  display: flex;
  margin-right: 0.8125rem;
  
  & svg {
    width: 20px;
    height: 20px;
    fill: rgba(0, 255, 255, 0.8);
    transition: all 0.3s ease;
  }

  @media only screen and ${media.xs} {
    margin-right: 0.625rem;
  }

  @media only screen and ${media.md} {
    margin-right: 0.8125rem;
  }
`;
