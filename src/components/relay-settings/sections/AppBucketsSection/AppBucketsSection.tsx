// src/components/relay-settings/sections/AppBucketsSection/AppBucketsSection.tsx

import React from 'react';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { BucketsList } from './components/BucketsList';
import { AddBucketForm } from './components/AddBucketForm';
import { DynamicBucketsList } from './components/DynamicBucketsList';
import { SectionCard } from '../../shared/SectionCard';

export interface AppBucketsSectionProps {
  appBuckets: string[];
  dynamicAppBuckets: string[];
  onAppBucketsChange: (values: string[]) => void;
  onDynamicAppBucketsChange: (values: string[]) => void;
  onAddBucket: (bucket: string) => void;
  onRemoveBucket: (bucket: string) => void;
  mobile?: boolean;
}

export const AppBucketsSection: React.FC<AppBucketsSectionProps> = ({
  appBuckets,
  dynamicAppBuckets,
  onAppBucketsChange,
  onDynamicAppBucketsChange,
  onAddBucket,
  mobile = false,
  onRemoveBucket,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <CollapsibleSection header="App Buckets">
      <SectionCard padding={true}>
        <div className="flex-col w-full">
          <BucketsList mobileGrid={mobile} selectedBuckets={appBuckets} onBucketsChange={onAppBucketsChange} />

          <S.InfoCard>
            <S.InfoCircleOutlinedIcon />
            <small style={{ color: themeObject[theme].textLight }}>
              {
                'Enabling buckets will organize data stored within the relay to quicken retrieval times for users. Disabling buckets will not turn off data storage.'
              }
            </small>
          </S.InfoCard>

          <S.NewBucketContainer>
            <AddBucketForm onAddBucket={onAddBucket} />
            <DynamicBucketsList
              buckets={dynamicAppBuckets}
              selectedBuckets={dynamicAppBuckets}
              onBucketsChange={onDynamicAppBucketsChange}
              onRemoveBucket={onRemoveBucket}
            />
          </S.NewBucketContainer>
        </div>
      </SectionCard>
    </CollapsibleSection>
  );
};

export default AppBucketsSection;
