import React, { useState, useEffect } from 'react';
import { Input, Switch, Tooltip, Select, InputNumber, Space } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { PlusOutlined, DatabaseOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import type { SubscriptionTier } from '@app/constants/relaySettings';
import styled from 'styled-components';

// Helper functions for data limit parsing and formatting
interface DataLimit {
  amount: number;
  unit: 'MB' | 'GB';
}

const parseDataLimit = (dataLimitString: string): DataLimit => {
  const match = dataLimitString.match(/^(\d+)\s*(MB|GB)/i);
  if (match) {
    return {
      amount: parseInt(match[1], 10),
      unit: match[2].toUpperCase() as 'MB' | 'GB'
    };
  }
  // Default fallback
  return { amount: 1, unit: 'GB' };
};

const formatDataLimit = (amount: number, unit: 'MB' | 'GB'): string => {
  return `${amount} ${unit} per month`;
};

// Styled components for better UI
const TierCard = styled.div`
  background: linear-gradient(145deg, #1b1b38 0%, #161632 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #2c2c50;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
`;

const TierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #2c2c50;
  padding-bottom: 0.75rem;
`;

const TierTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
`;

const TierBadge = styled.span`
  background-color: #4e4e8b;
  color: white;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 8px;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  color: #a9a9c8;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const StyledSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #4e4e8b;
  }
`;

const ActionButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const RemoveButton = styled(ActionButton)`
  background-color: #321e28;
  border-color: #4e2a32;
  color: #e5a9b3;
  
  &:hover {
    background-color: #3d2530;
  }
`;

const AddButton = styled(ActionButton)`
  background-color: #1e3232;
  border-color: #2a4e4e;
  color: #a9e5e5;
  
  &:hover {
    background-color: #254242;
  }
`;

const FreeTierToggle = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(78, 78, 139, 0.2);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const FreeTierLabel = styled.span`
  margin-left: 0.75rem;
  color: white;
  font-size: 0.95rem;
`;

const InfoText = styled.small`
  color: #a9a9c8;
  line-height: 1.5;
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 0.5rem;
    color: #a9a9c8;
  }
`;

const DataLimitInputGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const StyledInputNumber = styled(InputNumber)`
  flex: 1;
  background-color: #1b1b38 !important;
  border-color: #313131 !important;
  color: white !important;
  border-radius: 8px !important;
  height: 48px !important;
  
  .ant-input-number-input {
    color: white !important;
  }
  
  &.ant-input-number-focused {
    border-color: #4e4e8b !important;
    box-shadow: 0 0 0 2px rgba(78, 78, 139, 0.2) !important;
  }
`;

const StyledSelect = styled(Select)`
  width: 120px !important;
  
  .ant-select-selector {
    background-color: #1b1b38 !important;
    border-color: #313131 !important;
    height: 48px !important;
    display: flex !important;
    align-items: center !important;
    border-radius: 8px !important;
  }
  
  .ant-select-selection-item {
    color: white !important;
  }
  
  &.ant-select-focused .ant-select-selector {
    border-color: #4e4e8b !important;
    box-shadow: 0 0 0 2px rgba(78, 78, 139, 0.2) !important;
  }
`;

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
  onFreeTierChange
}) => {
  const defaultTiers: SubscriptionTier[] = [
    { data_limit: '1 GB per month', price: '8000' },
    { data_limit: '5 GB per month', price: '10000' },
    { data_limit: '10 GB per month', price: '15000' }
  ];

  // Initialize tiers with data_limit parsed into amount and unit
  const [currentTiers, setCurrentTiers] = useState<(SubscriptionTier & { amount: number; unit: 'MB' | 'GB' })[]>(() => {
    return tiers.length > 0 ? tiers.map(tier => {
      const dataLimit = parseDataLimit(tier.data_limit);
      return {
        data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
        price: tier.price,
        amount: dataLimit.amount,
        unit: dataLimit.unit
      };
    }) : defaultTiers.map(tier => {
      const dataLimit = parseDataLimit(tier.data_limit);
      return {
        data_limit: tier.data_limit,
        price: tier.price,
        amount: dataLimit.amount,
        unit: dataLimit.unit
      };
    });
  });

  // Parse free tier limit into amount and unit
  const parsedFreeTierLimit = parseDataLimit(freeTierLimit);
  const [freeTierAmount, setFreeTierAmount] = useState<number>(parsedFreeTierLimit.amount);
  const [freeTierUnit, setFreeTierUnit] = useState<'MB' | 'GB'>(parsedFreeTierLimit.unit);

  // Update current tiers when props change
  useEffect(() => {
    if (tiers.length > 0) {
      // Use functional update pattern to avoid dependency on currentTiers
      setCurrentTiers(prevTiers => {
        const formattedTiers = tiers.map(tier => {
          const dataLimit = parseDataLimit(tier.data_limit);
          return {
            data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
            price: tier.price,
            amount: dataLimit.amount,
            unit: dataLimit.unit
          };
        });
        
        // Only update if the formatted tiers are different from current
        const currentTierDataOnly = prevTiers.map(({ data_limit, price }) => ({ data_limit, price }));
        const formattedTierDataOnly = formattedTiers.map(({ data_limit, price }) => ({ data_limit, price }));
        
        if (JSON.stringify(currentTierDataOnly) !== JSON.stringify(formattedTierDataOnly)) {
          return formattedTiers;
        }
        return prevTiers;
      });
    }
  }, [tiers]);

  // Update free tier amount and unit when freeTierLimit prop changes
  useEffect(() => {
    const parsed = parseDataLimit(freeTierLimit);
    setFreeTierAmount(parsed.amount);
    setFreeTierUnit(parsed.unit);
  }, [freeTierLimit]);

  const handleUpdateTierPrice = (index: number, value: string) => {
    const newTiers = currentTiers.map((tier, i) => {
      if (i === index) {
        return { ...tier, price: value };
      }
      return tier;
    });
    
    setCurrentTiers(newTiers);
    onChange(newTiers.map(({ data_limit, price }) => ({ data_limit, price })));
  };
  
  // Fixed type signature for InputNumber's onChange
  const handleUpdateTierAmount = (index: number, value: string | number | null) => {
    if (value === null) return;
    
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    
    const newTiers = currentTiers.map((tier, i) => {
      if (i === index) {
        const newDataLimit = formatDataLimit(numValue, tier.unit);
        return { 
          ...tier, 
          amount: numValue,
          data_limit: newDataLimit
        };
      }
      return tier;
    });
    
    setCurrentTiers(newTiers);
    onChange(newTiers.map(({ data_limit, price }) => ({ data_limit, price })));
  };
  
  // Fixed type signature for Select's onChange
  const handleUpdateTierUnit = (index: number, value: unknown) => {
    const unit = value as 'MB' | 'GB';
    
    const newTiers = currentTiers.map((tier, i) => {
      if (i === index) {
        const newDataLimit = formatDataLimit(tier.amount, unit);
        return { 
          ...tier, 
          unit,
          data_limit: newDataLimit
        };
      }
      return tier;
    });
    
    setCurrentTiers(newTiers);
    onChange(newTiers.map(({ data_limit, price }) => ({ data_limit, price })));
  };

  const addTier = () => {
    if (currentTiers.length < 3) {
      const newTier = {
        data_limit: '1 GB per month',
        price: '10000',
        amount: 1,
        unit: 'GB' as 'MB' | 'GB'
      };
      const updatedTiers = [...currentTiers, newTier];
      setCurrentTiers(updatedTiers);
      onChange(updatedTiers.map(({ data_limit, price }) => ({ data_limit, price })));
    }
  };

  const removeTier = (index: number) => {
    const newTiers = currentTiers.filter((_, i) => i !== index);
    setCurrentTiers(newTiers);
    onChange(newTiers.map(({ data_limit, price }) => ({ data_limit, price })));
  };

  const toggleFreeTier = (checked: boolean) => {
    onFreeTierChange(checked, checked ? freeTierLimit : '100 MB per month');
  };

  // Fixed type signature for InputNumber's onChange
  const updateFreeTierAmount = (value: string | number | null) => {
    if (value === null) return;
    
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    setFreeTierAmount(numValue);
    const newLimit = formatDataLimit(numValue, freeTierUnit);
    onFreeTierChange(freeTierEnabled, newLimit);
  };
  
  // Fixed type signature for Select's onChange
  const updateFreeTierUnit = (value: unknown) => {
    const unit = value as 'MB' | 'GB';
    setFreeTierUnit(unit);
    const newLimit = formatDataLimit(freeTierAmount, unit);
    onFreeTierChange(freeTierEnabled, newLimit);
  };

  return (
    <div className="w-full space-y-4 mb-3">
      <FreeTierToggle>
        <StyledSwitch
          checked={freeTierEnabled}
          onChange={toggleFreeTier}
        />
        <FreeTierLabel>
          Include Free Tier
          <Tooltip title="Offer a free tier with limited storage to attract new users">
            <span style={{ marginLeft: '5px', cursor: 'help' }}>ⓘ</span>
          </Tooltip>
        </FreeTierLabel>
      </FreeTierToggle>

      {freeTierEnabled && (
        <TierCard>
          <TierHeader>
            <div>
              <TierTitle>Free Tier</TierTitle>
              <TierBadge>Basic</TierBadge>
            </div>
          </TierHeader>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <InputGroup style={{ flex: 1 }}>
              <InputIcon>
                <DatabaseOutlined />
                <InputLabel>Data Limit</InputLabel>
              </InputIcon>
              <DataLimitInputGroup>
                <StyledInputNumber
                  min={1}
                  value={freeTierAmount}
                  onChange={updateFreeTierAmount}
                  prefix={<DatabaseOutlined style={{ color: '#a9a9c8' }} />}
                />
                <StyledSelect
                  value={freeTierUnit}
                  onChange={updateFreeTierUnit}
                  options={[
                    { value: 'MB', label: 'MB' },
                    { value: 'GB', label: 'GB' }
                  ]}
                />
              </DataLimitInputGroup>
            </InputGroup>
            
            <InputGroup style={{ flex: 1 }}>
              <InputIcon>
                <ThunderboltOutlined />
                <InputLabel>Price</InputLabel>
              </InputIcon>
              <Input
                disabled
                value="Free"
                style={{ 
                  width: '100%', 
                  backgroundColor: '#1b1b38', 
                  borderColor: '#313131', 
                  color: '#a9a9c8', 
                  height: '48px', 
                  borderRadius: '8px' 
                }}
                prefix={<ThunderboltOutlined style={{ color: '#a9a9c8' }} />}
              />
            </InputGroup>
          </div>
        </TierCard>
      )}

      {currentTiers.map((tier, index) => {
        // Determine tier title based on index
        const tierTitles = ['Standard', 'Premium', 'Professional'];
        const tierTitle = tierTitles[index] || `Tier ${index + 1}`;
        
        return (
          <TierCard key={index}>
            <TierHeader>
              <div>
                <TierTitle>{tierTitle} Tier</TierTitle>
                {index === 1 && <TierBadge>Popular</TierBadge>}
              </div>
              <RemoveButton onClick={() => removeTier(index)}>
                <DeleteOutlined />
                Remove
              </RemoveButton>
            </TierHeader>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <InputGroup style={{ flex: 1 }}>
                <InputIcon>
                  <DatabaseOutlined />
                  <InputLabel>Data Limit</InputLabel>
                </InputIcon>
                <DataLimitInputGroup>
                  <StyledInputNumber
                    min={1}
                    value={tier.amount}
                    onChange={(value) => handleUpdateTierAmount(index, value)}
                    prefix={<DatabaseOutlined style={{ color: '#a9a9c8' }} />}
                  />
                  <StyledSelect
                    value={tier.unit}
                    onChange={(value) => handleUpdateTierUnit(index, value)}
                    options={[
                      { value: 'MB', label: 'MB' },
                      { value: 'GB', label: 'GB' }
                    ]}
                  />
                </DataLimitInputGroup>
              </InputGroup>
              
              <InputGroup style={{ flex: 1 }}>
                <InputIcon>
                  <ThunderboltOutlined />
                  <InputLabel>Price (sats)</InputLabel>
                </InputIcon>
                <Input
                  type="number"
                  value={tier.price}
                  onChange={(e) => handleUpdateTierPrice(index, e.target.value)}
                  placeholder="Price in sats"
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#1b1b38', 
                    borderColor: '#313131', 
                    color: 'white', 
                    height: '48px', 
                    borderRadius: '8px' 
                  }}
                  prefix={<ThunderboltOutlined style={{ color: '#a9a9c8' }} />}
                />
              </InputGroup>
            </div>
          </TierCard>
        );
      })}

      <AddButton
        onClick={addTier}
        style={{ width: 'auto', padding: '0 20px', height: '48px' }}
        disabled={currentTiers.length >= 3}
      >
        <PlusOutlined />
        Add Tier
      </AddButton>

      <S.InfoCard style={{ marginTop: '1.5rem', background: 'rgba(78, 78, 139, 0.2)', border: 'none', padding: '1rem' }}>
        <S.InfoCircleOutlinedIcon style={{ color: '#a9a9c8' }} />
        <InfoText>
          Configure subscription tiers to define data limits and pricing for your relay service. 
          {freeTierEnabled && " A free tier can help attract new users to your service."}
        </InfoText>
      </S.InfoCard>
    </div>
  );
};

export default SubscriptionTiersManager;
