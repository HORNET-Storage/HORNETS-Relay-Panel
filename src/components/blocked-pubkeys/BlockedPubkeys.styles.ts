import styled from 'styled-components';
import Card from 'antd/lib/card/Card';
import { Input } from 'antd';
import { BaseCol } from '../common/BaseCol/BaseCol';

/* Let global styles handle the search input - no custom overrides needed */
export const InputRoot = styled(Input)``;
export const BaseColRoot = styled(BaseCol)`
  overflow: auto;
  border-radius: 8px;
  height: 100%;
`;
export const TableContainer = styled.div`
  border-radius: 12px;
  margin: 0 2px;
  padding-top: 0.4rem;
  padding-bottom: 2rem;
  background-color: var(--secondary-background-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-base-color);
`;
export const CardRoot = styled(Card)`
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--background-color);
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
`;

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
export const EmptyList = styled.div`
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light-color);
  border-bottom: none;
`;
