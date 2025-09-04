import styled from 'styled-components';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const RightSideCol = styled(BaseCol)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${LAYOUT.desktop.headerHeight});
  background: rgba(0, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(0, 255, 255, 0.15);
  overflow-y: auto;
  z-index: 5;

  &::-webkit-scrollbar {
    width: 6px;
    display: none;
  }

  .liquid-element {
    animation: fadeInUp 0.6s ease-out;
  }
`;

export const LeftSideCol = styled(BaseCol)`
  @media only screen and ${media.xl} {
    padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
    height: calc(100vh - ${LAYOUT.desktop.headerHeight});
    overflow: auto;
    background: transparent;

    &::-webkit-scrollbar {
      width: 6px;
      display: none;
    }
  }

  .glass-panel {
    background: rgba(0, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.15);
    box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease-out;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
      border-color: rgba(0, 255, 255, 0.4);
      transform: translateY(-2px);
    }
  }

  .holographic-card {
    background: linear-gradient(135deg,
      rgba(0, 255, 255, 0.05) 0%,
      rgba(0, 255, 170, 0.05) 25%,
      rgba(20, 184, 166, 0.05) 50%,
      rgba(0, 221, 255, 0.05) 75%,
      rgba(0, 255, 255, 0.05) 100%);
    background-size: 400% 400%;
    animation: liquidFlow 15s ease infinite;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0, 255, 255, 0.1);
    overflow: hidden;
    position: relative;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease-out;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
      animation: rotate 10s linear infinite;
      pointer-events: none;
    }
  }
`;

// Animation keyframes for liquid blue effects
export const LiquidAnimations = styled.div`
  @keyframes liquidFlow {
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

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
    }
    50% {
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 170, 0.2);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export const Space = styled.div`
  margin: 1rem 0;
`;

export const ScrollWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 250px;

  .ant-card-body {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }

  // Hide scrollbars for WebKit browsers (e.g., Chrome, Safari)
  &::-webkit-scrollbar {
    display: none;
  }

  // Hide scrollbars for Firefox
  scrollbar-width: none;

  // Hide scrollbars for IE, Edge
  -ms-overflow-style: none;
`;

export const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 15px;

  background: black;

  min-height: 300px;
  overflow-y: auto;
`;

// Dashboard wrapper with liquid blue background
export const DashboardWrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 80px);
  background: #000000;
  overflow: hidden;

  /* Multi-layer liquid blue gradient background */
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 20%, rgba(0, 255, 170, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 60% 80%, rgba(20, 184, 166, 0.12) 0%, transparent 45%),
      radial-gradient(circle at 40% 40%, rgba(0, 221, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
    animation: liquidBackground 30s ease infinite, rotate 60s linear infinite;
  }

  /* Additional animated gradient layer */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
      rgba(0, 255, 255, 0.03) 0%,
      rgba(0, 255, 170, 0.03) 25%,
      rgba(20, 184, 166, 0.03) 50%,
      rgba(0, 221, 255, 0.03) 75%,
      rgba(0, 255, 255, 0.03) 100%);
    background-size: 400% 400%;
    animation: liquidFlow 20s ease infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Ensure content is above background layers */
  > * {
    position: relative;
    z-index: 1;
  }

  @keyframes liquidBackground {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1) rotate(0deg);
    }
    25% {
      opacity: 0.8;
      transform: scale(1.1) rotate(90deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.2) rotate(180deg);
    }
    75% {
      opacity: 0.8;
      transform: scale(1.1) rotate(270deg);
    }
  }

  @keyframes liquidFlow {
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

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Item = styled.div`
  background: red;
  height: 150px;
  flex-shrink: 0;
`;

// export const ScrollWrapper = styled.div`
//   overflow-y: auto;
//   overflow-x: hidden;
//   min-height: 250px;

//   &.scrolling {
//     &::-webkit-scrollbar {
//       display: block;
//     }

//     scrollbar-width: thin;
//     -ms-overflow-style: auto;
//   }

//   &::-webkit-scrollbar {
//     width: 6px;
//     display: none; // Default state hides the scrollbar
//   }

//   -ms-overflow-style: none; // IE and Edge
//   scrollbar-width: none; // Firefox
// `;