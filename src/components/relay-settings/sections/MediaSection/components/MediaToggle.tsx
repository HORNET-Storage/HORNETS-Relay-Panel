// src/components/relay-settings/sections/MediaSection/components/MediaToggle.tsx

import React from 'react';
import { LiquidToggle } from '@app/components/common/LiquidToggle/LiquidToggle';

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
      <LiquidToggle
        checked={isActive}
        onChange={(checked) => onChange(checked)}
      />
    </div>
  );
};

export default MediaToggle;
