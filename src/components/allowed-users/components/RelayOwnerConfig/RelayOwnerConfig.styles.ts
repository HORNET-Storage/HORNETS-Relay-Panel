import styled from 'styled-components';
import { media } from '../../../../styles/themes/constants';

export const Container = styled.div`
  width: 100%;
`;

export const NpubSection = styled.div`
  margin-top: 1rem;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--text-main-color);
  font-size: 16px;
  font-weight: 600;
`;

export const SectionDescription = styled.p`
  margin: 0 0 1rem 0;
  color: var(--text-secondary-color);
  font-size: 14px;
  line-height: 1.4;
`;

export const InputContainer = styled.div`
  margin-bottom: 0.75rem;
`;

export const AutoDetectedIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(82, 196, 26, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(82, 196, 26, 0.3);
`;

export const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 77, 79, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 77, 79, 0.3);
`;
