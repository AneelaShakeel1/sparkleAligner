import React, { useState } from 'react';
import { Upload, Button, Table, Space, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const UploadDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);

  const handleUploadDocument = (file: any) => {
    setDocuments([...documents, file]);
    return false; // Prevent automatic upload
  };

  const handleDeleteDocument = (index: number) => {
    const newFiles = [...documents];
    newFiles.splice(index, 1);
    setDocuments(newFiles);
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
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteDocument(index)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>Upload Documents (PDF, DOC, etc.)</h3>
      <Upload beforeUpload={handleUploadDocument} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload Documents</Button>
      </Upload>
      <Table
        style={{ marginTop: 10 }}
        columns={columns}
        dataSource={documents.map((file, index) => ({
          key: index,
          name: file.name,
        }))}
        pagination={false}
      />
    </div>
  );
};

export default UploadDocuments;
