import styled from 'styled-components';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { BaseMenu } from '@app/components/common/BaseMenu/BaseMenu';
interface MenuProps {
  $tabletOnly: boolean;
}

export const Menu = styled(BaseMenu)<MenuProps>`
  background: transparent;
  border-right: 0;

  a {
    width: 100%;
    display: block;
  }

  .ant-menu-item,
  .ant-menu-submenu {
    font-size: ${FONT_SIZE.xs};
  }

  .ant-menu-item-icon {
    width: 1.25rem;
  }

  .ant-menu-submenu-expand-icon,
  .ant-menu-submenu-arrow,
  span[role='img'],
  a,
  .ant-menu-item,
  .ant-menu-submenu {
    color: var(--text-sider-secondary-color);
    fill: var(--text-sider-secondary-color);
  }

  /* Smooth hover transition for menu items */
  .ant-menu-item,
  .ant-menu-submenu-title {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    margin: 4px 8px;
    
    /* Glass morphism background on hover */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 255, 255, 0);
      backdrop-filter: blur(0);
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: -1;
      pointer-events: none;
    }
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    transform: translateX(4px);
    
    &::before {
      background: rgba(0, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
      border: 1px solid rgba(0, 255, 255, 0.1);
    }
    
    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow,
    span[role='img'],
    a,
    .ant-menu-item-icon,
    .ant-menu-title-content {
      color: var(--text-sider-primary-color);
      fill: var(--text-sider-primary-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
  }

  .ant-menu-submenu-selected {
    .ant-menu-submenu-title {
      color: var(--text-sider-primary-color);

      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow,
      span[role='img'] {
        color: var(--text-sider-primary-color);
        fill: var(--text-sider-primary-color);
      }
    }
  }

  ${(props) =>
    props.$tabletOnly &&
    `
    .ant-menu-inline,
    .ant-menu-item::after {
      border-right: none;
    }
  `}
  .ant-menu-item-selected {
    background-color: transparent !important;
    
    /* Persistent glow for selected item */
    &::before {
      background: rgba(0, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
      border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow,
    span[role='img'],
    .ant-menu-item-icon,
    a {
      color: var(--text-sider-primary-color);
      fill: var(--text-sider-primary-color);
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
    }
  }

  .ant-menu-item-active,
  .ant-menu-submenu-active .ant-menu-submenu-title {
    background-color: transparent !important;
  }
  
  /* Smooth transitions for all interactive elements */
  .ant-menu-submenu-expand-icon,
  .ant-menu-submenu-arrow,
  span[role='img'],
  .ant-menu-item-icon,
  .ant-menu-title-content,
  a {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
