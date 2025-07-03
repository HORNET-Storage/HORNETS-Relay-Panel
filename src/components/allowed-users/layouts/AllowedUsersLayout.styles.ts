import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { Card } from 'antd';

export const Container = styled.div`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  ${media.md} {
    padding: 1rem;
  }
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  ${media.md} {
    margin-bottom: 1.5rem;
  }
`;

export const Title = styled.h1`
  font-size: ${FONT_SIZE.xxl};
  font-weight: ${FONT_WEIGHT.semibold};
  margin-bottom: 0.5rem;
  color: var(--text-main-color);

  ${media.md} {
    font-size: ${FONT_SIZE.xl};
  }
`;

export const Subtitle = styled.p`
  font-size: ${FONT_SIZE.md};
  color: var(--text-secondary-color);
  margin: 0;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export const ErrorContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

export const SaveSection = styled.div`
  padding: 1.5rem;
  background: var(--background-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color-base);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChangesIndicator = styled.span`
  color: var(--warning-color);
  font-size: 14px;
  font-style: italic;
`;
export const ContentCard = styled(Card)`
  background: var(--secondary-background-color);
  border-color: var(--border-base-color);

`;