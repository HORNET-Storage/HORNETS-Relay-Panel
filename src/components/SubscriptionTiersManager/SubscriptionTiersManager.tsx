import React from 'react';
import { Input } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import type { SubscriptionTier } from '@app/constants/relaySettings';
import { PlusOutlined } from '@ant-design/icons';

interface SubscriptionTiersManagerProps {
  tiers: SubscriptionTier[];
  onChange: (tiers: SubscriptionTier[]) => void;
}

const SubscriptionTiersManager: React.FC<SubscriptionTiersManagerProps> = ({ tiers = [], onChange }) => {
  const handleUpdateTier = (index: number, field: keyof SubscriptionTier, value: string) => {
    const newTiers = tiers.map((tier, i) => {
      if (i === index) {
        return { ...tier, [field]: value };
      }
      return tier;
    });
    onChange(newTiers);
  };

  const addTier = () => {
    const newTier: SubscriptionTier = {
      data_limit: "1 GB per month",
      price: "10000"
    };
    onChange([...tiers, newTier]);
  };

  const removeTier = (index: number) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    onChange(newTiers);
  };

  return (
    <div className="w-full space-y-4">
      {tiers.map((tier, index) => (
       <div key={index} className="flex items-center space-x-4 mb-4">
       <div style={{ flex: 1, minWidth: '150px' }}>
         <label className="block text-sm text-white mb-2">Data Limit</label>
         <Input
           value={tier.data_limit}
           onChange={(e) => handleUpdateTier(index, 'data_limit', e.target.value)}
           placeholder="e.g., 1 GB per month"
           style={{ width: '30%', backgroundColor: '#1b1b38', borderColor: '#313131', color: 'white', height: '48px', borderRadius: '8px', marginBottom: "1rem", marginLeft: "1rem" }}
         />
       </div>
       <div style={{ flex: 1, minWidth: '150px' }}>
         <label className="block text-sm text-white mb-2">Price (sats)</label>
         <Input
           type="number"
           value={tier.price}
           onChange={(e) => handleUpdateTier(index, 'price', e.target.value)}
           placeholder="Price in sats"
           style={{ width: '30%', backgroundColor: '#1b1b38', borderColor: '#313131', color: 'white', height: '48px', borderRadius: '8px', marginBottom: "1rem", marginLeft: "1rem" }}
         />
       </div>
       <BaseButton
         onClick={() => removeTier(index)}
         style={{ width: '40%', backgroundColor: '#1b1b38', borderColor: '#313131', color: 'white', height: '48px', borderRadius: '8px', marginBottom: "1rem" }}
       >
         Remove Tier
       </BaseButton>
     </div>
     
      
      ))}
      
      <BaseButton
        onClick={addTier}
        className="flex items-center justify-center gap-2 w-32 h-12 bg-[#1b1b38] hover:bg-[#232343] border border-[#313131] text-white rounded-lg"
      >
        <PlusOutlined />
        Add Tier
      </BaseButton>

      <div>
        <S.InfoCard>
          <S.InfoCircleOutlinedIcon />
          <small className="text-gray-400">
            Configure subscription tiers to define data limits and pricing for your relay service.
          </small>
        </S.InfoCard>
      </div>
    </div>
  );
};

export default SubscriptionTiersManager;


// import React from 'react';
// import { Input } from 'antd';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
// import type { SubscriptionTier } from '@app/constants/relaySettings';
// import { PlusOutlined } from '@ant-design/icons'; // Using Ant Design icons instead

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
//     <div className="w-full">
//       <div className="space-y-4 mb-4">
//         {tiers.map((tier, index) => (
//           <div 
//             key={index} 
//             className="rounded-lg bg-[#1b1b38] p-4 border border-[#313131]"
//           >
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm text-gray-300 mb-1">
//                   Data Limit
//                 </label>
//                 <Input
//                   value={tier.data_limit}
//                   onChange={(e) => handleUpdateTier(index, 'data_limit', e.target.value)}
//                   placeholder="e.g., 1 GB per month"
//                   className="bg-[#232343] border-[#313131] text-white h-10 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-300 mb-1">
//                   Price (sats)
//                 </label>
//                 <Input
//                   type="number"
//                   value={tier.price}
//                   onChange={(e) => handleUpdateTier(index, 'price', e.target.value)}
//                   placeholder="Price in sats"
//                   className="bg-[#232343] border-[#313131] text-white h-10 rounded-md"
//                 />
//               </div>
//               <BaseButton
//                 onClick={() => removeTier(index)}
//                 className="w-full h-10 bg-transparent hover:bg-red-900/20 border border-red-500/50 text-red-500"
//               >
//                 Remove Tier
//               </BaseButton>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <BaseButton
//         onClick={addTier}
//         className="flex items-center justify-center gap-2 w-28 h-10 bg-[#1890ff] hover:bg-[#1890ff]/80 text-white rounded-md"
//       >
//         <PlusOutlined /> {/* Using Ant Design icon */}
//         Add Tier
//       </BaseButton>

//       <div className="mt-4">
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

// import React from 'react';
// import { Input } from 'antd';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import type { SubscriptionTier } from '@app/constants/relaySettings';

// interface SubscriptionTiersManagerProps {
//   tiers: SubscriptionTier[];
//   onChange: (tiers: SubscriptionTier[]) => void;
// }

// const SubscriptionTiersManager: React.FC<SubscriptionTiersManagerProps> = ({ tiers = [], onChange }) => {
//   const handleUpdateTier = (index: number, field: keyof SubscriptionTier, value: string) => {
//     const newTiers = tiers.map((tier, i) => {
//       if (i === index) {
//         // Always store values as strings
//         return { ...tier, [field]: value };
//       }
//       return tier;
//     });
//     onChange(newTiers);
//   };

//   const addTier = () => {
//     const newTier: SubscriptionTier = {
//       data_limit: "1 GB per month",
//       price: "10000" // Store price as string
//     };
//     onChange([...tiers, newTier]);
//   };

//   const removeTier = (index: number) => {
//     const newTiers = tiers.filter((_, i) => i !== index);
//     onChange(newTiers);
//   };

//   return (
//     <div className="space-y-4">
//       {tiers.map((tier, index) => (
//         <div key={index} className="flex flex-col space-y-2 p-4 border rounded">
//           <div>
//             <label className="block text-sm font-medium mb-1">Data Limit</label>
//             <Input
//               value={tier.data_limit}
//               onChange={(e) => handleUpdateTier(index, 'data_limit', e.target.value)}
//               placeholder="e.g., 1 GB per month"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Price (sats)</label>
//             <Input
//               type="number"
//               value={tier.price}
//               onChange={(e) => handleUpdateTier(index, 'price', e.target.value)}
//               placeholder="Price in sats"
//             />
//           </div>
//           <BaseButton onClick={() => removeTier(index)} type="ghost" danger>
//             Remove Tier
//           </BaseButton>
//         </div>
//       ))}
//       <BaseButton onClick={addTier} type="primary">
//         Add Tier
//       </BaseButton>
//     </div>
//   );
// };

// export default SubscriptionTiersManager;