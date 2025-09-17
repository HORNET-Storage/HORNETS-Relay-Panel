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
                background: 'linear-gradient(135deg, rgba(0, 178, 178, 0.12) 0%, rgba(0, 139, 178, 0.08) 100%)',
                border: '2px solid rgba(0, 178, 178, 0.25)',
                color: 'rgba(0, 178, 178, 0.9)',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `
                  0 4px 12px rgba(0, 178, 178, 0.15),
                  inset 0 1px 2px rgba(0, 178, 178, 0.2),
                  inset 0 -1px 2px rgba(0, 139, 178, 0.15)`,
                textShadow: '0 0 6px rgba(0, 178, 178, 0.4)',
                transform: 'translateZ(0) perspective(1000px)',
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 178, 178, 0.18) 0%, rgba(0, 139, 178, 0.14) 100%)';
                e.currentTarget.style.borderColor = 'rgba(0, 178, 178, 0.4)';
                e.currentTarget.style.boxShadow = `
                  0 8px 24px rgba(0, 178, 178, 0.25),
                  inset 0 2px 4px rgba(0, 178, 178, 0.3),
                  inset 0 -2px 4px rgba(0, 139, 178, 0.2),
                  0 0 30px rgba(0, 178, 178, 0.15)`;
                e.currentTarget.style.transform = 'translateZ(0) perspective(1000px) translateY(-2px) scale(1.05)';
                e.currentTarget.style.textShadow = '0 0 8px rgba(0, 178, 178, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 178, 178, 0.12) 0%, rgba(0, 139, 178, 0.08) 100%)';
                e.currentTarget.style.borderColor = 'rgba(0, 178, 178, 0.25)';
                e.currentTarget.style.boxShadow = `
                  0 4px 12px rgba(0, 178, 178, 0.15),
                  inset 0 1px 2px rgba(0, 178, 178, 0.2),
                  inset 0 -1px 2px rgba(0, 139, 178, 0.15)`;
                e.currentTarget.style.transform = 'translateZ(0) perspective(1000px)';
                e.currentTarget.style.textShadow = '0 0 6px rgba(0, 178, 178, 0.4)';
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
