import React, { useRef, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NFTCardHeader } from '@app/components/relay-dashboard/common/NFTCardHeader/NFTCardHeader';
import { ViewAll } from '@app/components/relay-dashboard/common/ViewAll/ViewAll';
import { SubscriberAvatar } from '@app/components/relay-dashboard/paid-subscribers/avatar/SubscriberAvatar';
import { SubscriberDetailModal } from './SubscriberDetailModal/SubscriberDetailModal';
import * as S from './PaidSubscribers.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { SplideCarousel } from '@app/components/common/SplideCarousel/SplideCarousel';
import { useResponsive } from '@app/hooks/useResponsive';
import usePaidSubscribers, { SubscriberProfile } from '@app/hooks/usePaidSubscribers';
import { Row, Col, Typography } from 'antd';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { nip19 } from 'nostr-tools';
import { UserOutlined } from '@ant-design/icons';
import { CreatorButton } from './avatar/SubscriberAvatar.styles';

const { Text } = Typography;

export const PaidSubscribers: React.FC = () => {
  const { subscribers, fetchMore, hasMore, loading, useDummyData } = usePaidSubscribers(12);

  // Modal state for subscriber details
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Modal state for view all subscribers
  const [isViewAllModalVisible, setIsViewAllModalVisible] = useState(false);

  // Sort profiles for consistent display
  const sortedProfiles = useMemo(() => {
    return [...subscribers].sort((a, b) => a.pubkey.localeCompare(b.pubkey));
  }, [subscribers]);

  // Handle opening subscriber detail modal
  const handleOpenSubscriberDetails = (subscriber: SubscriberProfile) => {
    setSelectedSubscriber(subscriber);
    setIsModalVisible(true);
  };

  // Handle closing subscriber detail modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSubscriber(null);
  };

  // Handle opening view all modal
  const handleViewAll = async () => {
    setIsViewAllModalVisible(true);

    // Fetch more subscribers if available
    let canFetchMore = hasMore;
    while (canFetchMore) {
      try {
        await fetchMore();
        canFetchMore = false; // For now, just fetch once more
      } catch (error) {
        break;
      }
    }
  };

  // Handle closing view all modal
  const handleCloseViewAllModal = () => {
    setSelectedSubscriber(null);
    setIsViewAllModalVisible(false);
  };

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

  // View All Modal Component - rendered via portal
  const ViewAllModal = () => {
    if (!isViewAllModalVisible) return null;
    
    return ReactDOM.createPortal(
      <BaseModal
        title={t('nft.allPaidSubscribers')}
        open={isViewAllModalVisible}
        onCancel={handleCloseViewAllModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
        centered
        destroyOnClose
      >
        <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
          {sortedProfiles.map((subscriber) => (
            <Col key={subscriber.pubkey} xs={24} sm={24} md={12} lg={12} xl={12}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid var(--border-color-base)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'var(--background-color-secondary)',
                  gap: '16px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => {
                  setSelectedSubscriber(subscriber);
                  setIsModalVisible(true);
                  setIsViewAllModalVisible(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-color-light)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-color-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {subscriber.picture ? (
                    <img
                      src={subscriber.picture}
                      alt={subscriber.name || 'Subscriber'}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--primary-color)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--background-color-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid var(--primary-color)',
                      }}
                    >
                      <UserOutlined style={{ fontSize: '24px', color: 'var(--text-light-color)' }} />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <Text
                    strong
                    style={{
                      fontSize: '16px',
                      color: 'var(--text-main-color)',
                      margin: 0,
                    }}
                  >
                    {subscriber.name || 'Anonymous User'}
                  </Text>
                  <Text
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary-color)',
                      fontFamily: 'monospace',
                      margin: 0,
                      lineHeight: '1.2',
                    }}
                  >
                    {(() => {
                      try {
                        return nip19.npubEncode(subscriber.pubkey);
                      } catch {
                        // Fallback to original hex format if encoding fails
                        return subscriber.pubkey;
                      }
                    })()}
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </BaseModal>,
      document.body
    );
  };

  // Simple grid for few subscribers
  if (subscribers.length > 0 && subscribers.length < 7) {
    return (
      <S.ComponentWrapper>
        <NFTCardHeader title={t('nft.paidSubs')}>
          <S.IconContainer>
            <ViewAll bordered={false} onClick={handleViewAll} />
          </S.IconContainer>
        </NFTCardHeader>

        <S.FlexWrapper>
          {sortedProfiles.map((subscriber, index) => (
            <S.CardWrapper key={`${subscriber.pubkey}-${index}`}>
              {subscriber.picture ? (
                <SubscriberAvatar
                  img={subscriber.picture || ''}
                  viewed={false}
                  onStoryOpen={() => handleOpenSubscriberDetails(subscriber)}
                />
              ) : (
                <CreatorButton $viewed={false} onClick={() => handleOpenSubscriberDetails(subscriber)}>
                  <UserOutlined style={{ fontSize: '5rem', color: 'var(--text-light-color)' }} />
                </CreatorButton>
              )}
            </S.CardWrapper>
          ))}
        </S.FlexWrapper>

        <SubscriberDetailModal loading={loading} subscriber={selectedSubscriber} isVisible={isModalVisible} onClose={handleCloseModal} />

        {/* View All Subscribers Modal - rendered via portal */}
        <ViewAllModal />
      </S.ComponentWrapper>
    );
  }

  // Carousel view for 7+ subscribers
  return (
    <S.ComponentWrapper>
      <SplideCarousel
        ref={sliderRef}
        type={shouldUseLoop ? 'loop' : undefined}
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
          <S.IconContainer>
            <ViewAll bordered={false} onClick={handleViewAll} />
            {isTabletOrHigher && subscribers.length > 1 && (
              <>
                <S.ArrowBtn type="text" size="small" onClick={goPrev}>
                  <LeftOutlined />
                </S.ArrowBtn>
                <S.ArrowBtn type="text" size="small" onClick={goNext}>
                  <RightOutlined />
                </S.ArrowBtn>
              </>
            )}
          </S.IconContainer>
        </NFTCardHeader>
        <SplideTrack>
          {!loading &&
            sortedProfiles.map((subscriber, index) => (
              <SplideSlide key={subscriber.pubkey}>
                <S.CardWrapper key={`${subscriber.pubkey}-${index}`}>
                  {subscriber.picture ? (
                    <SubscriberAvatar
                      onStoryOpen={() => handleOpenSubscriberDetails(subscriber)}
                      img={subscriber.picture || ''}
                      viewed={false}
                    />
                  ) : (
                    <CreatorButton $viewed={false} onClick={() => handleOpenSubscriberDetails(subscriber)}>
                      <UserOutlined style={{ fontSize: '5rem', color: 'var(--text-light-color)' }} />
                    </CreatorButton>
                  )}
                </S.CardWrapper>
              </SplideSlide>
            ))}
        </SplideTrack>
      </SplideCarousel>

      {isModalVisible && (
        <SubscriberDetailModal loading={loading} subscriber={selectedSubscriber} isVisible={isModalVisible} onClose={handleCloseModal} />
      )}

      {/* View All Subscribers Modal - rendered via portal */}
      <ViewAllModal />
    </S.ComponentWrapper>
  );
};

export default PaidSubscribers;