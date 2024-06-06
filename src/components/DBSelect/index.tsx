'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Modal, Select, Space, Tooltip, message } from 'antd';
import {
  apiQueryDBFiles,
  apitUpsertDBFile,
  apiDeleteDBFile,
  apiSelectDBFile,
} from '@/requests';
import { IFile } from '@/services/home';
import styles from './index.module.css';
import { MinusCircleFilled } from '@ant-design/icons';
import { defaultDBFile } from '@/common';
import { useRouter } from 'next/navigation';

export interface IProps {
  onChange?: (value?: string) => void;
  value?: string;
}

export default function DBSelect(props: IProps) {
  const router = useRouter();
  const [options, setOptions] = useState<IFile[]>([]);
  const [current, setCurrent] = useState<IFile>();
  const [open, setOpen] = useState(false);
  const [addFileName, setAddFileName] = useState<string>();
  const [loading, setLoading] = useState(false);

  const genValue = (payload?: IFile) => {
    if (!payload) return '';
    return JSON.stringify(payload);
  };

  const onShowAddModal = () => {
    setOpen(true);
  };

  const labelSplit = (label: string) => {
    return label.slice(0, label.length - 5);
  };

  const onAdd = async () => {
    if (addFileName) {
      setLoading(true);
      const res = await apitUpsertDBFile({ filename: addFileName }).finally(
        () => setLoading(false)
      );
      fetchDBFiles();
      console.log(res);
      if (res.success) {
        setOpen(false);
        setAddFileName('');
      }
    }
  };

  const fetchDBFiles = () => {
    apiQueryDBFiles().then((res) => {
      const { data } = res;
      const { db, all } = data;
      const files = all.map((it: IFile) => ({
        label: labelSplit(it.filename),
        value: genValue(it),
      }));
      setCurrent(db);
      setOptions(files);
    });
  };

  const onDeleteClick = (filename: string) => {
    Modal.confirm({
      title: `删除后不可恢复，确定删除 ${filename} ？`,
      onOk: () => {
        apiDeleteDBFile({
          filename,
        })
          .then((res) => {
            if (res.success) {
              message.success('删除成功');
            } else {
              message.error('删除失败');
            }
          })
          .catch((err: any) => message.error(err?.message))
          .finally(() => {
            fetchDBFiles();
          });
      },
    });
  };

  const onSelectClick = (value: string) => {
    console.log(value);
    const payload: IFile = JSON.parse(value || '{}');
    apiSelectDBFile({
      filename: payload.filename,
      basePath: payload.basePath,
      type: payload.type,
    })
      .then((res) => router.refresh())
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDBFiles();
  }, []);

  return (
    <div>
      <Select
        options={options}
        optionRender={(option) => {
          return (
            <div className={styles.option}>
              <span>{option.data.label}</span>
              <Space>
                {/* <Button
                  type="text"
                  shape="circle"
                  icon={<DownloadOutlined />}
                  size="small"
                /> */}
                {option.data.label !== labelSplit(defaultDBFile.filename) && (
                  <Tooltip title="删除配置">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<MinusCircleFilled style={{ color: 'red' }} />}
                      size="small"
                      onClick={() => onDeleteClick(option.data.label)}
                    />
                  </Tooltip>
                )}
              </Space>
            </div>
          );
        }}
        style={{ width: '100%' }}
        value={genValue(current)}
        onChange={(value) => onSelectClick(value)}
      />
      <div className={styles.btns}>
        {/* <Button size="small" type="dashed">
          下载配置
        </Button> */}
        <Button size="small" type="primary" onClick={onShowAddModal}>
          新增一份配置
        </Button>
        {/* <Button danger type="dashed" size="small">
          删除配置
        </Button> */}
      </div>
      <Modal
        title="新增配置"
        open={open}
        onOk={onAdd}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          loading,
        }}
      >
        <Input
          placeholder="输入配置名字（不可重复）"
          onChange={(e) => setAddFileName(e.target.value)}
        />
      </Modal>
    </div>
  );
}
