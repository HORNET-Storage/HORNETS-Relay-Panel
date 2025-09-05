import React from 'react';
import { Button, Card, Space, Alert, Spin } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 255, 255, 0.15);
  background: rgba(0, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  & .ant-card-head {
    border-bottom: 1px solid rgba(0, 255, 255, 0.15);
    background: transparent;
  }

  & .ant-card-body {
    padding: 0 !important;
    background: transparent !important;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

interface BaseSettingsFormProps {
  title?: string;
  loading: boolean;
  error: Error | null;
  onSave: () => Promise<void>;
  onReset: () => void;
  children: React.ReactNode;
}

const BaseSettingsForm: React.FC<BaseSettingsFormProps> = ({
  title,
  loading,
  error,
  onSave,
  onReset,
  children,
}) => {
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <StyledCard title={title}>
      {error && (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
          style={{ marginBottom: '1rem', margin: '24px' }}
        />
      )}
      
      <Spin spinning={loading}>
        <div style={{ padding: '24px' }}>
          {children}
          
          <ButtonsContainer>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={onReset}
                disabled={loading || saving}
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                disabled={loading}
              >
                Save
              </Button>
            </Space>
          </ButtonsContainer>
        </div>
      </Spin>
    </StyledCard>
  );
};

export default BaseSettingsForm;
