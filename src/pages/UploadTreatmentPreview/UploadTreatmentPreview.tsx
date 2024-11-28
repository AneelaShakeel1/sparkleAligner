import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadTreatmentPreview: React.FC = () => {
  const [treatmentPreview, setTreatmentPreview] = useState<any>(null);

  const handleUploadTreatmentPreview = (file: any) => {
    setTreatmentPreview(file);
    message.success('Treatment preview uploaded.');
    return false; // Prevent automatic upload
  };

  return (
    <div>
      <h3>Upload Treatment Preview</h3>
      <Upload beforeUpload={handleUploadTreatmentPreview} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload Treatment Preview</Button>
      </Upload>
      {treatmentPreview && (
        <div style={{ marginTop: 10 }}>Preview: {treatmentPreview.name}</div>
      )}
    </div>
  );
};

export default UploadTreatmentPreview;
