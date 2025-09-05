import React from 'react';
import { Alert, Spin } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  /* Remove all styling to eliminate the container appearance */
  margin: 0;
  padding: 0;
  background: transparent;
  border: 3px solid lime !important;  /* TEMPORARY: Lime border to identify BaseSettingsPanel Container */
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
    <Container>
      {title && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>{title}</h3>
          {extra}
        </div>
      )}
      
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
    </Container>
  );
};

export default BaseSettingsPanel;
