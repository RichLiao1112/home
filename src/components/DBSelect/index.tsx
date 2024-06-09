'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Modal, Select, Space, Tooltip, message } from 'antd';
import {
  apiQueryDBFiles,
  apitUpsertDBFile,
  apiDeleteDBFile,
  apiSelectDBFile,
  apiGetAllDBData,
} from '@/requests';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';
import Iconify from '../Iconify';

export interface IProps {
  onChange?: (value?: string) => void;
  value?: string;
}
export type TFileOptions = Array<{
  label: string;
  value: string;
}>;

export default function DBSelect(props: IProps) {
  const router = useRouter();
  const [options, setOptions] = useState<TFileOptions>([]);
  const [current, setCurrent] = useState<string>();
  const [open, setOpen] = useState(false);
  const [addFileName, setAddFileName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const onShowAddModal = () => {
    setAddFileName('');
    setOpen(true);
  };

  const onAdd = async () => {
    if (addFileName) {
      setLoading(true);
      try {
        const res = await apitUpsertDBFile({ key: addFileName });
        const files = await fetchDBFiles();
        if (res.success) {
          message.success('新增成功');
          setOpen(false);
          setAddFileName('');
          onSelect(addFileName);
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
      const { all, current } = data;
      const dbConfigs = all.map((it: string) => ({ label: it, value: it }));
      setCurrent(current);
      setOptions(dbConfigs);
      return dbConfigs;
    });
  };

  const onDeleteClick = (filename: string) => {
    Modal.confirm({
      title: `删除后不可恢复，确定删除 ${filename} ？`,
      onOk: () => {
        apiDeleteDBFile({
          key: filename,
        })
          .then((res) => {
            if (res.success) {
              message.success('删除成功');
              if (current === filename) {
                onSelect('default');
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

  const onSelect = (value: string) => {
    setCurrent(value);
    apiSelectDBFile({
      key: value,
    })
      .then(() => router.refresh())
      .catch((err) => console.log(err))
      .finally(() => fetchDBFiles());
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await apiGetAllDBData();
      const jsonData = res.data;
      const blob = new Blob([JSON.stringify(jsonData || {}, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'home.json'; // 指定下载的文件名
      document.body.appendChild(link);
      link.click();
      message.info('已触发下载，请关注浏览器下载状况');
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.log(err);
      message.error(err.message);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchDBFiles();
  }, []);

  return (
    <div>
      <Select
        options={options}
        style={{ width: '100%' }}
        value={current}
        onChange={(value) => onSelect(value)}
        optionRender={(option) => {
          return (
            <div className={styles.option}>
              <span>{option.label}</span>
              <Space>
                {option.label !== 'default' && (
                  <Tooltip title='删除配置'>
                    <Button
                      type='text'
                      shape='circle'
                      icon={
                        <span style={{ color: 'red' }}>
                          <Iconify
                            icon='mdi:minus-circle'
                            width='1.2rem'
                            height='1.2rem'
                          />
                        </span>
                      }
                      size='small'
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
      />
      <div className={styles.btns}>
        <Space>
          <Button
            size='small'
            type='primary'
            onClick={handleDownload}
            loading={downloading}
          >
            下载配置
          </Button>
          <Button size='small' type='primary' onClick={onShowAddModal}>
            新增配置
          </Button>
        </Space>
      </div>
      <Modal
        title='新增配置'
        open={open}
        onOk={onAdd}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          loading,
        }}
      >
        <Input
          placeholder='输入配置名字（不可重复）'
          onChange={(e) => setAddFileName(e.target.value)}
          value={addFileName}
        />
      </Modal>
    </div>
  );
}
