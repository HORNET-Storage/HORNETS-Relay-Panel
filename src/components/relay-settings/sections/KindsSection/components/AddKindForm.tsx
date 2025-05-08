// src/components/relay-settings/sections/KindsSection/components/AddKindForm.tsx

import React, { useState } from 'react';
import { Input } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

interface AddKindFormProps {
  onAddKind: (kind: string) => void;
  mode: string;
}

export const AddKindForm: React.FC<AddKindFormProps> = ({ onAddKind, mode }) => {
  const [newKind, setNewKind] = useState('');

  const handleAddKind = () => {
    if (newKind) {
      onAddKind(newKind);
      setNewKind('');
    }
  };

  if (mode === 'whitelist') {
    return null;
  }

  return (
    <div style={{ padding: '1.5rem 0rem 0rem 0rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <h3>{'Add to Blacklist'}</h3>
      <div style={{ display: 'flex' }} className="custom-checkbox-group grid-checkbox-group large-label">
        <Input
          value={newKind}
          onChange={(e) => setNewKind(e.target.value)}
          placeholder="Enter new kind"
        />
        <BaseButton onClick={handleAddKind}>
          Add Kind
        </BaseButton>
      </div>
    </div>
  );
};

export default AddKindForm;
