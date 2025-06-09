import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface BlockPubkeyFormProps {
  onSubmit: (pubkey: string, reason?: string) => Promise<void>;
  disabled: boolean;
}
const CardRoot = styled(Card)`
  border-color: var(--border-base-color) !important;
  border-width: 1px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  background-color: var(--secondary-background-color) !important;

  & .ant-card-head { 
    border-bottom-color: var(--border-base-color) !important; 
  }
}
`;
const TextArea = styled(Input.TextArea)`
  background-color: var(--layout-sider-bg-color) !important;
`
const InputArea = styled(Input)`
  background-color: var(--layout-sider-bg-color) !important;
`;

export const BlockPubkeyForm: React.FC<BlockPubkeyFormProps> = ({
  onSubmit,
  disabled,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: { pubkey: string; reason?: string }) => {
    setSubmitting(true);
    try {
      await onSubmit(values.pubkey, values.reason);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  // Validate pubkey format (64 character hex)
  const validatePubkey = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter a pubkey');
    }
    if (!/^[0-9a-fA-F]{64}$/.test(value)) {
      return Promise.reject('Pubkey must be a 64-character hex string');
    }
    return Promise.resolve();
  };
  

  return (
    <CardRoot title="Block a Pubkey" size="small">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="pubkey"
          label="Pubkey to block"
          rules={[{ validator: validatePubkey }]}
        >
          <InputArea placeholder="Enter the 64-character hex pubkey" />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason (optional)"
        >
          <TextArea 
            placeholder="Enter reason for blocking this pubkey" 
            rows={2} 
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={submitting}
            disabled={disabled}
          >
            Block Pubkey
          </Button>
        </Form.Item>
      </Form>
    </CardRoot>
  );
};
