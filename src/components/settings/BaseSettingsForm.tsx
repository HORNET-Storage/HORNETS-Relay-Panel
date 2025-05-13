import React from 'react';
import { Form, Button, Card, Space, Alert, Spin } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

interface BaseSettingsFormProps {
  title: string;
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
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    try {
      await form.validateFields();
      setSaving(true);
      await onSave();
    } catch (error) {
      console.error('Validation failed:', error);
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
          style={{ marginBottom: '1rem' }}
        />
      )}
      
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
        >
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
        </Form>
      </Spin>
    </StyledCard>
  );
};

export default BaseSettingsForm;
