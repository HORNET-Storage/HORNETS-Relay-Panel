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

  const isPaidMode = mode === 'subscription';
  const isPublicMode = mode === 'public';
  const isInviteMode = mode === 'invite-only';
  const isOnlyMeMode = mode === 'only-me';

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

  const handleSelectActiveTier = (tierIndex: number) => {
    // For public mode, mark the selected tier as active and others as inactive
    if (isPublicMode) {
      const updatedTiers = settings.tiers.map((tier, index) => ({
        ...tier,
        active: index === tierIndex
      }));
      
      const updatedSettings = {
        ...settings,
        tiers: updatedTiers
      };
      onSettingsChange(updatedSettings);
    }
  };

  const handleAddTier = () => {
    setEditingIndex(null);
    setCurrentTier({
      name: '',
      price_sats: isPublicMode ? 0 : 1000,
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

    // Force price to 0 for public mode and only-me mode (free tiers)
    const finalTier = {
      ...currentTier,
      price_sats: (isPublicMode || isOnlyMeMode) ? 0 : currentTier.price_sats
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
          message="Subscription Mode Active"
          description="All tiers must have a price greater than 0. Free tiers are not allowed in subscription mode."
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
      
      {isPublicMode && (
        <Alert
          message="Public Mode Active"
          description="Configure free tier storage limits. All tiers will be free (price = 0) in public mode."
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
      
      {isInviteMode && (
        <Alert
          message="Invite-Only Mode Active"
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
      
      {isOnlyMeMode && (
        <Alert
          message="Only Me Mode Active"
          description="Personal relay configuration. Only your npub can write to this relay."
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
          {isPublicMode ? 'Free Tier Configuration' : 
           isOnlyMeMode ? 'Personal Tier' : 
           'Subscription Tiers'}
        </S.TiersTitle>
        {!isOnlyMeMode && (
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

      {isPublicMode ? (
        <div>
          <Alert
            message="Select Free Tier for Public Users"
            description="Choose one tier that will be applied to all free users on your public relay."
            type="info"
            showIcon
            style={{ marginBottom: '1rem' }}
          />
          
          <Radio.Group
            value={settings.tiers.findIndex(tier => tier.active === true) !== -1 
              ? settings.tiers.findIndex(tier => tier.active === true) 
              : 0}
            onChange={(e) => handleSelectActiveTier(e.target.value)}
            disabled={disabled}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {settings.tiers.map((tier, index) => (
                <Radio key={index} value={index} style={{ width: '100%' }}>
                  <Card
                    size="small"
                    style={{
                      marginLeft: '24px',
                      width: 'calc(100% - 24px)',
                      backgroundColor: tier.active ? '#f6ffed' : 'transparent',
                      border: tier.active ? '1px solid #b7eb8f' : '1px solid var(--border-color-base)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{tier.name}</strong>
                        <div style={{ color: 'var(--text-secondary-color)', fontSize: '13px' }}>
                          Data Limit: {tier.unlimited ? 'Unlimited' : displayToFriendlyString(bytesToDisplayFormat(tier.monthly_limit_bytes))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEditTier(index)}
                          disabled={disabled}
                          size="small"
                        />
                        {settings.tiers.length > 1 && (
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
                              size="small"
                            />
                          </Popconfirm>
                        )}
                      </div>
                    </div>
                  </Card>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
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
            message="Note: Free tiers (price = 0) are not allowed in subscription mode"
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
        
        {isPublicMode && (
          <Alert
            message="Note: Price will be automatically set to 0 (free) in public mode"
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
        
        {isOnlyMeMode && (
          <Alert
            message="Note: Personal tier is always free and unlimited for relay owner"
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
