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

// LRU Cache implementation for profile caching
interface CachedProfile {
  profile: SubscriberProfile;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

const PROFILE_CACHE_DURATION = 600000; // 10 minutes in milliseconds
const MAX_CACHE_SIZE = 5000; // Maximum number of cached profiles
const CLEANUP_INTERVAL = 300000; // Clean up every 5 minutes
const MAX_REQUEST_CACHE_SIZE = 100; // Maximum concurrent requests

class ProfileCache {
  private cache = new Map<string, CachedProfile>();
  private requestCache = new Map<string, Promise<SubscriberProfile>>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, CLEANUP_INTERVAL);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    // Find expired entries - convert to array first to avoid iterator issues
    const cacheEntries = Array.from(this.cache.entries());
    for (const [key, cached] of cacheEntries) {
      if (now - cached.timestamp > PROFILE_CACHE_DURATION) {
        expiredKeys.push(key);
      }
    }

    // Remove expired entries
    expiredKeys.forEach(key => this.cache.delete(key));

    // If still over capacity, remove least recently used entries
    if (this.cache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      const toRemove = entries.slice(0, this.cache.size - MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }

    // Cleanup request cache if it gets too large
    if (this.requestCache.size > MAX_REQUEST_CACHE_SIZE) {
      this.requestCache.clear();
    }

  }

  getCachedProfile(pubkey: string): SubscriberProfile | null {
    const cached = this.cache.get(pubkey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > PROFILE_CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(pubkey);
      return null;
    }
    
    // Update access statistics
    cached.accessCount++;
    cached.lastAccessed = Date.now();
    
    return cached.profile;
  }

  setCachedProfile(pubkey: string, profile: SubscriberProfile): void {
    const now = Date.now();
    this.cache.set(pubkey, {
      profile,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    });

    // Trigger cleanup if cache is getting too large
    if (this.cache.size > MAX_CACHE_SIZE * 1.1) {
      this.cleanup();
    }
  }

  getRequestPromise(pubkey: string): Promise<SubscriberProfile> | null {
    return this.requestCache.get(pubkey) || null;
  }

  setRequestPromise(pubkey: string, promise: Promise<SubscriberProfile>): void {
    this.requestCache.set(pubkey, promise);
    
    // Clean up when promise completes
    promise.finally(() => {
      this.requestCache.delete(pubkey);
    });
  }

  getCacheStats(): { size: number; requestCacheSize: number } {
    return {
      size: this.cache.size,
      requestCacheSize: this.requestCache.size
    };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
    this.requestCache.clear();
  }
}

// Global profile cache instance
const globalProfileCache = new ProfileCache();

// Helper functions for backward compatibility
const getCachedProfile = (pubkey: string): SubscriberProfile | null => {
  return globalProfileCache.getCachedProfile(pubkey);
};

const setCachedProfile = (pubkey: string, profile: SubscriberProfile): void => {
  globalProfileCache.setCachedProfile(pubkey, profile);
};

export const PaidSubscribers: React.FC = () => {
  const hookResult = usePaidSubscribers(12);
  const { subscribers, fetchMore, hasMore, loading, useDummyData } = hookResult;
  const ndkInstance = useNDK();

  // Modal state for subscriber details
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Modal state for view all subscribers
  const [isViewAllModalVisible, setIsViewAllModalVisible] = useState(false);
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
    // Cache the profile globally
    setCachedProfile(pubkey, profile);
  };
  // Handle opening view all modal
  const handleViewAll = async () => {
    setIsViewAllModalVisible(true);

    // Fetch more subscribers if available
    let canFetchMore = hasMore;

    while (canFetchMore) {
      try {
        await fetchMore();
        // Note: This is a simplified approach. In a real scenario, you'd want to
        // track the updated state properly or use a separate hook for fetching all
        canFetchMore = false; // For now, just fetch once more
      } catch (error) {
        break;
      }
    }
  };
 
  useEffect(() => {
    // Implement hybrid profile fetching with 10-minute caching
    if (useDummyData) {
      setLoadingProfiles(false);
      return;
    }

    const fetchSingleProfile = async (subscriber: SubscriberProfile): Promise<SubscriberProfile> => {
      // Check if we already have a cached profile that's still valid
      const cachedProfile = getCachedProfile(subscriber.pubkey);
      if (cachedProfile) {
        return cachedProfile;
      }

      // Check if there's already a request in progress for this profile
      const existingRequest = globalProfileCache.getRequestPromise(subscriber.pubkey);
      if (existingRequest) {
        return existingRequest;
      }

      // Create new request
      const profileRequest = (async (): Promise<SubscriberProfile> => {
        try {
          
          if (!ndkInstance || !ndkInstance.ndk) {
            // No NDK available, return backend data
            return {
              ...subscriber,
              name: subscriber.name || 'Anonymous Subscriber',
              picture: subscriber.picture || '',
              about: subscriber.about || ''
            };
          }

          // Try to fetch profile from NDK (user's relay + other relays)
          const user = await ndkInstance.ndk?.getUser({ pubkey: subscriber.pubkey }).fetchProfile();
          
          if (user && (user.name || user.picture || user.about)) {
            // NDK returned a profile - use it as the primary source
            const ndkProfile = convertNDKUserProfileToSubscriberProfile(subscriber.pubkey, user);
            return ndkProfile;
          } else {
            // NDK came up empty - fallback to backend data
            return {
              ...subscriber,
              name: subscriber.name || 'Anonymous Subscriber',
              picture: subscriber.picture || '',
              about: subscriber.about || ''
            };
          }
        } catch (error) {
          // Error occurred - fallback to backend data
          return {
            ...subscriber,
            name: subscriber.name || 'Anonymous Subscriber',
            picture: subscriber.picture || '',
            about: subscriber.about || ''
          };
        }
      })();

      // Store the promise in cache
      globalProfileCache.setRequestPromise(subscriber.pubkey, profileRequest);

      return profileRequest;
    };

    const fetchProfiles = async () => {
      // Process each subscriber with cached hybrid approach
      await Promise.all(
        subscribers.map(async (subscriber) => {
          // Skip if we already have a complete profile in our local map
          const existingProfile = subscriberProfiles.get(subscriber.pubkey);
          const hasValidProfile = existingProfile && (
            (existingProfile.name && existingProfile.name !== 'Anonymous Subscriber') ||
            existingProfile.picture ||
            existingProfile.about
          );
          
          if (hasValidProfile) {
            return;
          }

          try {
            const profile = await fetchSingleProfile(subscriber);
            updateSubscriberProfile(subscriber.pubkey, profile);
          } catch (error) {
            // Use fallback profile
            updateSubscriberProfile(subscriber.pubkey, {
              ...subscriber,
              name: subscriber.name || 'Anonymous Subscriber',
              picture: subscriber.picture || '',
              about: subscriber.about || ''
            });
          }
        }),
      );

      setLoadingProfiles(false);
    };

    fetchProfiles();
  }, [subscribers, ndkInstance, useDummyData, subscriberProfiles]);

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
