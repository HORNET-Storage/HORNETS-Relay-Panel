import styled, { css } from 'styled-components';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseLayout } from '@app/components/common/BaseLayout/BaseLayout';

interface HeaderProps {
  $isTwoColumnsLayout: boolean;
  $isDesktop: boolean;
}

export default styled(BaseLayout.Content)<HeaderProps>`
  padding: ${LAYOUT.mobile.paddingVertical} ${LAYOUT.mobile.paddingHorizontal};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(props) =>
    props?.$isDesktop &&
    css`
      z-index: 0;
    `}

  @media only screen and ${media.md} {
    padding: ${LAYOUT.desktop.paddingVertical} 1.8rem 0 ${LAYOUT.desktop.paddingHorizontal};
  }

  @media only screen and ${media.xl} {
    ${(props) =>
      props?.$isTwoColumnsLayout &&
      css`
        padding: ${LAYOUT.desktop.paddingVertical} 1.8rem 0 ${LAYOUT.desktop.paddingHorizontal};
        padding-right: 0; /* Only remove right padding to allow right column to attach to edge */
      `}
  }
`;
