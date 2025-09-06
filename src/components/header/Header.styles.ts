import styled, { css } from 'styled-components';
import { BurgerIcon } from '@app/components/common/Burger/BurgerIcon';
import { GitHubButton } from '@app/components/header/components/GithubButton/GitHubButton';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseCollapse } from '../common/BaseCollapse/BaseCollapse';
import { BaseCol } from '../common/BaseCol/BaseCol';

export const HeaderActionWrapper = styled.div`
  cursor: pointer;
  position: relative;
  display: inline-block;  /* Prevent wrapper from expanding */

  /* Remove any potential background or box behind header buttons */
  background: transparent !important;
  background-color: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
  border: none !important;

  & > .ant-btn > span[role='img'],
  .ant-badge {
    font-size: 1.25rem;

    @media only screen and ${media.md} {
      font-size: 1.625rem;
    }
  }

  & .ant-badge {
    display: inline-block;
  }
`;

export const InvalidPubkey = styled.div`
  position: absolute;
  top: 3rem;
  left: 2rem;
  width: 100%;
  color: var(--error-color);
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

export const DropdownCollapse = styled(BaseCollapse)`
  & > .ant-collapse-item > .ant-collapse-header {
    font-weight: 600;
    font-size: 0.875rem;

    color: var(--primary-color);

    @media only screen and ${media.md} {
      font-size: 1rem;
    }
  }

  & > .ant-collapse-item-disabled > .ant-collapse-header {
    cursor: default;

    & > span[role='img'] {
      display: none;
    }
  }
`;

export const BurgerCol = styled(BaseCol)`
  z-index: 105;
  display: flex;
`;

export const MobileBurger = styled(BurgerIcon)`
  width: 1.75rem;
  height: 1.75rem;
  margin-right: -0.5rem;
  color: var(--text-main-color);

  ${(props) =>
    props.isCross &&
    css`
      z-index: 105;
      color: var(--text-secondary-color);
    `};
`;

export const SearchColumn = styled(BaseCol)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
`;

interface ProfileColumn {
  $isTwoColumnsLayout: boolean;
}

export const ProfileColumn = styled(BaseCol)<ProfileColumn>`
  @media only screen and ${media.md} {
    ${(props) =>
      props?.$isTwoColumnsLayout &&
      css`
        /* Remove background and padding that creates unwanted box behind buttons */
        background-color: transparent !important;
        /* Remove padding to prevent spacing issues */
        padding: 0 !important;
        /* Ensure the buttons are not affected */
        display: flex;
        align-items: center;
        justify-content: flex-end; /* Push buttons to the far right */
        width: 100%;
      `}

    /* Always prevent background in header column regardless of layout */
    background-color: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    /* Ensure full width and right alignment */
    width: 100% !important;
    display: flex !important;
    justify-content: flex-end !important;
  }

  /* Additional override for all screen sizes - remove any possible background */
  background: transparent !important;
  background-color: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
  border: none !important;
  /* Ensure right alignment */
  margin-left: auto !important;
`;

export const GHButton = styled(GitHubButton)`
  display: none;

  @media only screen and ${media.lg} {
    display: block;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
`;

export const MenuItem = styled.div`
  padding: 10px 20px;
  &:hover {
    background: #f0f0f0;
  }
  a {
    text-decoration: none;
    color: #333;
  }
`;

/* Global header background removal overrides */
export const HeaderBackgroundOverride = `
  /* Override any background styling in the header area */
  .ant-layout-header,
  [class*="layout-header"],
  [class*="ant-layout-header"],
  .header-area,
  .header-wrapper,
  .header-container,
  .header-buttons,
  .header-controls,
  .header-actions,
  .flex.items-center.justify-between[class*="text-white"],
  [class*="flex"][class*="items-center"][class*="justify-end"] {
    background: transparent !important;
    background-color: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
    border: none !important;
  }

  /* Ensure header section containers have no background */
  section:has(.ant-layout-header),
  div:has(.ant-layout-header),
  .relative:has([class*="justify-end"]) {
    background: transparent !important;
    background-color: transparent !important;
  }
`;
