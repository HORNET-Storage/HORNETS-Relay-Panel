// src/components/relay-settings/sections/KindsSection/components/AddKindForm.tsx

import React, { useState } from 'react';
import { Input } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

interface AddKindFormProps {
  onAddKind: (kind: string) => void;
}

export const AddKindForm: React.FC<AddKindFormProps> = ({ onAddKind }) => {
  const [newKind, setNewKind] = useState('');

  const handleAddKind = () => {
    if (newKind) {
      // Ensure the kind is in the correct format
      const formattedKind = newKind.startsWith('kind') ? newKind : `kind${newKind}`;
      onAddKind(formattedKind);
      setNewKind('');
    }
  };

  return (
    <div style={{ padding: '1.5rem 0rem 0rem 0rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <h3>Add Custom Kind</h3>
      <div style={{ display: 'flex' }} className="custom-checkbox-group grid-checkbox-group large-label">
        <Input
          value={newKind}
          onChange={(e) => setNewKind(e.target.value)}
          placeholder="Enter kind number (e.g., 12345)"
        />
        <BaseButton onClick={handleAddKind}>
          Add Kind
        </BaseButton>
      </div>
    </div>
  );
};

export default AddKindForm;