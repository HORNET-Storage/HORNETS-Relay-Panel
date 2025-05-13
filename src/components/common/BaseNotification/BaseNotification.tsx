import React from 'react';
import { CheckCircleFilled, ExclamationCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons';
import * as S from './BaseNotification.styles';
import { BaseSpace } from '../BaseSpace/BaseSpace';

interface Icons {
  info: React.ReactNode;
  success: React.ReactNode;
  warning: React.ReactNode;
  error: React.ReactNode;
  mention: React.ReactNode;
  moderation: React.ReactNode;
}

export type NotificationType = 'info' | 'mention' | 'success' | 'warning' | 'error' | 'moderation';

interface BaseNotificationProps {
  type: NotificationType;
  title: React.ReactNode;
  description?: React.ReactNode;
  mentionIconSrc?: React.ReactNode;
}

export const BaseNotification: React.FC<BaseNotificationProps> = ({ type, mentionIconSrc, title, description }) => {
  const icons: Icons = {
    info: <InfoCircleFilled />,
    success: <CheckCircleFilled />,
    warning: <ExclamationCircleFilled />,
    error: <WarningFilled />,
    mention: mentionIconSrc,
    moderation: <WarningFilled />, // Using the same icon as error for moderation
  };

  const icon = icons[type] || icons.warning;

  return (
    <S.SpaceWrapper type={type} align="start" size="middle">
      {mentionIconSrc ? <S.NotificationIcon src={icon} alt="User icon" /> : icon}
      <BaseSpace direction="vertical">
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
      </BaseSpace>
    </S.SpaceWrapper>
  );
};
