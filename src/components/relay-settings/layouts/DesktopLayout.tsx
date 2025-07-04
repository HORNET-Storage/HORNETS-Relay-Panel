// src/components/relay-settings/layouts/DesktopLayout.tsx

import React from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Balance } from '@app/components/relay-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/relay-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/relay-dashboard/transactions/Transactions';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { NetworkSection } from '@app/components/relay-settings/sections/NetworkSection';
import { AppBucketsSection } from '@app/components/relay-settings/sections/AppBucketsSection';
import { KindsSection } from '@app/components/relay-settings/sections/KindsSection';
import { MediaSection } from '@app/components/relay-settings/sections/MediaSection';
import { ModerationSection } from '@app/components/relay-settings/sections/ModerationSection';
import { useTranslation } from 'react-i18next';

interface DesktopLayoutProps {
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
        maxSizeMB: number;
        onChange: (values: string[]) => void;
        onToggle: (checked: boolean) => void;
        onMaxSizeChange: (size: number) => void;
    };
    videos: {
        selected: string[];
        isActive: boolean;
        maxSizeMB: number;
        onChange: (values: string[]) => void;
        onToggle: (checked: boolean) => void;
        onMaxSizeChange: (size: number) => void;
    };
    audio: {
        selected: string[];
        isActive: boolean;
        maxSizeMB: number;
        onChange: (values: string[]) => void;
        onToggle: (checked: boolean) => void;
        onMaxSizeChange: (size: number) => void;
    };
    // Moderation section props
    moderationMode: string;
    onModerationModeChange: (mode: string) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
    // Moderation props
    moderationMode,
    onModerationModeChange,
}) => {
    const { t } = useTranslation();

    return (
        <BaseRow>
            <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
                <BaseRow gutter={[60, 60]}>
                    <BaseCol xs={24}>
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


                        <ModerationSection
                            moderationMode={moderationMode}
                            onModerationModeChange={onModerationModeChange}
                        />
                    </BaseCol>
                </BaseRow>

                <BaseCol xs={24}>
                    <S.SwitchContainer
                        style={{
                            width: '11rem',
                            display: 'grid',
                            paddingTop: '3rem',
                            gap: '.5rem',
                            gridTemplateColumns: '1fr 3fr',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <S.LabelSpan>{t('common.serverSetting')}</S.LabelSpan>
                        <S.LargeSwitch
                            className="modeSwitch"
                            checkedChildren="Whitelist"
                            unCheckedChildren="Blacklist"
                            checked={mode === 'whitelist'}
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
                        style={{ marginTop: '2rem', paddingBottom: '1rem' }}
                        type="primary"
                        loading={loadings[0]}
                        onClick={onSaveClick}
                    >
                        {t('buttons.saveSettings')}
                    </BaseButton>
                </BaseCol>
            </S.LeftSideCol>

            <S.RightSideCol xl={8} xxl={7}>
                <div id="balance">
                    <Balance />
                </div>
                <S.Space />
                <div id="total-earning">
                    <TotalEarning />
                </div>
                <S.Space />
                <div id="activity-story">
                    <ActivityStory />
                </div>
            </S.RightSideCol>
        </BaseRow>
    );
};

export default DesktopLayout;
