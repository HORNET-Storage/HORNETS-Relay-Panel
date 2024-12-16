// src/components/relay-settings/sections/AppBucketsSection/components/DynamicBucketsList.tsx

import React from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

interface DynamicBucketsListProps {
  buckets: string[];
  selectedBuckets: string[];
  onBucketsChange: (values: string[]) => void;
  onRemoveBucket: (bucket: string) => void;
}

export const DynamicBucketsList: React.FC<DynamicBucketsListProps> = ({
  buckets,
  selectedBuckets,
  onBucketsChange,
  onRemoveBucket,
}) => {
  const handleChange = (checkedValues: CheckboxValueType[]) => {
    onBucketsChange(checkedValues as string[]);
  };

  return (
    <BaseCheckbox.Group
      style={{ paddingLeft: '1rem' }}
      className={`custom-checkbox-group grid-checkbox-group large-label ${buckets.length ? 'dynamic-group' : ''}`}
      value={selectedBuckets}
      onChange={handleChange}
    >
      {buckets.map((bucket) => (
        <div
          style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', alignItems: 'center' }}
          key={bucket}
        >
          <div className="checkbox-container">
            <BaseCheckbox value={bucket} />
            <S.CheckboxLabel
              isActive={true}
              style={{ fontSize: '1rem', paddingRight: '.8rem', paddingLeft: '.8rem' }}
            >
              {bucket}
            </S.CheckboxLabel>
          </div>
          <BaseButton
            style={{ height: '2rem', width: '5rem', marginRight: '1rem' }}
            onClick={() => onRemoveBucket(bucket)}
          >
            Remove
          </BaseButton>
        </div>
      ))}
    </BaseCheckbox.Group>
  );
};

export default DynamicBucketsList;