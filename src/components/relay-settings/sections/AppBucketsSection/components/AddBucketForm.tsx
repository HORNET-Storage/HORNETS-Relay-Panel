// src/components/relay-settings/sections/AppBucketsSection/components/AddBucketForm.tsx

import React, { useState } from 'react';
import { Input } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';

interface AddBucketFormProps {
  onAddBucket: (bucket: string) => void;
}

export const AddBucketForm: React.FC<AddBucketFormProps> = ({ onAddBucket }) => {
  const [newBucket, setNewBucket] = useState('');

  const handleAddBucket = () => {
    if (newBucket) {
      onAddBucket(newBucket);
      setNewBucket('');
    }
  };

  return (
    <div className="custom-checkbox-group grid-checkbox-group large-label">
      <h3>{'Add an App Bucket'}</h3>
      <div style={{ display: 'flex' }}>
        <Input
          value={newBucket}
          onChange={(e) => setNewBucket(e.target.value)}
          placeholder="Enter new app bucket"
        />
        <BaseButton onClick={handleAddBucket}>
          Add bucket
        </BaseButton>
      </div>
    </div>
  );
};

export default AddBucketForm;