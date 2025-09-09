import styled, { keyframes } from 'styled-components';

interface StoriesInternalProps {
  $viewed: boolean;
}

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
`;

export const CreatorButton = styled.button<StoriesInternalProps>`
  display: flex;
  width: 100%;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 0;
  cursor: pointer;
  border-radius: 50%;
  height: 100%;
  min-width: 5rem;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid ${(props) => (!props.$viewed ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)')};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
              0 0 15px ${(props) => (!props.$viewed ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)')};

  &:hover {
    animation-play-state: paused;
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3),
                0 0 25px ${(props) => (!props.$viewed ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)')};
  }
`;

export const Avatar = styled.img`
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;