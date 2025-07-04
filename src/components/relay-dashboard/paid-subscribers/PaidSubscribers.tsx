import React, { useRef, useState, useEffect, useMemo } from 'react';
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
import { Row, Col, Modal, Typography } from 'antd';
import { nip19 } from 'nostr-tools';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';
import { convertNDKUserProfileToSubscriberProfile } from '@app/utils/utils';
import { UserOutlined } from '@ant-design/icons';
import { CreatorButton } from './avatar/SubscriberAvatar.styles';
const { Text } = Typography;

export const PaidSubscribers: React.FC = () => {
  console.log('[PaidSubscribers] Component rendering...');
  const hookResult = usePaidSubscribers(12);
  const { subscribers, fetchMore, hasMore, loading, useDummyData } = hookResult;
  const ndkInstance = useNDK();

  // Modal state for subscriber details
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Modal state for view all subscribers
  const [isViewAllModalVisible, setIsViewAllModalVisible] = useState(false);
  const [allSubscribers, setAllSubscribers] = useState<SubscriberProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const [subscriberProfiles, setSubscriberProfiles] = useState<Map<string, SubscriberProfile>>(
    () => new Map(subscribers.map((s) => [s.pubkey, s])),
  );
  const sortedProfiles = useMemo(() => {
    return Array.from(subscriberProfiles.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [subscriberProfiles]);
  useEffect(() => {
    setSubscriberProfiles((prev) => {
      const map = new Map(prev);
      for (const s of subscribers) {
        if (!map.has(s.pubkey)) {
          map.set(s.pubkey, s);
        }
      }
      return map;
    });
  }, [subscribers]);

  // Handle opening subscriber detail modal
  const handleOpenSubscriberDetails = (subscriber: SubscriberProfile) => {
    setSelectedSubscriber(subscriber);
    setIsModalVisible(true);
  };

  // Handle closing subscriber detail modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const updateSubscriberProfile = (pubkey: string, profile: SubscriberProfile) => {
    setSubscriberProfiles((prev) => {
      const newMap = new Map(prev);
      newMap.set(pubkey, profile);
      return newMap;
    });
  };
  // Handle opening view all modal
  const handleViewAll = async () => {
    setIsViewAllModalVisible(true);
    setAllSubscribers([...subscribers]); // Start with current subscribers

    // Fetch more subscribers if available
    const currentSubscribers = [...subscribers];
    let canFetchMore = hasMore;

    while (canFetchMore) {
      try {
        await fetchMore();
        // Note: This is a simplified approach. In a real scenario, you'd want to
        // track the updated state properly or use a separate hook for fetching all
        canFetchMore = false; // For now, just fetch once more
      } catch (error) {
        console.error('Error fetching more subscribers:', error);
        break;
      }
    }
  };
 
  useEffect(() => {
    // Fetch profiles for test subscribers
    if (useDummyData) {
      console.warn('[PaidSubscribers] Using dummy data, skipping profile fetch');
      setLoadingProfiles(false);
      return;
    }
    const fetchProfiles = async () => {
      if (!ndkInstance || !ndkInstance.ndk) {
        console.error('NDK instance is not initialized');
        return;
      }
      //1. map through subscribers and fetch profiles. skip profile if already on map
      await Promise.all(
        subscribers.map(async (subscriber) => {
          if (
            subscriberProfiles.has(subscriber.pubkey) &&
            subscriberProfiles.get(subscriber.pubkey)?.picture &&
            subscriberProfiles.get(subscriber.pubkey)?.about
          ) {
            return subscriberProfiles.get(subscriber.pubkey);
          }
          try {
            if (!ndkInstance.ndk) {
              console.error('NDK instance is not available');
              return null;
            }
            const user = await ndkInstance.ndk?.getUser({ pubkey: subscriber.pubkey }).fetchProfile();
            if (user) {
              // Convert NDKUserProfile to SubscriberProfile and add to map
              const covertedNDKUserProfile = convertNDKUserProfileToSubscriberProfile(subscriber.pubkey, user);
              updateSubscriberProfile(subscriber.pubkey, covertedNDKUserProfile);

              return user;
            }
          } catch (error) {
            console.error(`Error fetching profile for ${subscriber.pubkey}:`, error);
          }
          return null;
        }),
      );
      setLoadingProfiles(false);
    };
    fetchProfiles();
  }, [subscribers, ndkInstance]);

  // Handle closing view all modal
  const handleCloseViewAllModal = () => {
    setSelectedSubscriber(null);
    setIsViewAllModalVisible(false);
  };

  console.log('[PaidSubscribers] Received subscribers:', subscribers);
  console.log('[PaidSubscribers] Complete hook result:', hookResult);

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
              <ViewAll bordered={false} onClick={handleViewAll} />
            </BaseCol>
          </BaseRow>
        </NFTCardHeader>

        <S.FlexWrapper>
          {sortedProfiles.map(([pubkey, subscriber], index) => (
            <S.CardWrapper key={`${pubkey}-${index}`}>
              {subscriber.picture ? (
                <SubscriberAvatar
                  img={subscriber.picture || ''}
                  viewed={false}
                  onStoryOpen={() => handleOpenSubscriberDetails(subscriber)}
                />
              ) : (
                <CreatorButton $viewed={false}>
                  <UserOutlined style={{ fontSize: '5rem', color: 'var(--text-light-color)' }} />
                </CreatorButton>
              )}
            </S.CardWrapper>
          ))}
        </S.FlexWrapper>

        <SubscriberDetailModal  loading={loading} subscriber={selectedSubscriber} isVisible={isModalVisible} onClose={handleCloseModal} />

        {/* View All Subscribers Modal */}
        <Modal
          title={t('nft.allPaidSubscribers')}
          open={isViewAllModalVisible}
          onCancel={handleCloseViewAllModal}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
            {sortedProfiles.map(([pubkey, subscriber]) => (
              <Col key={pubkey} xs={24} sm={24} md={24} lg={24} xl={24}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid var(--border-color-base)',
                    borderRadius: '12px',
                    marginBottom: '12px',
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
        </Modal>
      </>
    );
  }

  // Carousel view for 7+ subscribers
  return (
    <>
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
          <BaseRow align="middle">
            <BaseCol>
              <ViewAll bordered={false} onClick={handleViewAll} />
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
          {!loadingProfiles &&
            sortedProfiles.map(([pubkey, subscriber], index) => (
              <SplideSlide key={pubkey}>
              <S.CardWrapper key={`${pubkey}-${index}`}>
                  {subscriber.picture ? (
                    <SubscriberAvatar
                      onStoryOpen={() => handleOpenSubscriberDetails(subscriber)}
                      img={subscriber.picture || ''}
                      viewed={false}
                    />
                  ) : (
                    <CreatorButton $viewed={false}>
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

      {/* View All Subscribers Modal */}
      <Modal
        title={t('nft.allPaidSubscribers')}
        open={isViewAllModalVisible}
        onCancel={handleCloseViewAllModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
          {sortedProfiles.map(([pubkey, subscriber]) => (
            <Col key={pubkey} xs={24} sm={24} md={24} lg={24} xl={24}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid var(--border-color-base)',
                  borderRadius: '12px',
                  marginBottom: '12px',
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
      </Modal>
    </>
  );
};

export default PaidSubscribers;
