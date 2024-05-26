'use client';

import { Form, FormInstance, Input, Switch, Tag } from 'antd';
import styles from './index.module.css';
import { ICard } from '@/services/home';
import { useEffect } from 'react';

export interface IProps {
  form: FormInstance;
  originData?: ICard;
}

const EditForm = (props: IProps) => {
  const { form, originData } = props;

  const customizeRequiredMark = (
    label: React.ReactNode,
    { required }: { required: boolean }
  ) => (
    <>
      {required ? (
        <Tag color='error' style={{ fontSize: '.6rem' }}>
          必填
        </Tag>
      ) : (
        <Tag color='warning' style={{ fontSize: '.6rem' }}>
          可选
        </Tag>
      )}
      {label}
    </>
  );

  const renderLabel = (label: string, tips?: string) => {
    return (
      <div>
        <span className={styles.label}>{label}</span>
        <span className={styles.tips}>{tips}</span>
      </div>
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      ...originData,
      autoSelectLink: originData?.autoSelectLink === false ? false : true,
      openInNewWindow: originData?.openInNewWindow === false ? false : true,
    });
  }, [form, originData]);

  return (
    <Form
      layout='vertical'
      variant='outlined'
      requiredMark={customizeRequiredMark}
      form={form}
    >
      {originData?.id && (
        <Form.Item label={renderLabel('ID')} required name='id'>
          <Input disabled />
        </Form.Item>
      )}
      <Form.Item
        label={renderLabel('应用名称', '用于在面板上显示应用。')}
        required
        name='title'
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={renderLabel('应用图标', '上传应用图片')} name='cover'>
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('公网地址', '点击应用打开的公网地址')}
        name='wanLink'
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('内网地址', '点击应用打开的内部IP地址')}
        name='lanLink'
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel(
          '自动选择地址跳转',
          '若当前网站host为IP或localhost，则优先跳转内网地址'
        )}
        name='autoSelectLink'
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label={renderLabel(
          '在新标签页打开',
          '在新标签中打开应用，而不是当前标签'
        )}
        name='openInNewWindow'
      >
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default EditForm;
