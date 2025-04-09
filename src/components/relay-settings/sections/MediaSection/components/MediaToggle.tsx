// src/components/relay-settings/sections/MediaSection/components/MediaToggle.tsx

import React from 'react';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';

interface MediaToggleProps {
  isActive: boolean;
  onChange: (checked: boolean) => void;
  mode: string;
}

export const MediaToggle: React.FC<MediaToggleProps> = ({
  isActive,
  onChange,
  mode,
}) => {
  if (mode === 'unlimited') {
    return null;
  }

  return (
    <div className="switch-container">
      <BaseSwitch
        checkedChildren="ON"
        unCheckedChildren="OFF"
        checked={isActive}
        onChange={(checked) => onChange(checked)}
      />
    </div>
  );
};

export default MediaToggle;