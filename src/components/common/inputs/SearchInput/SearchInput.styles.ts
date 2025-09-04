import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseInput } from '../BaseInput/BaseInput';
import { BaseSpace } from '../../BaseSpace/BaseSpace';

export const SearchInput = styled(BaseInput.Search)`
  /* LIQUID BLUE THEME ROUNDED GLASS CONTAINER - MINIMAL SIZE */
  background: rgba(0, 255, 255, 0.03) !important;
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
  border: 1px solid rgba(0, 255, 255, 0.12) !important;
  border-radius: 1.25rem !important;
  padding: 0.125rem !important;
    /* Very subtle shadow */
  box-shadow: 0 1px 4px rgba(0, 255, 255, 0.03) !important;

  /* Mobile adjustments */
  @media only screen and (max-width: ${media.md}) {
    border-radius: 1rem !important;
    padding: 0.1rem !important;
  }

  /* Desktop specific settings */
  @media only screen and ${media.md} {
    padding: 0.15rem !important;
    border-radius: 1.25rem !important;
  }

  /* Liquid Blue Theme - Search prefix icon */
  & .ant-input-prefix {
    margin: 0.2rem;
    color: #06B6D4 !important; /* Muted cyan for search icon */
  }

  & .ant-input-search-button {
    height: 2.5rem;
    box-shadow: none;
  }

  &.ant-input-search-large .ant-input-search-button {
    height: 3rem;
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
      border-radius: 1.25rem !important;
      padding: 0.15rem 0.5rem !important;
    }
  }

  /* Liquid Blue Theme - Input group wrapper - NO internal highlighting */
  && .ant-input-group-addon {
    min-width: 4rem;
    color: #06B6D4 !important; /* Muted cyan */
    font-weight: ${FONT_WEIGHT.medium};
    font-size: ${FONT_SIZE.md};
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Liquid Blue Theme - Search button with muted cyan */
  && .ant-input-search-button {
    &.ant-btn .anticon {
      color: #06B6D4 !important; /* Muted cyan */
    }
    width: 100%;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    color: #06B6D4 !important; /* Muted cyan */
  }

  /* Remove background from main input - restore rounded corners */
  && input {
    font-weight: 500;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    outline: none !important;

    /* Restore rounded corners */
    @media only screen and ${media.md} {
      border-radius: 1.25rem !important;
      font-size: 0.9rem;
    }

    &::placeholder {
      font-weight: 400;
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
      border-radius: 1.25rem !important;
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
