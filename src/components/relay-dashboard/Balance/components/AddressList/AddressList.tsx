import React from 'react';
import { List, Button } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface Address {
  index: string;
  address: string;
}

interface AddressListProps {
  addresses: Address[];
}

const AddressContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AddressText = styled.span`
  color: #aaa;
  margin-right: 8px;
  flex: 1;
  word-wrap: break-word; /* Ensure long addresses break properly */
  font-size: 16px; /* Default font size for desktop */
  @media (max-width: 768px) {
    font-size: 12px; /* Smaller font size for mobile */
    margin-right: 0;
    margin-bottom: 8px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #aaa;
  font-size: 16px;
`;

export const AddressList: React.FC<AddressListProps> = ({ addresses }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Handle empty addresses array
  if (!addresses || addresses.length === 0) {
    return (
      <EmptyMessage>
        No receiving addresses available at the moment.
      </EmptyMessage>
    );
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={addresses}
      renderItem={(address, index) => (
        <List.Item>
          <List.Item.Meta
            title={`Address: ${parseInt(address.index) + 1}`}
            description={
              <AddressContainer>
                <AddressText>{address.address}</AddressText>
                <CopyToClipboard text={address.address} onCopy={() => setCopiedIndex(index)}>
                  <Button icon={copiedIndex === index ? <CheckOutlined /> : <CopyOutlined />} size="small" />
                </CopyToClipboard>
              </AddressContainer>
            }
          />
        </List.Item>
      )}
    />
  );
};
