import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
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

  // Update current tiers when props change
  useEffect(() => {
    if (tiers.length > 0 && JSON.stringify(tiers) !== JSON.stringify(currentTiers)) {
      const formattedTiers = tiers.map(tier => ({
        data_limit: tier.data_limit.includes('per month') ? tier.data_limit : `${tier.data_limit} per month`,
        price: tier.price
      }));
      setCurrentTiers(formattedTiers);
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
    
    console.log('Updated tiers:', newTiers);
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
    const newTiers = currentTiers.filter((_, i) => i !== index);
    setCurrentTiers(newTiers);
    onChange(newTiers);
  };

  return (
    <div className="w-full space-y-4">
      {currentTiers.map((tier, index) => (
        <div key={index} className="flex items-center space-x-4 mb-4">
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="block text-sm text-white mb-2">Data Limit</label>
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
                borderRadius: '8px' 
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
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
                borderRadius: '8px' 
              }}
            />
          </div>
          <BaseButton
            onClick={() => removeTier(index)}
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
        disabled={currentTiers.length >= 3}
      >
        <PlusOutlined />
        Add Tier
      </BaseButton>

      <S.InfoCard>
        <S.InfoCircleOutlinedIcon />
        <small className="text-gray-400">
          Configure subscription tiers to define data limits and pricing for your relay service.
        </small>
      </S.InfoCard>
    </div>
  );
};

export default SubscriptionTiersManager;


// import React from 'react';
// import { Input } from 'antd';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
// import type { SubscriptionTier } from '@app/constants/relaySettings';
// import { PlusOutlined } from '@ant-design/icons';

// interface SubscriptionTiersManagerProps {
//   tiers: SubscriptionTier[];
//   onChange: (tiers: SubscriptionTier[]) => void;
// }

// const SubscriptionTiersManager: React.FC<SubscriptionTiersManagerProps> = ({ tiers = [], onChange }) => {
//   const handleUpdateTier = (index: number, field: keyof SubscriptionTier, value: string) => {
//     const newTiers = tiers.map((tier, i) => {
//       if (i === index) {
//         return { ...tier, [field]: value };
//       }
//       return tier;
//     });
//     onChange(newTiers);
//   };

//   const addTier = () => {
//     const newTier: SubscriptionTier = {
//       data_limit: "1 GB per month",
//       price: "10000"
//     };
//     onChange([...tiers, newTier]);
//   };

//   const removeTier = (index: number) => {
//     const newTiers = tiers.filter((_, i) => i !== index);
//     onChange(newTiers);
//   };

//   return (
//     <div className="w-full space-y-4">
//       {tiers.map((tier, index) => (
//        <div key={index} className="flex items-center space-x-4 mb-4">
//        <div style={{ flex: 1, minWidth: '150px' }}>
//          <label className="block text-sm text-white mb-2">Data Limit</label>
//          <Input
//            value={tier.data_limit}
//            onChange={(e) => handleUpdateTier(index, 'data_limit', e.target.value)}
//            placeholder="e.g., 1 GB per month"
//            style={{ width: '30%', backgroundColor: '#1b1b38', borderColor: '#313131', color: 'white', height: '48px', borderRadius: '8px', marginBottom: "1rem", marginLeft: "1rem" }}
//          />
//        </div>
//        <div style={{ flex: 1, minWidth: '150px' }}>
//          <label className="block text-sm text-white mb-2">Price (sats)</label>
//          <Input
//            type="number"
//            value={tier.price}
//            onChange={(e) => handleUpdateTier(index, 'price', e.target.value)}
//            placeholder="Price in sats"
//            style={{ width: '30%', backgroundColor: '#1b1b38', borderColor: '#313131', color: 'white', height: '48px', borderRadius: '8px', marginBottom: "1rem", marginLeft: "1rem" }}
//          />
//        </div>
//        <BaseButton
//          onClick={() => removeTier(index)}
//          style={{ width: '40%', backgroundColor: '#1b1b38', borderColor: '#313131', color: 'white', height: '48px', borderRadius: '8px', marginBottom: "1rem" }}
//        >
//          Remove Tier
//        </BaseButton>
//      </div>
     
      
//       ))}
      
//       <BaseButton
//         onClick={addTier}
//         className="flex items-center justify-center gap-2 w-32 h-12 bg-[#1b1b38] hover:bg-[#232343] border border-[#313131] text-white rounded-lg"
//       >
//         <PlusOutlined />
//         Add Tier
//       </BaseButton>

//       <div>
//         <S.InfoCard>
//           <S.InfoCircleOutlinedIcon />
//           <small className="text-gray-400">
//             Configure subscription tiers to define data limits and pricing for your relay service.
//           </small>
//         </S.InfoCard>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionTiersManager;
