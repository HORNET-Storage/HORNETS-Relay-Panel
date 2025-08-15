// src/components/relay-settings/sections/MediaSection/components/MediaToggle.tsx

import React from 'react';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';

interface MediaToggleProps {
  isActive: boolean;
  onChange: (checked: boolean) => void;
}

export const MediaToggle: React.FC<MediaToggleProps> = ({
  isActive,
  onChange,
}) => {
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
