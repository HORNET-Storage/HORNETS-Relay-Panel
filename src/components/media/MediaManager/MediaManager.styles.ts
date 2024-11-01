import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseBreadcrumb } from '@app/components/common/BaseBreadcrumb/BaseBreadcrumb';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const MediaManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--background-color);
`;

export const Breadcrumb = styled(BaseBreadcrumb)<{ $is4kScreen: boolean }>`
  font-size: 1.2rem;
  padding-left: 1rem;
  color: var(--breadcrumb-color);

  ${(props) =>
    props.$is4kScreen &&
    css`
      font-size: 2rem;
    `}
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  width: 100%;
`;

export const ScrollContainer = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 1rem;
  background: var(--secondary-background-color);
  border-radius: 7px;
  box-shadow: var(--box-shadow);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  color: var(--spinner-base-color);
`;

export const MessageWrapper = styled.div`
  text-align: center;
  padding: 1rem;
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.md};
`;

export const BreadcrumbWrapper = styled.div<{ isTablet?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: 2rem;
  color: var(--breadcrumb-color);
  
  ${(props) =>
    props.isTablet &&
    css`
      padding-bottom: 0;
    `}
  
  text-align: center;
  align-items: center;
`;

export const ToolBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: var(--secondary-background-color);
  padding: 1rem;
  border-radius: 7px;
`;

export const ButtonsContainer = styled.div<{ isTablet?: boolean }>`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
  ${(props) =>
    props.isTablet &&
    css`
      padding-right: 1rem;
    `}
`;

export const MediaItemsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-top: 2rem;
  background: var(--background-color);
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-color);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scroll-color);
    border-radius: 3px;
  }
`;

export const ToolBarButton = styled(BaseButton)<{ $isActive?: boolean; $is4kScreen: boolean }>`
  font-size: 0.8rem;
  background: var(--secondary-background-color);
  transition: all 0.3s ease;

  ${(props) =>
    props.$isActive
      ? css`
          color: var(--primary-color);
          border-color: var(--primary-color);
          background: var(--secondary-background-selected-color);
        `
      : css`
          color: var(--text-main-color);
          border-color: var(--border-base-color);

          &:hover {
            color: var(--primary-color);
            border-color: var(--primary-color);
            background: var(--item-hover-bg);
          }
        `}

  ${(props) =>
    props.$is4kScreen &&
    css`
      font-size: 1.2rem;
    `}

  &:disabled {
    background: var(--disabled-bg-color);
    color: var(--disabled-color);
    border-color: var(--border-base-color);
  }
`;

export const EmptyStateMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-light-color);
  font-size: ${FONT_SIZE.md};
  background: var(--secondary-background-color);
  border-radius: 7px;
  margin: 1rem 0;
`;

export const MediaItemWrapper = styled.div`
  background: var(--secondary-background-color);
  border-radius: 7px;
  padding: 1rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-base-color);

  &:hover {
    box-shadow: var(--box-shadow-hover);
    transform: translateY(-2px);
    border-color: var(--primary-color);
  }

  .media-item-title {
    color: var(--text-main-color);
    margin-top: 0.5rem;
    font-size: ${FONT_SIZE.md};
  }

  .media-item-meta {
    color: var(--text-light-color);
    font-size: ${FONT_SIZE.xs};
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--background-rgb-color), 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;