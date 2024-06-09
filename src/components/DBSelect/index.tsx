'use client';

import { useState } from 'react';
import { Button, Input, Modal, Select, Space, Tooltip, message } from 'antd';
import { apitUpsertDBFile, apiDeleteDBFile, apiSelectDBFile } from '@/requests';
import styles from './index.module.css';
import Iconify from '../Iconify';

export interface IProps {
  hideButtions?: boolean;
  selectStyle?: any;
  onChange: () => Promise<void>;
  value: string | undefined;
  options: TFileOptions;
}
export type TFileOptions = Array<{
  label: string;
  value: string;
}>;

const DBSelect = (props: IProps) => {
  const [open, setOpen] = useState(false);
  const [addFileName, setAddFileName] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onShowAddModal = () => {
    setAddFileName('');
    setOpen(true);
  };

  const onAdd = async () => {
    if (addFileName) {
      setLoading(true);
      try {
        const res = await apitUpsertDBFile({ key: addFileName });
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
              if (props.value === filename) {
                onSelect('default');
              } else {
                props.onChange();
              }
            } else {
              message.error('删除失败');
            }
          })
          .catch((err: any) => {
            message.error(err?.message);
            props.onChange();
          });
      },
    });
  };

  const onSelect = (value: string) => {
    apiSelectDBFile({
      key: value,
    })
      .then(() => {
        props.onChange?.();
      })
      .catch((err) => console.log(err));
  };

  const handleDownload = async () => {
    try {
      const jsonData = await import('../../../home.json');
      const blob = new Blob([JSON.stringify(jsonData.default || {}, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'home.json'; // 指定下载的文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Select
        defaultActiveFirstOption
        filterOption={false}
        options={props.options}
        style={{ width: '100%', ...props.selectStyle }}
        value={props.value}
        onChange={(value) => onSelect(value)}
        notFoundContent={null}
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
      {props.hideButtions ? null : (
        <div className={styles.btns}>
          <Space>
            <Button size='small' type='primary' onClick={handleDownload}>
              下载配置
            </Button>
            <Button size='small' type='primary' onClick={onShowAddModal}>
              新增配置
            </Button>
          </Space>
        </div>
      )}
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
};

export default DBSelect;
