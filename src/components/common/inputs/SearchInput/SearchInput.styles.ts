import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseInput } from '../BaseInput/BaseInput';
import { BaseSpace } from '../../BaseSpace/BaseSpace';

export const SearchInput = styled(BaseInput.Search)`
  /* LIQUID BLUE THEME ROUNDED GLASS CONTAINER - VISIBLE AND PROMINENT */
  background: rgba(0, 255, 255, 0.10) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1.5px solid rgba(0, 255, 255, 0.25) !important;
  border-radius: 3.125rem !important;
  padding: 0.5rem !important;
    /* Ensure visibility */
  box-shadow: 0 4px 12px rgba(0, 255, 255, 0.1) !important;

  /* Mobile adjustments */
  @media only screen and (max-width: ${media.md}) {
    border-radius: 2.5rem !important;
  }

  /* Desktop specific settings */
  @media only screen and ${media.md} {
    padding: 0.75rem !important;
    border-radius: 3.125rem !important;
  }

  /* Liquid Blue Theme - Search prefix icon */
  & .ant-input-prefix {
    margin: 0.5rem;
    color: #00DDFF !important; /* Bright neon teal for search icon */
  }

  & .ant-input-search-button {
    height: 3.54875rem;
    box-shadow: none;
  }

  &.ant-input-search-large .ant-input-search-button {
    height: 4.36125rem;
  }

  /* Remove ALL internal backgrounds, borders, outlines, and boxes */
  && .ant-input-group,
  && .ant-input-group-addon,
  && .ant-input-group-addon .ant-btn,
  && .ant-input-suffix,
  && .ant-input-affix-wrapper {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border: none !important;
    outline: none !important;
    border-style: none !important;
    border-width: 0 !important;
    border-color: transparent !important;

    /* Restore rounded corners for visual appeal */
    @media only screen and ${media.md} {
      border-radius: 3.125rem !important;
    }

    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
  }

  /* Remove any pseudo-elements that might create outlines */
  && .ant-input-group::before,
  && .ant-input-group::after,
  && .ant-input-affix-wrapper::before,
  && .ant-input-affix-wrapper::after {
    display: none !important;
  }

  /* ALL INTERACTION STATES - NO INTERNAL HIGHLIGHTING BOX */
  &.ant-input-group-wrapper,
  &.ant-input-affix-wrapper,
  &.ant-input-affix-wrapper-focused {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;

    @media only screen and ${media.md} {
      border-radius: 3.125rem !important;
      padding: 0.5625rem 1.25rem !important;
    }
  }

  /* Liquid Blue Theme - Input group wrapper - NO internal highlighting */
  && .ant-input-group-addon {
    min-width: 5.5rem;
    color: #00FFFF !important; /* Electric cyan */
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.lg};
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Liquid Blue Theme - Search button with electric cyan */
  && .ant-input-search-button {
    &.ant-btn .anticon {
      color: #00FFFF !important; /* Electric cyan */
    }
    width: 100%;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    color: #00FFFF !important; /* Electric cyan */
  }

  /* Remove background from main input - restore rounded corners */
  && input {
    font-weight: 600;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    outline: none !important;

    /* Restore rounded corners */
    @media only screen and ${media.md} {
      border-radius: 3.125rem !important;
      font-size: 1rem;
    }

    &::placeholder {
      font-weight: 500;
    }
  }

  /* ALL HOVER AND FOCUS STATES - COMPLETELY CLEAN, NO INTERNAL HIGHLIGHT BOXES */
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover,
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-error):hover,
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper-focused,
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper-focused.ant-input-affix-wrapper-focused {
    /* ABSOLUTELY NO internal highlighting or boxes */
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    outline: none !important;
    border-style: none !important;
    border-width: 0 !important;

    /* Maintain rounded appearance ONLY on container */
    @media only screen and ${media.md} {
      border-radius: 3.125rem !important;
    }
  }

  /* Override Ant Design default classes complètement */
  && *[class*="ant-input-"] {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Specifically target Ant Design input wrapper classes */
  && .ant-input-wrapper:has(.ant-input),
  && .ant-input-wrapper input,
  && .ant-input-affix-wrapper .ant-input[type="text"],
  && .ant-input-affix-wrapper .ant-input {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }
`;

export const Space = styled(BaseSpace)`
  & > .ant-space-item:last-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
