import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { SearchInput } from 'components/common/inputs/SearchInput/SearchInput';
import { BORDER_RADIUS, media } from '@app/styles/themes/constants';

export const SearchIcon = styled(SearchOutlined)`
  &.anticon.anticon-search {
    display: block;
    font-size: 1.25rem;

    @media only screen and ${media.md} {
      font-size: 1.625rem;
    }
  }
`;

export const InputSearch = styled(SearchInput)`
  .ant-input-group-addon {
    display: none;
  }

  /* Remove the extra styling that creates a second box appearance */
  @media only screen and ${media.md} {
    .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
      /* Remove all extra styling - rely only on SearchInput base styles */
      border: none !important;
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
  }
`;

export const SearchModal = styled(BaseModal)`
  border-radius: ${BORDER_RADIUS};

  & .ant-modal-body {
    padding: 0;
  }
`;

export const Btn = styled(BaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
