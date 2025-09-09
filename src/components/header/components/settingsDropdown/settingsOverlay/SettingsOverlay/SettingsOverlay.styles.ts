import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { media } from '@app/styles/themes/constants';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import styled from 'styled-components';

export const SettingsOverlayMenu = styled.div`
  width: 13rem;
`;

export const RadioBtn = styled(BaseRadio)`
  font-size: 0.875rem;
`;

export const PwaInstallWrapper = styled.div`
  padding: 0 1rem 0.75rem;
`;

export const ButtonWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledButton = styled(BaseButton)`
  background: rgba(0, 255, 255, 0.05) !important;
  border: 1px solid rgba(0, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1) !important;
    border-color: rgba(0, 255, 255, 0.4) !important;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
    color: white !important;
  }

  &:focus {
    background: rgba(0, 255, 255, 0.1) !important;
    border-color: rgba(0, 255, 255, 0.5) !important;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3) !important;
    color: white !important;
  }

  .anticon {
    color: rgba(255, 255, 255, 0.9) !important;
  }
`;

export const Text = styled(BaseTypography.Text)`
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 1rem;
  height: 50px;
  font-size: 0.89rem;
  font-weight: 600;

  & > a {
    display: block;
  }

  @media only screen and ${media.md} {
    font-size: 1rem;
  }
`;
