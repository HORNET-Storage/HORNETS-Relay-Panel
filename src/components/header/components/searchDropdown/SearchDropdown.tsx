import React, { useEffect, useRef, useState } from 'react';
import { SearchOverlay } from './searchOverlay/SearchOverlay/SearchOverlay';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { CategoryComponents } from '@app/components/header/components/HeaderSearch/HeaderSearch';
import { Btn, InputSearch } from '../HeaderSearch/HeaderSearch.styles';
import { useTranslation } from 'react-i18next';
import { BasePopover } from '@app/components/common/BasePopover/BasePopover';
import { NDKUserProfile, useNDK } from '@nostr-dev-kit/ndk-hooks';
import usePaidSubscribers from '@app/hooks/usePaidSubscribers';
import { convertNDKUserProfileToSubscriberProfile } from '@app/utils/utils';
import { InvalidPubkey } from '../../Header.styles';

import { SubscriberProfile } from '@app/hooks/usePaidSubscribers';
import { SubscriberDetailModal } from '@app/components/relay-dashboard/paid-subscribers/SubscriberDetailModal';
interface SearchOverlayProps {
  query: string;
  setQuery: (query: string) => void;
  data: CategoryComponents[] | null;
  isOverlayOpen: boolean;
  setOverlayOpen: (state: boolean) => void;
}

export const SearchDropdown: React.FC<SearchOverlayProps> = ({
  query,
  setQuery,
  data,
  isOverlayOpen,
  setOverlayOpen,
}) => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSubscriberDetailModalOpen, setSubscriberDetailModalOpen] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [fetchingFailed, setFetchingFailed] = useState(false);
  const [subscriberProfile, setSubscriberProfile] = useState<SubscriberProfile | null>(null);
  const [invalidPubkey, setInvalidPubkey] = useState(false);
  const { subscribers } = usePaidSubscribers();
  const ndkInstance = useNDK();
  const { t } = useTranslation();

  useEffect(() => {
    setOverlayOpen(!!query || isFilterOpen);
  }, [query, isFilterOpen, setOverlayOpen]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  const fetchProfile = async (pubkey: string): Promise<NDKUserProfile | null> => {
    if (!ndkInstance) return null;

    try {
      setFetchingProfile(true);
      const profile = await ndkInstance.ndk?.getUser({ pubkey: pubkey }).fetchProfile();

      if (profile) {
        setFetchingProfile(false);
        setFetchingFailed(false);
        return profile;
      } else {
        console.error('Profile not found for pubkey:', pubkey);
        setFetchingProfile(false);
        setFetchingFailed(true);
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setFetchingProfile(false);
      setFetchingFailed(true);
      return null;
    }
  };

  const handleSearchProfile = async () => {
    if (!query) return;
    //verify that it's a pubkey
    if (/^[a-fA-F0-9]{64}$/.test(query)) {
      setSubscriberDetailModalOpen(true);

      //See if the pubkey exists in the subscribers
      const pubkey = query;
      const subscriber = subscribers.find((sub) => sub.pubkey === query);
      // If it exists, open the modal with the subscriber details. If name,picture, or about are not set, fetch profile.
      //if It doesnt exist, fetch the profile from NDK
      //once fetched, convert it to SubscriberProfile and open the modal
      if (subscriber) {
        if (!subscriber.name || !subscriber.picture || !subscriber.about) {
          const profile = await fetchProfile(pubkey);
          if (profile) {
            const subscriberProfile: SubscriberProfile = convertNDKUserProfileToSubscriberProfile(pubkey, profile);
            // Open the modal with the fetched subscriber profile
            setSubscriberProfile(subscriberProfile);
          }
        }
      } else {
        const profile = await fetchProfile(pubkey);
        if (profile) {
          const subscriberProfile: SubscriberProfile = convertNDKUserProfileToSubscriberProfile(pubkey, profile);
          // Open the modal with the fetched subscriber profile
          setSubscriberProfile(subscriberProfile);
        }
      }
    }else{
      setInvalidPubkey(true);
    }
  };
  const onCloseSubscriberDetailModal = () => {
    setSubscriberDetailModalOpen(false);
    setSubscriberProfile(null);
  };

  useEffect(() => {
    if(query.length === 0) {
      setInvalidPubkey(false);
    }
  }, [query]);
  return (
    <>
      <BasePopover
        {...((!!data || isFilterOpen) && { trigger: 'click', onOpenChange: setOverlayOpen })}
        overlayClassName="search-overlay"
        content={<SearchOverlay data={data} isFilterOpen={isFilterOpen} />}
        open={isOverlayOpen}
        getPopupContainer={() => ref.current}
      >
        <HeaderActionWrapper>
          {invalidPubkey && (
            <InvalidPubkey>
              {"Invalid pubkey."}
            </InvalidPubkey>
          )}
          <InputSearch
            width="100%"
            value={query}
            placeholder={t('header.search') + ' hex pubkey'}
            filter={
              <Btn
                size="small"
                type={isFilterOpen ? 'ghost' : 'text'}
                aria-label="Filter"
                onClick={() => setFilterOpen(!isFilterOpen)}
              />
            }
            onChange={(event) => setQuery(event.target.value)}
            enterButton={null}
            addonAfter={null}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearchProfile();
              }
            }}
          />
          <div ref={ref} />
        </HeaderActionWrapper>
        {isSubscriberDetailModalOpen && (
          <SubscriberDetailModal
            loading={fetchingProfile}
            fetchFailed={fetchingFailed}
            isVisible={isSubscriberDetailModalOpen}
            subscriber={subscriberProfile}
            onClose={onCloseSubscriberDetailModal}
          />
        )}
      </BasePopover>
    </>
  );
};
