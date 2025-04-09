import React from 'react';
import * as S from './SubscriberAvatar.styles';

interface SubscriberAvatarProps {
  img: string;
  onStoryOpen: () => void;
  viewed: boolean;
}

export const SubscriberAvatar: React.FC<SubscriberAvatarProps> = ({ img, onStoryOpen, viewed }) => {
  return (
    <S.CreatorButton onClick={onStoryOpen} $viewed={viewed}>
      <S.Avatar src={img} alt="subscriber avatar" />
    </S.CreatorButton>
  );
};