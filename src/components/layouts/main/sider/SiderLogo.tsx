import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { RightOutlined } from '@ant-design/icons';
import { useResponsive } from 'hooks/useResponsive';
import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';

interface SiderLogoProps {
  isSiderCollapsed: boolean;
  toggleSider: () => void;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ isSiderCollapsed, toggleSider }) => {
  const { tabletOnly } = useResponsive();

  // For liquid-blue theme, use the default logo
  const img = logo;

  return (
    <S.SiderLogoDiv>
      <S.SiderLogoLink to="/">
        <img
          src={img}
          alt="Lightence"
          width={56}
          height={56}
          style={{
            maxWidth: '56px',
            maxHeight: '56px',
            objectFit: 'contain',
            flexShrink: 0
          }}
        />
        <S.BrandSpan>
          H.O.R.N.E.T.S
          <br />
          Nostr Relay
        </S.BrandSpan>
      </S.SiderLogoLink>
      {tabletOnly && (
        <S.CollapseButton
          shape="circle"
          size="small"
          $isCollapsed={isSiderCollapsed}
          icon={<RightOutlined rotate={isSiderCollapsed ? 0 : 180} />}
          onClick={toggleSider}
        />
      )}
    </S.SiderLogoDiv>
  );
};
