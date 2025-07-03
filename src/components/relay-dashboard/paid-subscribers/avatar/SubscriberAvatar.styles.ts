import styled from 'styled-components';

interface StoriesInternalProps {
  $viewed: boolean;
}

export const CreatorButton = styled.button<StoriesInternalProps>`
  display: flex;
  width: 100%;
  align-items: center;
  text-align: center;
  background: 0 0;
  border: 0;
  cursor: pointer;
  border-radius: 50%;
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  border: 3px solid ${(props) => (!props.$viewed ? 'var(--primary-color)' : 'var(--text-superLight-color)')};
`;

export const Avatar = styled.img`
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;