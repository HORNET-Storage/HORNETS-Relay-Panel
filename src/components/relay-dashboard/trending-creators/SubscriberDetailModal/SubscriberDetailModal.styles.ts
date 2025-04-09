import styled from 'styled-components';
import { Card, Typography, Button, Space } from 'antd';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, FONT_FAMILY, LAYOUT } from '@app/styles/themes/constants';

const { Title, Text, Paragraph } = Typography;

export const StyledModal = styled(Card)`
  background: var(--background-color);
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
  
  .ant-modal-content {
    background-color: var(--background-color);
    border-radius: ${BORDER_RADIUS};
  }
  
  .ant-modal-header {
    background-color: transparent;
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .ant-modal-body {
    padding: 0;
  }
  
  .ant-modal-footer {
    border-top: none;
    padding-top: 0;
  }
`;

export const HeaderSection = styled.div`
  padding: 24px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalTitle = styled(Title)`
  margin: 0 !important;
  color: var(--text-main-color);
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const CloseButton = styled(Button)`
  color: var(--text-main-color);
  border: none;
  background: transparent;
  box-shadow: none;
  
  &:hover {
    color: var(--primary-color);
    background: transparent;
  }
`;

export const AvatarSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(180deg, rgba(24,44,89,0.3) 0%, rgba(33,64,125,0.1) 100%);
`;

export const AvatarContainer = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  border: 4px solid var(--background-color);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled(Title)`
  margin: 0.5rem 0 0 !important;
  color: var(--text-main-color);
  text-align: center;
  font-weight: ${FONT_WEIGHT.bold};
`;

export const AboutText = styled(Paragraph)`
  color: var(--text-main-color);
  text-align: center;
  font-size: ${FONT_SIZE.md};
  max-width: 80%;
  margin: 0.5rem auto 1rem !important;
`;

export const InfoSection = styled.div`
  padding: 1.5rem;
`;

export const InfoCard = styled(Card)`
  margin-bottom: 1rem;
  border-radius: ${BORDER_RADIUS};
  background-color: var(--secondary-background-color);
  border: 1px solid var(--border-color);
  
  .ant-card-body {
    padding: 1rem;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  & > *:first-child {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

export const InfoTitle = styled(Text)`
  color: var(--text-main-color);
  font-weight: ${FONT_WEIGHT.semibold};
  font-size: ${FONT_SIZE.md};
`;

export const InfoContent = styled(Text)`
  color: var(--text-main-color);
  word-break: break-all;
  font-family: ${FONT_FAMILY.secondary};
  font-size: ${FONT_SIZE.xs};
  margin: 0;
  display: block;
`;

export const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-color);
  padding: 0.5rem 0.75rem;
  border-radius: ${BORDER_RADIUS};
  border: 1px solid var(--border-color);
  margin-top: 0.5rem;
`;

export const CopyButton = styled(Button)`
  color: var(--primary-color);
  font-size: ${FONT_SIZE.xs};
  padding: 0 8px;
  height: auto;
  border: none;
  background: transparent;
  
  &:hover {
    color: var(--primary-light-color);
    background: transparent;
  }
`;

export const StyledKeyText = styled(Text)`
  font-family: ${FONT_FAMILY.secondary};
  font-size: ${FONT_SIZE.xs};
  margin: 0;
  color: var(--text-light-color);
  overflow: hidden;
  text-overflow: ellipsis;
  width: 85%;
  white-space: nowrap;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(var(--primary-rgb-color), 0.1);
`;
