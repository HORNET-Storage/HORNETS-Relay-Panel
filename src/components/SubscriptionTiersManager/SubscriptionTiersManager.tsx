import React, { useState, useEffect } from 'react';
import { Input, Switch } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { PlusOutlined } from '@ant-design/icons';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import type { SubscriptionTier } from '@app/constants/relaySettings';

interface SubscriptionTiersManagerProps {
  tiers?: SubscriptionTier[];
  onChange: (tiers: SubscriptionTier[]) => void;
}

const SubscriptionTiersManager: React.FC<SubscriptionTiersManagerProps> = ({ tiers = [], onChange }) => {
  const defaultTiers: SubscriptionTier[] = [
    { data_limit: '1 GB per month', price: '8000' },
    { data_limit: '5 GB per month', price: '10000' },
    { data_limit: '10 GB per month', price: '15000' }
  ];

  // Initialize with properly formatted tiers from props or default
  const [currentTiers, setCurrentTiers] = useState<SubscriptionTier[]>(() => {
    const formattedTiers = tiers.length > 0 ? tiers.map(tier => ({
      data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
      price: tier.price
    })) : defaultTiers;
    return formattedTiers;
  });

  const [hasFreeTier, setHasFreeTier] = useState(() => {
    return tiers.some(tier => tier.price === '0');
  });

  // Update current tiers when props change
  useEffect(() => {
    if (tiers.length > 0) {
      const formattedTiers = tiers.map(tier => ({
        data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
        price: tier.price
      }));
      
      // Only update if the formatted tiers are different from props
      if (JSON.stringify(tiers) !== JSON.stringify(formattedTiers)) {
        setCurrentTiers(formattedTiers);
      }
      setHasFreeTier(tiers.some(tier => tier.price === '0'));
    }
  }, [tiers]);

  const handleUpdateTier = (index: number, field: keyof SubscriptionTier, value: string) => {
    const newTiers = currentTiers.map((tier, i) => {
      if (i === index) {
        if (field === 'data_limit') {
          // Ensure data_limit has "per month" suffix
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
        price: '10000'
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
    setHasFreeTier(checked);
    if (checked) {
      // Add free tier at the beginning
      const freeTier: SubscriptionTier = {
        data_limit: '100 MB per month',
        price: '0'
      };
      const updatedTiers = [freeTier, ...currentTiers];
      setCurrentTiers(updatedTiers);
      onChange(updatedTiers);
    } else {
      // Remove free tier
      const updatedTiers = currentTiers.filter(tier => tier.price !== '0');
      setCurrentTiers(updatedTiers);
      onChange(updatedTiers);
    }
  };

  return (
    <div className="w-full space-y-4 mb-3">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={hasFreeTier}
          onChange={toggleFreeTier}
          style={{ backgroundColor: hasFreeTier ? '#1890ff' : '#1b1b38' }}
        />
        <span className="text-sm text-white mb-3">Include Free Tier</span>
      </div>

      {hasFreeTier && (
        <div className="flex items-center space-x-4 mb-4">
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="block text-sm text-white mb-2">Free Tier Data Limit</label>
            <Input
              value={currentTiers[0]?.data_limit}
              onChange={(e) => handleUpdateTier(0, 'data_limit', e.target.value)}
              placeholder="e.g., 100 MB per month"
              style={{ 
                width: '100%', 
                backgroundColor: '#1b1b38', 
                borderColor: '#313131', 
                color: 'white', 
                height: '48px', 
                borderRadius: '8px' 
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px', visibility: 'hidden' }}>
            <label className="block text-sm text-white mb-2">Price (sats)</label>
            <Input
              disabled
              value="0"
              style={{ 
                width: '100%', 
                backgroundColor: '#1b1b38', 
                borderColor: '#313131', 
                color: 'white', 
                height: '48px', 
                borderRadius: '8px' 
              }}
            />
          </div>
        </div>
      )}

      {currentTiers
        .filter(tier => tier.price !== '0')
        .map((tier, index) => (
        <div key={index} className="flex items-center space-x-4 mb-4">
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="block text-sm text-white mb-2">Data Limit</label>
            <Input
              value={tier.data_limit}
              onChange={(e) => handleUpdateTier(hasFreeTier ? index + 1 : index, 'data_limit', e.target.value)}
              placeholder="e.g., 1 GB per month"
              style={{ 
                width: '100%', 
                backgroundColor: '#1b1b38', 
                borderColor: '#313131', 
                color: 'white', 
                height: '48px', 
                borderRadius: '8px' 
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="block text-sm text-white mb-2">Price (sats)</label>
            <Input
              type="number"
              value={tier.price}
              onChange={(e) => handleUpdateTier(hasFreeTier ? index + 1 : index, 'price', e.target.value)}
              placeholder="Price in sats"
              style={{ 
                width: '100%', 
                backgroundColor: '#1b1b38', 
                borderColor: '#313131', 
                color: 'white', 
                height: '48px', 
                borderRadius: '8px' 
              }}
            />
          </div>
          <BaseButton
            onClick={() => removeTier(hasFreeTier ? index + 1 : index)}
            style={{ 
              width: 'auto', 
              backgroundColor: '#1b1b38', 
              borderColor: '#313131', 
              color: 'white', 
              height: '48px', 
              borderRadius: '8px' 
            }}
          >
            Remove Tier
          </BaseButton>
        </div>
      ))}

      <BaseButton
        onClick={addTier}
        className="flex items-center justify-center gap-2 w-32 h-12 bg-[#1b1b38] hover:bg-[#232343] border border-[#313131] text-white rounded-lg"
        disabled={currentTiers.length >= (hasFreeTier ? 4 : 3)}
      >
        <PlusOutlined />
        Add Tier
      </BaseButton>

      <S.InfoCard>
        <S.InfoCircleOutlinedIcon />
        <small className="text-gray-400">
          Configure subscription tiers to define data limits and pricing for your relay service. 
          {hasFreeTier && " A free tier can help attract new users to your service."}
        </small>
      </S.InfoCard>
    </div>
  );
};

export default SubscriptionTiersManager;