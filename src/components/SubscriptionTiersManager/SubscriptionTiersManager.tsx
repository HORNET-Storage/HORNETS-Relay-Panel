import React, { useState, useEffect } from 'react';
import { Input, Switch } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import type { SubscriptionTier } from '@app/constants/relaySettings';
import * as T from './SubscriptionTiersManager.styles';

interface SubscriptionTiersManagerProps {
  tiers?: SubscriptionTier[];
  onChange: (tiers: SubscriptionTier[]) => void;
  freeTierEnabled: boolean;
  freeTierLimit: string;
  onFreeTierChange: (enabled: boolean, limit: string) => void;
}

const SubscriptionTiersManager: React.FC<SubscriptionTiersManagerProps> = ({
  tiers = [],
  onChange,
  freeTierEnabled,
  freeTierLimit,
  onFreeTierChange,
}) => {
  const defaultTiers: SubscriptionTier[] = [
    { data_limit: '1 GB per month', price: '8000' },
    { data_limit: '5 GB per month', price: '10000' },
    { data_limit: '10 GB per month', price: '15000' },
  ];

  // Initialize with properly formatted tiers from props or default
  const [currentTiers, setCurrentTiers] = useState<SubscriptionTier[]>(() => {
    return tiers.length > 0
      ? tiers.map((tier) => ({
          data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
          price: tier.price,
        }))
      : defaultTiers;
  });

  // Update current tiers when props change
  useEffect(() => {
    if (tiers.length > 0) {
      const formattedTiers = tiers.map((tier) => ({
        data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
        price: tier.price,
      }));

      // Only update if the formatted tiers are different from current
      if (JSON.stringify(currentTiers) !== JSON.stringify(formattedTiers)) {
        setCurrentTiers(formattedTiers);
      }
    }
  }, [tiers]);

  const handleUpdateTier = (index: number, field: keyof SubscriptionTier, value: string) => {
    const newTiers = currentTiers.map((tier, i) => {
      if (i === index) {
        if (field === 'data_limit') {
          const formattedValue = value.includes('per month') ? value : `${value} per month`;
          return { ...tier, [field]: formattedValue };
        }
        return { ...tier, [field]: value };
      }
      return tier;
    });
    setCurrentTiers(newTiers);
    onChange(newTiers);
  };

  const addTier = () => {
    if (currentTiers.length < 3) {
      const newTier: SubscriptionTier = {
        data_limit: '1 GB per month',
        price: '10000',
      };
      const updatedTiers = [...currentTiers, newTier];
      setCurrentTiers(updatedTiers);
      onChange(updatedTiers);
    }
  };

  const removeTier = (index: number) => {
    const newTier = currentTiers.filter((_, i) => i !== index);
    setCurrentTiers(newTier);
    onChange(newTier);
  };

  const toggleFreeTier = (checked: boolean) => {
    onFreeTierChange(checked, checked ? freeTierLimit : '100 MB per month');
  };

  const updateFreeTierLimit = (value: string) => {
    const formattedValue = value.includes('per month') ? value : `${value} per month`;
    onFreeTierChange(freeTierEnabled, formattedValue);
  };

  return (
    <T.ContentContainer className="w-full">
      <T.ActiveTiersWrapper>
        <T.ActiveTierHeader>Tiers:</T.ActiveTierHeader>
        <div>{tiers.length}/3</div>
      </T.ActiveTiersWrapper>
      {currentTiers.map((tier, index) => (
        <T.TierWrapper key={index}>
          <T.FieldWrapper>
            <Input
              value={tier.data_limit}
              onChange={(e) => handleUpdateTier(index, 'data_limit', e.target.value)}
              placeholder="e.g., 1 GB per month"
              style={{
                width: '100%',
                backgroundColor: '#1b1b38',
                borderColor: '#313131',
                color: 'white',
                height: '48px',
                borderRadius: '8px',
              }}
            />
          </T.FieldWrapper>
          <T.FieldWrapper>
            <label className="block text-sm text-white mb-2">Price (sats)</label>
            <Input
              type="number"
              value={tier.price}
              onChange={(e) => handleUpdateTier(index, 'price', e.target.value)}
              placeholder="Price in sats"
              style={{
                width: '100%',
                backgroundColor: '#1b1b38',
                borderColor: '#313131',
                color: 'white',
                height: '48px',
                borderRadius: '8px',
              }}
            />
          </T.FieldWrapper>
          <T.RemoveTierButton icon={<CloseOutlined />} onClick={() => removeTier(index)}>
            Remove Tier
          </T.RemoveTierButton>
        </T.TierWrapper>
      ))}

      <T.AddTierButton onClick={addTier} className="rounded-lg" disabled={currentTiers.length >= 3}>
        <PlusOutlined />
        Add Tier
      </T.AddTierButton>

      <S.InfoCard>
        <S.InfoCircleOutlinedIcon />
        <T.InfoText>
          Configure subscription tiers to define data limits and pricing for your relay service.
        </T.InfoText>
      </S.InfoCard>
    </T.ContentContainer>
  );
};

export default SubscriptionTiersManager;
