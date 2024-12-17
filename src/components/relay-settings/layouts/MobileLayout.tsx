// src/components/relay-settings/layouts/MobileLayout.tsx

import React from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { NetworkSection } from '@app/components/relay-settings/sections/NetworkSection';
import { AppBucketsSection } from '@app/components/relay-settings/sections/AppBucketsSection';
import { SubscriptionSection } from '@app/components/relay-settings/sections/SubscriptionSection';
import { KindsSection } from '@app/components/relay-settings/sections/KindsSection';
import { MediaSection } from '@app/components/relay-settings/sections/MediaSection';
import { useTranslation } from 'react-i18next';
import { SubscriptionTier } from '@app/constants/relaySettings';

interface MobileLayoutProps {
    mode: string;
    onModeChange: (checked: boolean) => void;
    onSaveClick: () => void;
    loadings: boolean[];
    // Network section props
    protocols: string[];
    isFileStorageActive: boolean;
    onProtocolsChange: (protocols: string[]) => void;
    onFileStorageChange: (active: boolean) => void;
    // App buckets section props
    appBuckets: string[];
    dynamicAppBuckets: string[];
    onAppBucketsChange: (values: string[]) => void;
    onDynamicAppBucketsChange: (values: string[]) => void;
    onAddBucket: (bucket: string) => void;
    onRemoveBucket: (bucket: string) => void;
    // Subscription section props
    subscriptionTiers: SubscriptionTier[];
    onSubscriptionChange: (newTiers: SubscriptionTier[]) => void;
    freeTierEnabled: boolean,
    freeTierLimit: string,
    onFreeTierChange: (enabled: boolean, limit: string) => void;
    // Kinds section props
    isKindsActive: boolean;
    selectedKinds: string[];
    dynamicKinds: string[];
    selectedDynamicKinds: string[];
    onKindsActiveChange: (active: boolean) => void;
    onKindsChange: (values: string[]) => void;
    onDynamicKindsChange: (values: string[]) => void;
    onAddKind: (kind: string) => void;
    onRemoveKind: (kind: string) => void;
    // Media section props
    photos: {
        selected: string[];
        isActive: boolean;
        onChange: (values: string[]) => void;
        onToggle: (checked: boolean) => void;
    };
    videos: {
        selected: string[];
        isActive: boolean;
        onChange: (values: string[]) => void;
        onToggle: (checked: boolean) => void;
    };
    audio: {
        selected: string[];
        isActive: boolean;
        onChange: (values: string[]) => void;
        onToggle: (checked: boolean) => void;
    };
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    mode,
    onModeChange,
    onSaveClick,
    loadings,
    // Network props
    protocols,
    isFileStorageActive,
    onProtocolsChange,
    onFileStorageChange,
    // App buckets props
    appBuckets,
    dynamicAppBuckets,
    onAppBucketsChange,
    onDynamicAppBucketsChange,
    onAddBucket,
    onRemoveBucket,
    // Subscription props
    subscriptionTiers,
    onSubscriptionChange,
    freeTierEnabled,
    freeTierLimit,
    onFreeTierChange,
    // Kinds props
    isKindsActive,
    selectedKinds,
    dynamicKinds,
    selectedDynamicKinds,
    onKindsActiveChange,
    onKindsChange,
    onDynamicKindsChange,
    onAddKind,
    onRemoveKind,
    // Media props
    photos,
    videos,
    audio,
}) => {
    const { t } = useTranslation();

    return (
        <BaseRow gutter={[20, 24]}>
            <BaseCol span={24}>
                <S.HeadingContainer>
                    <S.LabelSpan>{'Options'}</S.LabelSpan>
                </S.HeadingContainer>

                <NetworkSection
                    protocols={protocols}
                    isFileStorageActive={isFileStorageActive}
                    onProtocolsChange={onProtocolsChange}
                    onFileStorageChange={onFileStorageChange}
                />

                <AppBucketsSection
                    appBuckets={appBuckets}
                    dynamicAppBuckets={dynamicAppBuckets}
                    onAppBucketsChange={onAppBucketsChange}
                    onDynamicAppBucketsChange={onDynamicAppBucketsChange}
                    onAddBucket={onAddBucket}
                    onRemoveBucket={onRemoveBucket}
                />

                <SubscriptionSection
                    tiers={subscriptionTiers}
                    onChange={onSubscriptionChange}
                    freeTierEnabled={freeTierEnabled}
                    freeTierLimit={freeTierLimit}
                    onFreeTierChange={onFreeTierChange}
                />

                <S.SwitchContainer
                    style={{
                        display: 'grid',
                        paddingTop: '2rem',
                        gridTemplateColumns: '5rem 6.5rem',
                        marginBottom: '1.5rem',
                        marginTop: '1rem',
                    }}
                >
                    <S.LabelSpan>{t('common.serverSetting')}</S.LabelSpan>
                    <S.LargeSwitch
                        className="modeSwitch"
                        checkedChildren="Strict"
                        unCheckedChildren="Unlimited"
                        checked={mode === 'smart'}
                        onChange={onModeChange}
                    />
                </S.SwitchContainer>

                <KindsSection
                    mode={mode}
                    isKindsActive={isKindsActive}
                    selectedKinds={selectedKinds}
                    dynamicKinds={dynamicKinds}
                    selectedDynamicKinds={selectedDynamicKinds}
                    onKindsActiveChange={onKindsActiveChange}
                    onKindsChange={onKindsChange}
                    onDynamicKindsChange={onDynamicKindsChange}
                    onAddKind={onAddKind}
                    onRemoveKind={onRemoveKind}
                />

                <MediaSection
                    mode={mode}
                    photos={photos}
                    videos={videos}
                    audio={audio}
                />

                <BaseButton
                    style={{ marginTop: '2rem' }}
                    type="primary"
                    loading={loadings[0]}
                    onClick={onSaveClick}
                >
                    {t('buttons.saveSettings')}
                </BaseButton>
            </BaseCol>
        </BaseRow>
    );
};

export default MobileLayout;