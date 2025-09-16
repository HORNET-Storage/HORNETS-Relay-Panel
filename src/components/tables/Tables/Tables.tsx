import React, { useState } from 'react';
import EditableTable from '../editableTable/EditableTable';
import { useTranslation } from 'react-i18next';
import * as S from './Tables.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ExpandOutlined, ShrinkOutlined } from '@ant-design/icons';

export const Tables: React.FC = () => {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation();
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  const toggleAllExpanded = () => {
    setAllExpanded(!allExpanded);
  };

  return (
    <>
      <S.TablesWrapper>
        <S.Card
          className={isDesktop ? '' : 'table-mobile'}
          id="editable-table"
          title={'Kind Number Stats'}
          padding={isDesktop ? '1.25rem 1.25rem 1rem 1.25rem' : '1.25rem .5rem 1.25rem .5rem'}
          extra={
            <BaseButton
              type="ghost"
              icon={allExpanded ? <ShrinkOutlined /> : <ExpandOutlined />}
              onClick={toggleAllExpanded}
              style={{
                background: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                color: 'rgba(0, 255, 255, 0.9)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </BaseButton>
          }
        >
          <EditableTable
            allExpanded={allExpanded}
            expandedKeys={expandedKeys}
            setExpandedKeys={setExpandedKeys}
          />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

// import React from 'react';
// import { EditableTable } from '../editableTable/EditableTable';
// import { useTranslation } from 'react-i18next';
// import * as S from './Tables.styles';

// export const Tables: React.FC = () => {
//   const { t } = useTranslation();
//   return (
//     <>
//       <S.TablesWrapper>
//         <S.Card id="editable-table" title={'Kinds Stats Table'} padding="1.25rem 1.25rem 0">
//           <EditableTable />
//         </S.Card>
//       </S.TablesWrapper>
//     </>
//   );
// };
