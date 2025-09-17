// src/components/relay-settings/layouts/MobileLayout.tsx

import React from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { LiquidBlueButton } from '@app/components/common/LiquidBlueButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { NetworkSection } from '@app/components/relay-settings/sections/NetworkSection';
import { KindsSection } from '@app/components/relay-settings/sections/KindsSection';
import { MediaSection } from '@app/components/relay-settings/sections/MediaSection';
import { ModerationSection } from '@app/components/relay-settings/sections/ModerationSection';
import { CollapsibleSection } from '@app/components/relay-settings/shared/CollapsibleSection/CollapsibleSection';
import { LiquidToggle } from '@app/components/common/LiquidToggle/LiquidToggle';
import { useTranslation } from 'react-i18next';

interface MobileLayoutProps {
    allowUnregisteredKinds: boolean;
    registeredKinds: number[];
    onAllowUnregisteredKindsChange: (allowed: boolean) => void;
    onSaveClick: () => void;
    loadings: boolean[];
    // Network section props
    protocols: string[];
    isFileStorageActive: boolean;
    onProtocolsChange: (protocols: string[]) => void;
    onFileStorageChange: (active: boolean) => void;
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

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    allowUnregisteredKinds,
    registeredKinds,
    onAllowUnregisteredKindsChange,
    onSaveClick,
    loadings,
    // Network props
    protocols,
    isFileStorageActive,
    onProtocolsChange,
    onFileStorageChange,
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
        <BaseRow gutter={[20, 24]}>
            <BaseCol span={24}>
                <S.HeadingContainer>
                    <S.LabelSpan>{'Relay Settings'}</S.LabelSpan>
                </S.HeadingContainer>

                <NetworkSection
                    protocols={protocols}
                    isFileStorageActive={isFileStorageActive}
                    onProtocolsChange={onProtocolsChange}
                    onFileStorageChange={onFileStorageChange}
                />


                <ModerationSection
                    moderationMode={moderationMode}
                    onModerationModeChange={onModerationModeChange}
                />

                <CollapsibleSection header="Allow Unregistered Kind Numbers">
                    <S.Card>
                        <BaseCol span={24}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 500 }}>
                                        {t('common.allowUnregisteredKinds')}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#c5d3e0' }}>
                                        Enable this to allow events with kind numbers that don&apos;t have specific handlers in the relay.
                                    </p>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <LiquidToggle
                                        checked={allowUnregisteredKinds}
                                        onChange={onAllowUnregisteredKindsChange}
                                    />
                                </div>
                                
                                {allowUnregisteredKinds && (
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        backgroundColor: 'rgba(255, 77, 79, 0.1)', 
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255, 77, 79, 0.3)'
                                    }}>
                                        <span style={{ color: '#ff4d4f', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                                            {t('common.allowUnregisteredKindsWarning')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </BaseCol>
                    </S.Card>
                </CollapsibleSection>

                <KindsSection
                    allowUnregisteredKinds={allowUnregisteredKinds}
                    registeredKinds={registeredKinds}
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
                    photos={photos}
                    videos={videos}
                    audio={audio}
                />

                <LiquidBlueButton
                    style={{ marginTop: '2rem', width: '100%' }}
                    variant="primary"
                    loading={loadings[0]}
                    onClick={onSaveClick}
                >
                    {t('buttons.saveSettings')}
                </LiquidBlueButton>
            </BaseCol>
        </BaseRow>
    );
};

export default MobileLayout;
