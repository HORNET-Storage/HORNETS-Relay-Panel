import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { SettingsOverlay } from './settingsOverlay/SettingsOverlay/SettingsOverlay';
import * as S from './SettingsDropdown.styles';

export const SettingsDropdown: React.FC = () => {
  const [isOpened, setOpened] = useState(false);

  return (
    <S.StyledSettingsPopover
      content={<SettingsOverlay />}
      trigger="click"
      onOpenChange={setOpened}
      transitionName=""
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
    >
      <HeaderActionWrapper>
        <BaseButton type={isOpened ? 'ghost' : 'text'} icon={<SettingOutlined />} />
      </HeaderActionWrapper>
    </S.StyledSettingsPopover>
  );
};
