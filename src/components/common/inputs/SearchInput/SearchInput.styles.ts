import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseInput } from '../BaseInput/BaseInput';
import { BaseSpace } from '../../BaseSpace/BaseSpace';

export const SearchInput = styled(BaseInput.Search)`
  width: 100% !important;  /* Full width of container */
  max-width: 350px !important;  /* Fixed max width at 350px */
  
  /* LIQUID GLASS GREEN - Even more transparent and subtle */
  background:
    /* Primary liquid glass green background - INCREASED TRANSPARENCY */
    linear-gradient(135deg,
      rgba(45, 212, 191, 0.12),  /* Very subtle liquid glass teal */
      rgba(20, 184, 166, 0.15),  /* More transparent teal */
      rgba(6, 182, 212, 0.12)    /* Very light cyan accent */
    ),
    /* Secondary layer for depth - VERY SUBTLE */
    linear-gradient(180deg,
      rgba(34, 197, 94, 0.08) 0%,   /* Extremely subtle green top */
      rgba(45, 212, 191, 0.10) 50%,  /* Very transparent teal middle */
      rgba(6, 182, 212, 0.08) 100%   /* Very light cyan bottom */
    ),
    /* Even more transparent dark base */
    linear-gradient(to bottom,
      rgba(13, 42, 40, 0.20),  /* Extremely transparent dark teal base */
      rgba(17, 52, 50, 0.25)   /* Very transparent bottom */
    ) !important;
    backdrop-filter: blur(12px) saturate(140%) brightness(1.05) !important;
    -webkit-backdrop-filter: blur(12px) saturate(140%) brightness(1.05) !important;
    /* LIQUID GREEN OUTLINE - Multi-layered glowing border */
    border: 3px solid transparent !important;
    background-clip: padding-box !important;
    border-radius: 2rem !important;  /* Fully rounded edges */
    padding: 0 !important;  /* Remove padding to prevent double box appearance */
  /* Create very subtle liquid green outline - MINIMAL visibility */
  box-shadow:
    /* Very thin liquid green outline only */
    0 0 0 0.5px rgba(34, 197, 94, 0.15),     /* Extremely subtle green outline */
    0 0 0 1px rgba(45, 212, 191, 0.08),      /* Very faint teal second layer */
    /* Very minimal shadow effects */
    0 1px 4px rgba(45, 212, 191, 0.04),
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -1px 2px rgba(45, 212, 191, 0.02) !important;
  /* Animated gradient border using pseudo-element */
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  animation: searchGlow 3s ease-in-out infinite;  /* Always glowing */

  /* Mobile adjustments */
  @media only screen and (max-width: ${media.md}) {
    border-radius: 1.5rem !important;
    padding: 0 !important;  /* No padding to prevent double box */
  }

  /* Desktop specific settings */
  @media only screen and ${media.md} {
    padding: 0 !important;  /* No padding to prevent double box */
    border-radius: 2rem !important;  /* Fully rounded edges */
  }

  /* ANIMATED LIQUID GREEN BORDER - Using ::after for border animation */
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(
      45deg,
      rgba(34, 197, 94, 0.12),     /* Very subtle green */
      rgba(45, 212, 191, 0.15),   /* Very subtle teal */
      rgba(16, 185, 129, 0.12),    /* Very subtle emerald */
      rgba(6, 182, 212, 0.10),    /* Very subtle cyan */
      rgba(34, 197, 94, 0.12)      /* Back to very subtle green */
    );
    background-size: 400% 400%;
    border-radius: 2rem;
    z-index: -1;
    animation: liquidBorderFlow 8s ease infinite;
  }

  /* Permanent liquid glass overlay effect - MORE VISIBLE */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(45, 212, 191, 0.06) 45%,  /* Very subtle shimmer */
      rgba(20, 184, 166, 0.08) 50%,
      rgba(45, 212, 191, 0.06) 55%,
      transparent 70%
    );
    background-size: 200% 100%;
    animation: shimmerWave 4s linear infinite;
    border-radius: 2rem;
    pointer-events: none;
    z-index: 1;
  }

  /* Liquid border flow animation */
  @keyframes liquidBorderFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes shimmerWave {
    0% {
      background-position: -200% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  /* FOCUS STATE - Slightly more visible when selected */
  &:focus-within {
    background:
      linear-gradient(135deg,
        rgba(45, 212, 191, 0.15),  /* Slightly more visible on focus */
        rgba(20, 184, 166, 0.18),
        rgba(6, 182, 212, 0.15)
      ),
      linear-gradient(180deg,
        rgba(34, 197, 94, 0.10) 0%,
        rgba(45, 212, 191, 0.12) 50%,
        rgba(6, 182, 212, 0.10) 100%
      ),
      linear-gradient(to bottom,
        rgba(13, 42, 40, 0.25),
        rgba(17, 52, 50, 0.30)
      ) !important;
    box-shadow:
      /* Very thin liquid green outline on focus - minimal */
      0 0 0 1px rgba(34, 197, 94, 0.20),   /* Subtle green outline */
      0 0 0 1.5px rgba(45, 212, 191, 0.10),  /* Very faint teal second layer */
      /* Very minimal effects */
      0 2px 6px rgba(45, 212, 191, 0.05),
      inset 0 1px 2px rgba(255, 255, 255, 0.05),
      inset 0 -1px 2px rgba(45, 212, 191, 0.03) !important;
    transform: scale(1.01);  /* Subtle grow effect */
  }

  /* Hover state - very slightly brighter liquid glass */
  &:hover {
    background:
      linear-gradient(135deg,
        rgba(45, 212, 191, 0.14),
        rgba(20, 184, 166, 0.17),
        rgba(6, 182, 212, 0.14)
      ),
      linear-gradient(180deg,
        rgba(34, 197, 94, 0.09) 0%,
        rgba(45, 212, 191, 0.11) 50%,
        rgba(6, 182, 212, 0.09) 100%
      ),
      linear-gradient(to bottom,
        rgba(13, 42, 40, 0.22),
        rgba(17, 52, 50, 0.27)
      ) !important;
    box-shadow:
      /* Hover state very thin liquid green outline - minimal */
      0 0 0 0.8px rgba(34, 197, 94, 0.18),  /* Very subtle green outline */
      0 0 0 1.2px rgba(45, 212, 191, 0.09), /* Very faint teal second layer */
      /* Very minimal effects */
      0 1.5px 5px rgba(45, 212, 191, 0.05),
      inset 0 1px 2px rgba(255, 255, 255, 0.05),
      inset 0 -1px 2px rgba(45, 212, 191, 0.03) !important;
  }

  /* Continuous glow animation - much dimmer liquid glass green theme */
  @keyframes searchGlow {
    0%, 100% {
      box-shadow:
        /* Very thin pulsing liquid green outline - minimal visibility */
        0 0 0 0.5px rgba(34, 197, 94, 0.15),
        0 0 0 1px rgba(45, 212, 191, 0.08),
        /* Very minimal glows */
        0 1px 4px rgba(45, 212, 191, 0.04),
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        inset 0 -1px 2px rgba(45, 212, 191, 0.02);
    }
    50% {
      box-shadow:
        /* Slightly more visible thin pulse - still very subtle */
        0 0 0 0.8px rgba(34, 197, 94, 0.18),
        0 0 0 1.3px rgba(45, 212, 191, 0.09),
        /* Very minimal glows */
        0 2px 5px rgba(45, 212, 191, 0.05),
        inset 0 1px 2px rgba(255, 255, 255, 0.05),
        inset 0 -1px 2px rgba(45, 212, 191, 0.03);
    }
  }

  /* Liquid Blue Theme - Search prefix icon with reduced glow */
  & .ant-input-prefix {
    margin: 0.5rem;  /* Adjust margin for better spacing without extra padding */
    color: rgba(6, 182, 212, 0.6) !important;
    filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.2));
    transition: all 0.3s ease;
  }

  &:focus-within .ant-input-prefix {
    color: rgba(6, 182, 212, 0.7) !important;
    filter: drop-shadow(0 0 5px rgba(6, 182, 212, 0.3));
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
  &.ant-input-group-wrapper {
    /* Remove any wrapper styling */
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  
  &.ant-input-affix-wrapper,
  &.ant-input-affix-wrapper-focused {
    /* Completely transparent inner wrapper */
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 0 !important;

    @media only screen and ${media.md} {
      border-radius: 0 !important;  /* Remove inner border radius */
      padding: 0 !important;
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

  /* Liquid Blue Theme - Search button with reduced glow */
  && .ant-input-search-button {
    &.ant-btn .anticon {
      color: rgba(6, 182, 212, 0.5) !important;
      transition: all 0.3s ease;
    }
    width: 100%;
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    color: rgba(6, 182, 212, 0.5) !important;
    transition: all 0.3s ease;

    &:hover .anticon {
      color: rgba(6, 182, 212, 0.6) !important;
      filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.2));
    }
  }

  /* Search button slightly brightens on container focus */
  &:focus-within .ant-input-search-button {
    &.ant-btn .anticon {
      color: rgba(6, 182, 212, 0.7) !important;
      filter: drop-shadow(0 0 5px rgba(6, 182, 212, 0.3));
    }
  }

  /* Remove background from main input - restore rounded corners */
  && input {
    font-weight: 500;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    outline: none !important;
    border: none !important;
    color: var(--text-main-color);
    transition: all 0.3s ease;
    padding: 0.75rem 1rem !important;  /* Add proper padding to the input itself */

    /* Restore rounded corners */
    @media only screen and ${media.md} {
      border-radius: 1.5rem !important;
      font-size: 0.9rem;
      padding: 0.75rem 1.25rem !important;  /* Slightly more padding on desktop */
    }

    &::placeholder {
      font-weight: 400;
      color: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    &:focus::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  /* Enhanced text visibility on focus */
  &:focus-within input {
    color: rgba(255, 255, 255, 0.95) !important;
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
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
