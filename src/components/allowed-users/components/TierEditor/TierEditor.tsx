import React, { useState, useEffect } from 'react';
import { Input, Select, Checkbox, Space, Typography, Alert } from 'antd';
import { 
  TierDisplayFormat, 
  DataUnit, 
  validateTierFormat, 
  displayToFriendlyString,
  bytesToDisplayFormat,
  TIER_VALIDATION
} from '@app/utils/tierConversion.utils';
import { AllowedUsersTier } from '@app/types/allowedUsers.types';

const { Text } = Typography;
const { Option } = Select;

interface TierEditorProps {
  tier: AllowedUsersTier;
  onTierChange: (updatedTier: AllowedUsersTier) => void;
  disabled?: boolean;
  showName?: boolean;
  showPrice?: boolean;
}

export const TierEditor: React.FC<TierEditorProps> = ({
  tier,
  onTierChange,
  disabled = false,
  showName = true,
  showPrice = true
}) => {
  // Convert backend format to display format for editing
  const [displayFormat, setDisplayFormat] = useState<TierDisplayFormat>(() => {
    if (tier.unlimited) {
      return { value: 0, unit: 'MB', unlimited: true };
    }
    return { ...bytesToDisplayFormat(tier.monthly_limit_bytes), unlimited: false };
  });

  const [name, setName] = useState(tier.name);
  const [priceSats, setPriceSats] = useState(tier.price_sats);

  // Validation
  const validation = validateTierFormat(displayFormat);
  const isValid = validation.isValid;

  // Update parent when any field changes
  useEffect(() => {
    if (isValid) {
      const updatedTier: AllowedUsersTier = {
        name,
        price_sats: priceSats,
        monthly_limit_bytes: displayFormat.unlimited ? 0 : 
          Math.round(displayFormat.value * getUnitMultiplier(displayFormat.unit)),
        unlimited: displayFormat.unlimited
      };
      onTierChange(updatedTier);
    }
  }, [displayFormat, name, priceSats, isValid, onTierChange]);

  const getUnitMultiplier = (unit: DataUnit): number => {
    switch (unit) {
      case 'MB': return 1048576;      // 1024 * 1024
      case 'GB': return 1073741824;   // 1024 * 1024 * 1024
      case 'TB': return 1099511627776; // 1024 * 1024 * 1024 * 1024
      default: return 1048576;
    }
  };

  const handleValueChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setDisplayFormat(prev => ({ ...prev, value: numericValue }));
  };

  const handleUnitChange = (unit: DataUnit) => {
    setDisplayFormat(prev => ({ ...prev, unit }));
  };

  const handleUnlimitedChange = (unlimited: boolean) => {
    setDisplayFormat(prev => ({ ...prev, unlimited }));
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = parseInt(value) || 0;
    setPriceSats(numericValue);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* Tier Name */}
      {showName && (
        <div>
          <Text strong>Tier Name</Text>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter tier name"
            disabled={disabled}
            style={{ marginTop: 4 }}
          />
        </div>
      )}

      {/* Price */}
      {showPrice && (
        <div>
          <Text strong>Price (sats)</Text>
          <Input
            type="number"
            value={priceSats}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="Price in satoshis"
            disabled={disabled}
            min={0}
            style={{ marginTop: 4 }}
          />
        </div>
      )}

      {/* Data Limit */}
      <div>
        <Text strong>Monthly Data Limit</Text>
        
        {/* Unlimited Checkbox */}
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <Checkbox
            checked={displayFormat.unlimited}
            onChange={(e) => handleUnlimitedChange(e.target.checked)}
            disabled={disabled}
          >
            Unlimited
          </Checkbox>
        </div>

        {/* Value and Unit Inputs */}
        {!displayFormat.unlimited && (
          <Space.Compact style={{ width: '100%' }}>
            <Input
              type="number"
              value={displayFormat.value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Amount"
              disabled={disabled}
              min={TIER_VALIDATION.MIN_VALUE}
              style={{ flex: 1 }}
            />
            <Select
              value={displayFormat.unit}
              onChange={handleUnitChange}
              disabled={disabled}
              style={{ width: 80 }}
            >
              <Option value="MB">MB</Option>
              <Option value="GB">GB</Option>
              <Option value="TB">TB</Option>
            </Select>
          </Space.Compact>
        )}

        {/* Preview */}
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">
            Preview: {displayToFriendlyString(displayFormat)}
          </Text>
        </div>

        {/* Validation Error */}
        {!isValid && validation.error && (
          <Alert
            message={validation.error}
            type="error"
            style={{ marginTop: 8 }}
            showIcon
          />
        )}
      </div>

      {/* Helpful Information */}
      <div style={{ marginTop: 8 }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Valid range: 1 MB to 1 TB
        </Text>
      </div>
    </Space>
  );
};
