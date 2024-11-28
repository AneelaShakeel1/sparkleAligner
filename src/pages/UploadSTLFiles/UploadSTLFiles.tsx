import React, { useState } from 'react';
import { Upload, Button, Table, Space, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const UploadSTLFiles: React.FC = () => {
  const [stlFiles, setStlFiles] = useState<any[]>([]);

  const handleUploadSTL = (file: any) => {
    setStlFiles([...stlFiles, file]);
    return false; // Prevent automatic upload
  };

  const handleDeleteSTL = (index: number) => {
    const newFiles = [...stlFiles];
    newFiles.splice(index, 1);
    setStlFiles(newFiles);
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
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteSTL(index)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>Upload STL Files (3D Scans)</h3>
      <Upload beforeUpload={handleUploadSTL} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload STL Files</Button>
      </Upload>
      <Table
        style={{ marginTop: 10 }}
        columns={columns}
        dataSource={stlFiles.map((file, index) => ({
          key: index,
          name: file.name,
        }))}
        pagination={false}
      />
    </div>
  );
};

export default UploadSTLFiles;
