import React, { useRef, useState } from 'react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NFTCardHeader } from '@app/components/relay-dashboard/common/NFTCardHeader/NFTCardHeader';
import { ViewAll } from '@app/components/relay-dashboard/common/ViewAll/ViewAll';
import { TrendingCreatorsStory } from '@app/components/relay-dashboard/trending-creators/story/TrendingCreatorsStory';
import { getTrendingCreators, TrendingCreator } from '@app/api/trendingCreators';
import { SubscriberDetailModal } from './SubscriberDetailModal/SubscriberDetailModal';
import * as S from './TrendingCreators.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { SplideCarousel } from '@app/components/common/SplideCarousel/SplideCarousel';
import { useResponsive } from '@app/hooks/useResponsive';
import usePaidSubscribers, { SubscriberProfile } from '@app/hooks/usePaidSubscribers';
import { Row, Col } from 'antd';

export const TrendingCreators: React.FC = () => {
  console.log('[TrendingCreators] Component rendering...');
  const hookResult = usePaidSubscribers(12);
  const { subscribers } = hookResult;
  
  // Modal state for subscriber details
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Handle opening subscriber detail modal
  const handleOpenSubscriberDetails = (subscriber: SubscriberProfile) => {
    setSelectedSubscriber(subscriber);
    setIsModalVisible(true);
  };
  
  // Handle closing subscriber detail modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  
  console.log('[TrendingCreators] Received subscribers:', subscribers);
  console.log('[TrendingCreators] Complete hook result:', hookResult);
  
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

  // Determine whether to use carousel with looping based on count
  const shouldUseLoop = subscribers.length >= 7;
  
  // Simple grid for few subscribers
  if (subscribers.length > 0 && subscribers.length < 7) {
    return (
      <>
        <NFTCardHeader title={t('nft.paidSubs')}>
          <BaseRow align="middle">
            <BaseCol>
              <ViewAll bordered={false} />
            </BaseCol>
          </BaseRow>
        </NFTCardHeader>
        
        <Row gutter={[16, 16]} style={{ padding: '0 10px' }}>
          {subscribers.map((subscriber: SubscriberProfile) => (
            <Col key={subscriber.pubkey} xs={6} sm={4} md={3} lg={3} xl={2}>
              <S.CardWrapper>
                <TrendingCreatorsStory
                  onStoryOpen={() => handleOpenSubscriberDetails(subscriber)}
                  img={subscriber.picture}
                  viewed={false}
                />
              </S.CardWrapper>
            </Col>
          ))}
        </Row>
        
        <SubscriberDetailModal 
          subscriber={selectedSubscriber}
          isVisible={isModalVisible}
          onClose={handleCloseModal}
        />
      </>
    );
  }

  // Carousel view for 7+ subscribers
  return (
    <>
      <SplideCarousel
        ref={sliderRef}
        type={shouldUseLoop ? "loop" : undefined}
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

            {isTabletOrHigher && subscribers.length > 1 && (
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
          {subscribers.map((subscriber: SubscriberProfile) => (
            <SplideSlide key={subscriber.pubkey}>
              <S.CardWrapper>
                <TrendingCreatorsStory
                  onStoryOpen={() => handleOpenSubscriberDetails(subscriber)}
                  img={subscriber.picture}
                  viewed={false}
                />
              </S.CardWrapper>
            </SplideSlide>
          ))}
        </SplideTrack>
      </SplideCarousel>
      
      <SubscriberDetailModal 
        subscriber={selectedSubscriber}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default TrendingCreators;
