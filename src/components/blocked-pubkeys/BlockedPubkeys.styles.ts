import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TitleWrapper = styled.div`
  flex: 1;
`;

export const NavContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

export const NavLink = styled.div<{ active: boolean }>`
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  color: ${(props) => (props.active ? 'var(--primary-color)' : '#8c8c8c')};
  border-bottom: 2px solid ${(props) => (props.active ? 'var(--primary-color)' : 'transparent')};
  margin-right: 24px;
  transition: all 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

export const FlagCountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
`;

export const CircularBadge = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: ${(props) => props.color};
  color: #fff;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 8px;
`;
