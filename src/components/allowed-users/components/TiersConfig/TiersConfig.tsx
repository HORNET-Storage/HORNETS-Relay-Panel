import React, { useState } from 'react';
import { Button, Table, Space, Modal, Popconfirm, Alert, Radio, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AllowedUsersSettings, AllowedUsersMode, AllowedUsersTier } from '@app/types/allowedUsers.types';
import { TierEditor } from '../TierEditor/TierEditor';
import { displayToFriendlyString, bytesToDisplayFormat } from '@app/utils/tierConversion.utils';
import * as S from './TiersConfig.styles';

interface TiersConfigProps {
  settings: AllowedUsersSettings;
  mode: AllowedUsersMode;
  onSettingsChange: (settings: AllowedUsersSettings) => void;
  disabled?: boolean;
}

// Remove old form interface - using TierEditor now

export const TiersConfig: React.FC<TiersConfigProps> = ({
  settings,
  mode,
  onSettingsChange,
  disabled = false
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentTier, setCurrentTier] = useState<AllowedUsersTier | null>(null);

  const isPaidMode = mode === 'paid';
  const isFreeMode = mode === 'free';

  const handleFreeTierChange = (tierName: string) => {
    const updatedTiers = settings.tiers.map(tier => ({
      ...tier,
      active: tier.name === tierName
    }));
    
    const updatedSettings = {
      ...settings,
      tiers: updatedTiers
    };
    
    onSettingsChange(updatedSettings);
  };

  const handleAddTier = () => {
    setEditingIndex(null);
    setCurrentTier({
      name: '',
      price_sats: isFreeMode ? 0 : 1000,
      monthly_limit_bytes: 1073741824, // 1 GB default
      unlimited: false
    });
    setIsModalVisible(true);
  };

  const handleEditTier = (index: number) => {
    setEditingIndex(index);
    setCurrentTier({ ...settings.tiers[index] });
    setIsModalVisible(true);
  };

  const handleDeleteTier = (index: number) => {
    const newTiers = settings.tiers.filter((_, i) => i !== index);
    const updatedSettings = {
      ...settings,
      tiers: newTiers
    };
    onSettingsChange(updatedSettings);
  };

  const handleTierChange = (updatedTier: AllowedUsersTier) => {
    setCurrentTier(updatedTier);
  };

  const handleModalOk = () => {
    if (!currentTier) return;

    // Validate for paid mode
    if (isPaidMode && currentTier.price_sats === 0) {
      return; // TierEditor should show validation error
    }

    // Force price to 0 for free mode
    const finalTier = {
      ...currentTier,
      price_sats: isFreeMode ? 0 : currentTier.price_sats
    };

    let newTiers: AllowedUsersTier[];
    if (editingIndex !== null) {
      newTiers = [...settings.tiers];
      newTiers[editingIndex] = finalTier;
    } else {
      newTiers = [...settings.tiers, finalTier];
    }

    const updatedSettings = {
      ...settings,
      tiers: newTiers
    };

    onSettingsChange(updatedSettings);
    setIsModalVisible(false);
    setCurrentTier(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentTier(null);
    setEditingIndex(null);
  };

  const columns = [
    {
      title: 'Tier Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <S.DataLimit>{name}</S.DataLimit>
    },
    {
      title: 'Data Limit',
      dataIndex: 'monthly_limit_bytes',
      key: 'monthly_limit_bytes',
      render: (bytes: number, record: AllowedUsersTier) => {
        if (record.unlimited) {
          return <S.DataLimit>unlimited</S.DataLimit>;
        }
        const display = bytesToDisplayFormat(bytes);
        return <S.DataLimit>{displayToFriendlyString({ ...display, unlimited: false })}</S.DataLimit>;
      }
    },
    {
      title: 'Price (sats)',
      dataIndex: 'price_sats',
      key: 'price_sats',
      render: (priceSats: number) => (
        <S.Price $isFree={priceSats === 0}>
          {priceSats === 0 ? 'Free' : `${priceSats} sats`}
        </S.Price>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTier(index)}
            disabled={disabled}
          />
          <Popconfirm
            title="Are you sure you want to delete this tier?"
            onConfirm={() => handleDeleteTier(index)}
            disabled={disabled}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={disabled}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <S.Container>
      {isPaidMode && (
        <Alert
          message="Paid Mode Active"
          description="All tiers must have a price greater than 0. Free tiers are not allowed in paid mode."
          type="warning"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#25284B',
            border: '1px solid #d9d9d9',
            color: '#d9d9d9'
          }}
        />
      )}
      
      {isFreeMode && (
        <Alert
          message="Free Mode Active"
          description="All tiers are automatically set to free (price = 0) regardless of input."
          type="success"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#25284B',
            border: '1px solid #d9d9d9',
            color: '#d9d9d9'
          }}
        />
      )}
      
      {mode === 'exclusive' && (
        <Alert
          message="Exclusive Mode Active"
          description="Tiers can have any price. Users must be manually added to access lists."
          type="info"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: '#25284B',
            border: '1px solid #d9d9d9',
            color: '#d9d9d9'
          }}
        />
      )}

      <S.TiersHeader>
        <S.TiersTitle>
          {isFreeMode ? 'Free Tier Selection' : 'Subscription Tiers'}
        </S.TiersTitle>
        {!isFreeMode && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTier}
            disabled={disabled}
          >
            Add Tier
          </Button>
        )}
      </S.TiersHeader>

      {isFreeMode ? (
        <Radio.Group
          value={settings.tiers.find(tier => tier.active)?.name}
          onChange={(e) => handleFreeTierChange(e.target.value)}
          disabled={disabled}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {settings.tiers.map((tier, index) => {
              const display = tier.unlimited 
                ? { value: 0, unit: 'MB' as const, unlimited: true }
                : { ...bytesToDisplayFormat(tier.monthly_limit_bytes), unlimited: false };
              
              return (
                <Card
                  key={index}
                  size="small"
                  style={{ 
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    border: tier.active ? '2px solid var(--primary-color)' : '1px solid #d9d9d9'
                  }}
                  onClick={() => !disabled && handleFreeTierChange(tier.name)}
                >
                  <Radio value={tier.name} disabled={disabled}>
                    <Space>
                      <S.DataLimit>{tier.name}</S.DataLimit>
                      <S.DataLimit>{displayToFriendlyString(display)}</S.DataLimit>
                      <S.Price $isFree={true}>Free</S.Price>
                    </Space>
                  </Radio>
                </Card>
              );
            })}
          </Space>
        </Radio.Group>
      ) : (
        <Table
          columns={columns}
          dataSource={settings.tiers.map((tier, index) => ({ ...tier, key: index }))}
          pagination={false}
          size="small"
          locale={{ emptyText: 'No tiers configured' }}
        />
      )}

      <Modal
        title={editingIndex !== null ? 'Edit Tier' : 'Add New Tier'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
        width={600}
      >
        {currentTier && (
          <TierEditor
            tier={currentTier}
            onTierChange={handleTierChange}
            disabled={disabled}
            showName={true}
            showPrice={true}
          />
        )}

        {isPaidMode && (
          <Alert
            message="Note: Free tiers (price = 0) are not allowed in paid mode"
            type="warning"
            showIcon
            style={{
              marginTop: 16,
              backgroundColor: '#fafafa',
              border: '1px solid #d9d9d9',
              color: '#262626'
            }}
          />
        )}
        
        {isFreeMode && (
          <Alert
            message="Note: Price will be automatically set to 0 (free) in free mode"
            type="success"
            showIcon
            style={{
              marginTop: 16,
              backgroundColor: '#fafafa',
              border: '1px solid #d9d9d9',
              color: '#262626'
            }}
          />
        )}
      </Modal>
    </S.Container>
  );
};