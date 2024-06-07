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
export type TFileOptions = Array<{
  label: string;
  value: string;
  dataSource: IFile;
}>;

export default function DBSelect(props: IProps) {
  const router = useRouter();
  const [options, setOptions] = useState<TFileOptions>([]);
  const [current, setCurrent] = useState<IFile['filename']>();
  const [open, setOpen] = useState(false);
  const [addFileName, setAddFileName] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onShowAddModal = () => {
    setAddFileName('');
    setOpen(true);
  };

  const labelSplit = (label: string) => {
    return label;
    // return label.slice(0, label.length - 5);
  };

  const onAdd = async () => {
    if (addFileName) {
      setLoading(true);
      try {
        const res = await apitUpsertDBFile({ filename: addFileName });
        const files = await fetchDBFiles();
        if (res.success) {
          message.success('新增成功');
          setOpen(false);
          setAddFileName('');
          onSelect(`${addFileName}.json`, files);
        } else {
          message.error('新增失败: ' + res.message);
        }
      } catch (err) {
        console.log('[onAdd]', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchDBFiles = () => {
    return apiQueryDBFiles().then((res) => {
      const { data } = res;
      const { db, all } = data;
      const files = all.map((it: IFile) => ({
        label: labelSplit(it.filename),
        value: it.filename,
        dataSource: it,
      }));
      setCurrent(db.filename);
      setOptions(files);
      return files;
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
              if (current === filename) {
                onSelect(defaultDBFile.filename);
              } else {
                fetchDBFiles();
              }
            } else {
              message.error('删除失败');
            }
          })
          .catch((err: any) => {
            message.error(err?.message);
            fetchDBFiles();
          });
      },
    });
  };

  const onSelect = (value: string, data?: TFileOptions) => {
    const list = data || options;
    const payload = list.find((it) => it.value === value);
    if (payload) {
      setCurrent(value);
      const { dataSource } = payload;
      apiSelectDBFile({
        filename: dataSource.filename,
        basePath: dataSource.basePath,
        type: dataSource.type,
      })
        .then(() => router.refresh())
        .catch((err) => console.log(err))
        .finally(() => fetchDBFiles());
    }
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteClick(option.data.label);
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            </div>
          );
        }}
        style={{ width: '100%' }}
        value={current}
        onChange={(value) => onSelect(value)}
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
          value={addFileName}
        />
      </Modal>
    </div>
  );
}
