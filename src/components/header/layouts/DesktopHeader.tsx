import React from 'react';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { HeaderFullscreen } from '../components/HeaderFullscreen/HeaderFullscreen';
import * as S from '../Header.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

interface DesktopHeaderProps {
  isTwoColumnsLayout: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isTwoColumnsLayout }) => {
  const leftSide = isTwoColumnsLayout ? (
    <S.SearchColumn xl={16} xxl={17}>
      <BaseRow justify="space-between">
        <BaseCol xl={14} xxl={12}>  {/* Extended another 15% to ~60-65% width */}
          <HeaderSearch />
        </BaseCol>
        <BaseCol></BaseCol>
      </BaseRow>
    </S.SearchColumn>
  ) : (
    <>
      <BaseCol lg={12} xxl={10}>  {/* Further extended for non-two-column layout */}
        <HeaderSearch />
      </BaseCol>
      <BaseCol></BaseCol>
    </>
  );

  return (
    <BaseRow justify="space-between" align="middle">
      {leftSide}

      <S.ProfileColumn xl={8} xxl={7} $isTwoColumnsLayout={isTwoColumnsLayout}>
        <BaseRow align="middle" justify="end" gutter={[10, 0]}>
          <BaseCol>
            <HeaderFullscreen />
          </BaseCol>

          <BaseCol>
            <NotificationsDropdown />
          </BaseCol>

          <BaseCol>
            <SettingsDropdown />
          </BaseCol>
        </BaseRow>
      </S.ProfileColumn>
    </BaseRow>
  );
};
