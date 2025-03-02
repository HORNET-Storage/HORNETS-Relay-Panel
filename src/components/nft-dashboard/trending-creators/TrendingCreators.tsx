import React, { useRef } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NFTCardHeader } from '@app/components/nft-dashboard/common/NFTCardHeader/NFTCardHeader';
import { ViewAll } from '@app/components/nft-dashboard/common/ViewAll/ViewAll';
import { TrendingCreatorsStory } from '@app/components/nft-dashboard/trending-creators/story/TrendingCreatorsStory';
import * as S from './TrendingCreators.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { SplideCarousel } from '@app/components/common/SplideCarousel/SplideCarousel';
import { useResponsive } from '@app/hooks/useResponsive';
import useTrendingCreators from '@app/hooks/useTrendingCreators';

export const TrendingCreators: React.FC = () => {
  const { creators } = useTrendingCreators(12);
  const sliderRef = useRef<Splide>(null);
  const { isTablet: isTabletOrHigher } = useResponsive();
  const { t } = useTranslation();

  const goPrev = () => {
    if (sliderRef.current?.splide) {
      sliderRef.current.splide.go('-1');
    }
  };

  const goNext = () => {
    if (sliderRef.current?.splide) {
      sliderRef.current.splide.go('+1');
    }
  };

  return (
    <>
      <SplideCarousel
        ref={sliderRef}
        type="loop"
        drag="free"
        gap=".2rem"
        snap="false"
        autoSpeed={isTabletOrHigher ? 0.7 : 0.8}
        flickPower="500"
        breakpoints={{
          8000: {
            perPage: 10,
          },
          1920: {
            perPage: 10,
          },
          1600: {
            perPage: 8,
          },
          850: {
            perPage: 7,
          },
          768: {
            perPage: 4,
          },
        }}
      >
        <NFTCardHeader title={t('nft.paidSubs')}>
          <BaseRow align="middle">
            <BaseCol>
              <ViewAll bordered={false} />
            </BaseCol>

            {isTabletOrHigher && (
              <>
                <BaseCol>
                  <S.ArrowBtn type="text" size="small" onClick={goPrev}>
                    <LeftOutlined />
                  </S.ArrowBtn>
                </BaseCol>

                <BaseCol>
                  <S.ArrowBtn type="text" size="small" onClick={goNext}>
                    <RightOutlined />
                  </S.ArrowBtn>
                </BaseCol>
              </>
            )}
          </BaseRow>
        </NFTCardHeader>
        <SplideTrack>
          {creators.map((creator) => (
            <SplideSlide key={creator.pubkey}>
              <S.CardWrapper>
                <TrendingCreatorsStory
                  onStoryOpen={() => {
                    return;
                  }}
                  img={creator.picture}
                  viewed={false}
                />
              </S.CardWrapper>
            </SplideSlide>
          ))}
        </SplideTrack>
      </SplideCarousel>
    </>
  );
};

export default TrendingCreators;