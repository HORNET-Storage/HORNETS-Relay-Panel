import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { FONT_SIZE, media } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const WrapperRow = styled(BaseRow)`
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  align-items: center;
  position: relative;

  @media only screen and ${media.xl} {
    margin-bottom: 1.25rem;
    margin-top: 0.75rem;
  }
`;

export const Title = styled(BaseTypography.Title)`
  &.ant-typography {
    margin-bottom: 0;
    padding: 0 1rem 0 0.75rem;
    font-size: ${FONT_SIZE.md};

    @media only screen and ${media.xl} {
      font-size: ${FONT_SIZE.lg};
      padding: 0 1.5rem 0 1rem;
    }
  }
`;
