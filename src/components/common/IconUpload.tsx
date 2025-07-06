import React, { useState, useRef, useEffect } from 'react';
import { Input, Upload, Button, message, Tabs, Avatar } from 'antd';
import { UploadOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadToBlossom, isValidUrl, isImageUrl } from '@app/utils/blossomUpload';
import type { RcFile } from 'antd/es/upload/interface';

interface IconUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  maxSize?: number; // in MB
}

const IconUpload: React.FC<IconUploadProps> = ({
  value = '',
  onChange,
  placeholder = 'https://example.com/icon.png',
  maxSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const [activeTab, setActiveTab] = useState('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when value prop changes (when form data loads)
  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    
    // Validate and update parent component
    if (newUrl === '' || isValidUrl(newUrl)) {
      onChange?.(newUrl);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: RcFile): Promise<boolean> => {
    try {
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Please select an image file');
        return false;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        message.error(`File size must be less than ${maxSize}MB`);
        return false;
      }

      // Upload to Blossom server
      const result = await uploadToBlossom(file);
      
      // Update URL input and parent component
      setUrlInput(result.url);
      onChange?.(result.url);
      
      message.success('Icon uploaded successfully!');
      
      // Switch to URL tab to show the uploaded URL
      setActiveTab('url');
      
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      message.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Custom upload handler that prevents default upload behavior
  const beforeUpload = (file: RcFile) => {
    handleFileUpload(file);
    return false; // Prevent default upload
  };

  // Handle file input change (for custom file input)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file as RcFile);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Clear the current icon
  const handleClear = () => {
    setUrlInput('');
    onChange?.('');
  };

  const tabItems = [
    {
      key: 'url',
      label: (
        <span>
          <LinkOutlined />
          URL
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Input
            value={urlInput}
            onChange={handleUrlChange}
            placeholder={placeholder}
            prefix={<LinkOutlined />}
            suffix={
              urlInput && (
                <Button
                  type="text"
                  size="small"
                  onClick={handleClear}
                  style={{ color: '#999' }}
                >
                  Clear
                </Button>
              )
            }
          />
          {urlInput && !isValidUrl(urlInput) && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              Please enter a valid URL
            </div>
          )}
          {urlInput && isValidUrl(urlInput) && !isImageUrl(urlInput) && (
            <div style={{ color: '#faad14', fontSize: '12px', marginTop: '4px' }}>
              Warning: URL may not point to an image file
            </div>
          )}
        </div>
      )
    },
    {
      key: 'upload',
      label: (
        <span>
          {uploading ? <LoadingOutlined /> : <UploadOutlined />}
          Upload
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          
          <Upload.Dragger
            beforeUpload={beforeUpload}
            showUploadList={false}
            accept="image/*"
            disabled={uploading}
            style={{ marginBottom: '16px' }}
          >
            <div style={{ padding: '20px' }}>
              {uploading ? (
                <>
                  <LoadingOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                  <p>Uploading to Blossom server...</p>
                </>
              ) : (
                <>
                  <UploadOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                  <p>Click or drag image to upload</p>
                  <p style={{ color: '#999', fontSize: '12px' }}>
                    Supports: JPG, PNG, GIF, WebP (max {maxSize}MB)
                  </p>
                </>
              )}
            </div>
          </Upload.Dragger>

          <div style={{ marginBottom: '16px' }}>OR</div>
          
          <Button
            icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
            onClick={triggerFileInput}
            disabled={uploading}
            loading={uploading}
          >
            Choose File
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="small"
      />
      
      {/* Preview */}
      {urlInput && isValidUrl(urlInput) && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
            Preview:
          </div>
          <Avatar
            src={urlInput}
            size={64}
            shape="square"
            style={{ border: '1px solid #d9d9d9' }}
          />
        </div>
      )}
    </div>
  );
};

export default IconUpload;