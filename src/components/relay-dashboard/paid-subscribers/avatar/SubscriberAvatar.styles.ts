import styled from 'styled-components';

interface StoriesInternalProps {
  $viewed: boolean;
}

export const CreatorButton = styled.button<StoriesInternalProps>`
  display: flex;
  width: 100%;
  align-items: center;
  text-align: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  border-radius: 50%;
  height: 100%;
  min-width: 5rem;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  border: 3px solid ${(props) => (!props.$viewed ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)')};
`;

export const Avatar = styled.img`
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;