import React from 'react';
import { Form, Card, Alert, Spin } from 'antd';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
  border: none;
  box-shadow: none;
`;

interface BaseSettingsPanelProps {
  title?: string;
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

const BaseSettingsPanel: React.FC<BaseSettingsPanelProps> = ({
  title,
  loading,
  error,
  children,
  extra,
}) => {
  return (
    <StyledCard 
      title={title}
      extra={extra}
    >
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
        {children}
      </Spin>
    </StyledCard>
  );
};

export default BaseSettingsPanel;
