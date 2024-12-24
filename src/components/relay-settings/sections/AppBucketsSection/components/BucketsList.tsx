// src/components/relay-settings/sections/AppBucketsSection/components/BucketsList.tsx

import React from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { appBuckets as defaultAppBuckets } from '@app/constants/relaySettings';
import { themeObject } from '@app/styles/themes/themeVariables';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface BucketsListProps {
  mobileGrid?: boolean; 
  selectedBuckets: string[];
  onBucketsChange: (values: string[]) => void;
}

export const BucketsList: React.FC<BucketsListProps> = ({
  selectedBuckets,
  mobileGrid = false,
  onBucketsChange,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const bucketOptions = defaultAppBuckets.map(bucket => ({
    label: (
      <S.CheckboxLabel
        style={{ color: themeObject[theme].textMain }}
        isActive={true}
      >
        {bucket.label}
      </S.CheckboxLabel>
    ),
    value: bucket.id,
  }));

  const handleChange = (checkedValues: CheckboxValueType[]) => {
    onBucketsChange(checkedValues as string[]);
  };

  return (
    <BaseCheckbox.Group
      style={{ paddingTop: '1rem', paddingLeft: '1rem', paddingBottom: '1rem' }}
      className={`custom-checkbox-group ${mobileGrid ? 'grid-mobile-checkbox-group' : 'grid-checkbox-group'}`}
      value={selectedBuckets}
      onChange={handleChange}
      options={bucketOptions}
    />
  );
};

export default BucketsList;