import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownCollapse } from '@app/components/header/Header.styles';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { setShowAlert } from '@app/store/slices/pwaSlice';
import * as S from './SettingsOverlay.styles';

export const SettingsOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { isPWASupported, event } = useAppSelector((state) => state.pwa);

  const handleInstallClick = () => {
    console.log('event', event);
    if (event == null) {
      // Display an alert if event is not available
      console.log('Event is not available');
      dispatch(setShowAlert(true));
      return;
    }

    (event as BeforeInstallPromptEvent).prompt();
  };
  return (
    <S.SettingsOverlayMenu {...props}>
      <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
        {/* { <DropdownCollapse.Panel header={t('header.changeTheme')} key="themePicker">
          <ThemePicker />
        </DropdownCollapse.Panel>
        <DropdownCollapse.Panel header={t('header.nightMode.title')} key="nightMode">
          <NightModeSettings />
        </DropdownCollapse.Panel>} */}
      </DropdownCollapse>
      <S.Text>
        <Link to="/logout">{t('header.logout')}</Link>
      </S.Text>
      {isPWASupported && (
        <S.PwaInstallWrapper>
          <BaseButton block type="primary" onClick={handleInstallClick}>
            {t('common.pwa')}
          </BaseButton>
        </S.PwaInstallWrapper>
      )}
    </S.SettingsOverlayMenu>
  );
};

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { DropdownCollapse } from '@app/components/header/Header.styles';
// import { useTranslation } from 'react-i18next';
// import { NightModeSettings } from '../nightModeSettings/NightModeSettings';
// import { ThemePicker } from '../ThemePicker/ThemePicker';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import * as S from './SettingsOverlay.styles';

// export const SettingsOverlay: React.FC = ({ ...props }) => {
//   const { t } = useTranslation();
//   const { isPWASupported } = useAppSelector((state) => state.pwa);
//   const [promptEvent, setPromptEvent] = useState<Event | null>(null);

//   useEffect(() => {
//     const handler = (e: Event) => {
//       e.preventDefault();
//       // Cast the event to any to bypass type checking, adjust as needed based on actual usage
//       setPromptEvent(e as any);
//     };

//     window.addEventListener('beforeinstallprompt', handler as EventListener);

//     return () => {
//       window.removeEventListener('beforeinstallprompt', handler as EventListener);
//     };
//   }, []);

//   return (
//     <S.SettingsOverlayMenu {...props}>
//       <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
//         <DropdownCollapse.Panel header={t('header.changeTheme')} key="themePicker">
//           <ThemePicker />
//         </DropdownCollapse.Panel>
//         <DropdownCollapse.Panel header={t('header.nightMode.title')} key="nightMode">
//           <NightModeSettings />
//         </DropdownCollapse.Panel>
//       </DropdownCollapse>
//       <S.Text>
//         <Link to="/logout">{t('header.logout')}</Link>
//       </S.Text>
//       {isPWASupported && promptEvent && (
//         <S.PwaInstallWrapper>
//           <BaseButton block type="primary" onClick={() => (promptEvent as any).prompt()}>
//             {t('common.pwa')}
//           </BaseButton>
//         </S.PwaInstallWrapper>
//       )}
//     </S.SettingsOverlayMenu>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import { DropdownCollapse } from '@app/components/header/Header.styles';
// import { useTranslation } from 'react-i18next';
// import { NightModeSettings } from '../nightModeSettings/NightModeSettings';
// import { ThemePicker } from '../ThemePicker/ThemePicker';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import * as S from './SettingsOverlay.styles';

// export const SettingsOverlay: React.FC = ({ ...props }) => {
//   const { t } = useTranslation();
//   const { isPWASupported } = useAppSelector((state) => state.pwa);
//   const [promptEvent, setPromptEvent] = useState<Event | null>(null);

//   useEffect(() => {
//     const handler = (e: Event) => {
//       e.preventDefault();
//       // Cast the event to any to bypass type checking, adjust as needed based on actual usage
//       setPromptEvent(e as any);
//     };

//     window.addEventListener('beforeinstallprompt', handler as EventListener);

//     return () => {
//       window.removeEventListener('beforeinstallprompt', handler as EventListener);
//     };
//   }, []);

//   return (
//     <S.SettingsOverlayMenu {...props}>
//       <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
//         <DropdownCollapse.Panel header={t('header.changeTheme')} key="themePicker">
//           <ThemePicker />
//         </DropdownCollapse.Panel>
//         <DropdownCollapse.Panel header={t('header.nightMode.title')} key="nightMode">
//           <NightModeSettings />
//         </DropdownCollapse.Panel>
//       </DropdownCollapse>
//       {isPWASupported && promptEvent && (
//         <S.PwaInstallWrapper>
//           <BaseButton block type="primary" onClick={() => (promptEvent as any).prompt()}>
//             {t('common.pwa')}
//           </BaseButton>
//         </S.PwaInstallWrapper>
//       )}
//     </S.SettingsOverlayMenu>
//   );
// };

// import React from 'react';
// import { DropdownCollapse } from '@app/components/header/Header.styles';
// import { useTranslation } from 'react-i18next';
// import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
// import { NightModeSettings } from '../nightModeSettings/NightModeSettings';
// import { ThemePicker } from '../ThemePicker/ThemePicker';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import * as S from './SettingsOverlay.styles';

// export const SettingsOverlay: React.FC = ({ ...props }) => {
//   const { t } = useTranslation();
//   const { isPWASupported, event } = useAppSelector((state) => state.pwa);

//   return (
//     <S.SettingsOverlayMenu {...props}>
//       <DropdownCollapse bordered={false} expandIconPosition="end" ghost defaultActiveKey="themePicker">
//         <DropdownCollapse.Panel header={t('header.changeLanguage')} key="languagePicker">
//           <LanguagePicker />
//         </DropdownCollapse.Panel>
//         <DropdownCollapse.Panel header={t('header.changeTheme')} key="themePicker">
//           <ThemePicker />
//         </DropdownCollapse.Panel>
//         <DropdownCollapse.Panel header={t('header.nightMode.title')} key="nightMode">
//           <NightModeSettings />
//         </DropdownCollapse.Panel>
//       </DropdownCollapse>
//       {isPWASupported && (
//         <S.PwaInstallWrapper>
//           <BaseButton block type="primary" onClick={() => event && (event as BeforeInstallPromptEvent).prompt()}>
//             {t('common.pwa')}
//           </BaseButton>
//         </S.PwaInstallWrapper>
//       )}
//     </S.SettingsOverlayMenu>
//   );
// };
