import React, { useState } from 'react';
import { Upload, Button, Table, Space, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const UploadTeethImages: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<any[]>([]);

  const handleUploadImage = (file: any) => {
    setImageFiles([...imageFiles, file]);
    return false; // Prevent automatic upload
  };

  const handleDeleteImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    message.success('This document has been deleted.');
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any, index: number) => (
        <Space size="middle">
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteImage(index)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>Upload Teeth Images</h3>
      <Upload beforeUpload={handleUploadImage} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload Teeth Images</Button>
      </Upload>
      <Table
        style={{ marginTop: 10 }}
        columns={columns}
        dataSource={imageFiles.map((file, index) => ({
          key: index,
          name: file.name,
        }))}
        pagination={false}
      />
    </div>
  );
};

export default UploadTeethImages;
