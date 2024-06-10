'use client';

import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import Iconify from '../Iconify';

const props: UploadProps = {
  name: 'file',
  action: '/api/upload',
  showUploadList: {
    showRemoveIcon: true,
    removeIcon: <Iconify icon='ic:twotone-done' width='.7rem' height='.7rem' />,
  },
};

const CustomUpload = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = (info) => {
    try {
      console.log(info);
      if (info.file.status === 'error') {
        message.error(info.file.response?.message || info.file.error);
      }
      if (info.file.status === 'done' && info.file.response.success) {
        message.success(`上传成功： ${info.file.response.data.filename}`);
      }
      let newFileList = [...info.fileList];
      newFileList = newFileList.map((file) => {
        if (file.response) {
          file.url = file.response.data.link;
          file.name = file.response.data.filename || file.name;
        }
        return file;
      });

      setFileList(newFileList);
    } catch (err: any) {
      message.error(err?.message);
    }
  };
  return (
    <Upload {...props} onChange={handleChange} fileList={fileList}>
      <Button type='primary'>点我上传</Button>
    </Upload>
  );
};

export default CustomUpload;
