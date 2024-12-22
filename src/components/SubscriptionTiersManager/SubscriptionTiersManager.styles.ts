import styled from 'styled-components';
import { BaseButton } from '../common/BaseButton/BaseButton';
export const TierWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: rgb(11, 11, 34);
  height: 100%;
  padding: 1rem;
  font-size: .95rem;
  padding-bottom: 1.5rem;
  border-radius: 1rem;
  -webkit-box-shadow: 2px 6px 29px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 6px 29px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 2px 6px 29px -7px rgba(0, 0, 0, 0.75);
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RemoveTierButton = styled(BaseButton)`
  background-color: #1b1b38;
  color: white;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  &:hover {
    background-color:rgb(216, 70, 65);
    color: white;
  }
    .anticon {
    padding-top: .2rem;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 8px;
`;

export const AddTierButton = styled(BaseButton)`
  -webkit-box-shadow: 2px 6px 29px -6px rgba(0, 0, 0, 0.55);
  -moz-box-shadow: 2px 6px 29px -6px rgba(0, 0, 0, 0.55);
  box-shadow: 2px 6px 29px -6px rgba(0, 0, 0, 0.55);
`;

export const InfoText = styled.small` 
color:rgb(209, 212, 218);
`;