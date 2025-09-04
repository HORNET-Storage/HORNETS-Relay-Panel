import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseInput } from '../BaseInput/BaseInput';
import { BaseSpace } from '../../BaseSpace/BaseSpace';

export const SearchInput = styled(BaseInput.Search)`
  & .ant-input-prefix {
    margin: 0.5rem;
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

  /* Override ALL input and wrapper backgrounds - restore rounded corners */
  &.ant-input-group-wrapper,
  &.ant-input-affix-wrapper,
  &.ant-input-affix-wrapper-focused {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    @media only screen and ${media.md} {
      border-radius: 3.125rem !important;
      padding: 0.5625rem 1.25rem !important;
    }
  }

  /* Remove background from input group wrapper */
  && .ant-input-group-addon {
    min-width: 5.5rem;
    color: var(--primary-color);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.lg};
    background: transparent !important;
    border: none !important;
  }

  /* Remove background from search button */
  && .ant-input-search-button {
    &.ant-btn .anticon {
      color: var(--primary-color);
    }
    width: 100%;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: var(--primary-color);
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

  /* Remove background from wrapper state - maintain rounded corners */
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover,
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-error):hover,
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper-focused,
  && .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper-focused.ant-input-affix-wrapper-focused {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    outline: none !important;
    border-style: none !important;
    border-width: 0 !important;

    /* Maintain rounded appearance */
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
