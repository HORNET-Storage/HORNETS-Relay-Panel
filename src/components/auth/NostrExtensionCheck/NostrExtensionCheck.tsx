import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Card, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Link } = Typography;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  
  .ant-card-body {
    padding: 2rem;
    
    @media (max-width: 480px) {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    margin: 0 1rem;
  }
`;

const ExtensionList = styled.div`
  margin: 1.5rem 0;
  text-align: left;
  
  .extension-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    margin: 0.75rem 0;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--background-color);
    
    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .extension-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }
    
    .extension-name {
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-main-color);
    }
    
    .extension-desc {
      font-size: 0.875rem;
      color: var(--text-light-color);
    }
    
    .extension-links {
      display: flex;
      gap: 0.75rem;
      
      @media (max-width: 480px) {
        width: 100%;
        justify-content: flex-start;
      }
    }
  }
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 1.5rem;
  
  &.ant-alert-info {
    background-color: rgba(24, 144, 255, 0.1);
    border: 1px solid rgba(24, 144, 255, 0.3);
    
    .ant-alert-message {
      color: var(--text-main-color);
      font-weight: 600;
    }
    
    .ant-alert-description {
      color: var(--text-light-color);
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--warning-color);
  
  &.success {
    color: var(--success-color);
  }
`;

interface NostrExtensionCheckProps {
  onExtensionReady?: () => void;
}

export const NostrExtensionCheck: React.FC<NostrExtensionCheckProps> = ({ onExtensionReady }) => {
  const [hasExtension, setHasExtension] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkExtension = useCallback(() => {
    setIsChecking(true);
    
    // Check if window.nostr exists
    const extensionExists = typeof window !== 'undefined' && !!window.nostr;
    setHasExtension(extensionExists);
    setIsChecking(false);
    
    if (extensionExists && onExtensionReady) {
      onExtensionReady();
    }
  }, [onExtensionReady]);

  useEffect(() => {
    // Initial check
    checkExtension();
    
    // Set up polling to detect when extension becomes available
    const pollInterval = setInterval(() => {
      if (window.nostr && !hasExtension) {
        checkExtension();
        clearInterval(pollInterval);
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [hasExtension, checkExtension]);

  const extensions = [
    {
      name: 'nos2x',
      description: 'Chrome/Firefox extension',
      chromeUrl: 'https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp',
      firefoxUrl: 'https://addons.mozilla.org/en-US/firefox/addon/nos2x/'
    },
    {
      name: 'Alby',
      description: 'Bitcoin & Nostr wallet extension',
      chromeUrl: 'https://chrome.google.com/webstore/detail/alby-bitcoin-lightning-wa/iokeahhehimjnekafflcihljlcjccdbe',
      firefoxUrl: 'https://addons.mozilla.org/en-US/firefox/addon/alby/'
    },
    {
      name: 'Flamingo',
      description: 'Chrome extension for Nostr',
      chromeUrl: 'https://chrome.google.com/webstore/detail/flamingo/hjiadbgecmepjlengpkocjccpjeimbip'
    }
  ];

  if (isChecking) {
    return (
      <StyledCard>
        <Space direction="vertical" size="large">
          <ReloadOutlined spin style={{ fontSize: '3rem', color: 'var(--primary-color)' }} />
          <Title level={4}>Checking for Nostr Extension...</Title>
        </Space>
      </StyledCard>
    );
  }

  if (hasExtension) {
    return (
      <Alert
        message="Nostr Extension Detected"
        description="Your NIP-07 compatible extension is ready to use."
        type="success"
        icon={<CheckCircleOutlined />}
        style={{ marginBottom: '1rem' }}
      />
    );
  }

  return (
    <StyledCard>
      <IconWrapper>
        <ExclamationCircleOutlined />
      </IconWrapper>
      
      <Title level={3}>Nostr Extension Required</Title>
      
      <Text>
        This relay panel requires a NIP-07 compatible Nostr extension to authenticate. 
        Please install one of the recommended extensions below:
      </Text>

      <ExtensionList>
        {extensions.map((ext, index) => (
          <div key={index} className="extension-item">
            <div className="extension-info">
              <div className="extension-name">{ext.name}</div>
              <div className="extension-desc">{ext.description}</div>
            </div>
            <div className="extension-links">
              {ext.chromeUrl && (
                <Link href={ext.chromeUrl} target="_blank">
                  Chrome
                </Link>
              )}
              {ext.firefoxUrl && (
                <Link href={ext.firefoxUrl} target="_blank">
                  Firefox
                </Link>
              )}
            </div>
          </div>
        ))}
      </ExtensionList>

      <StyledAlert
        message="After Installation"
        description="Once you've installed an extension, refresh this page or click the button below to continue."
        type="info"
      />

      <Button 
        type="primary" 
        icon={<ReloadOutlined />}
        onClick={checkExtension}
        size="large"
      >
        Check Again
      </Button>
    </StyledCard>
  );
};