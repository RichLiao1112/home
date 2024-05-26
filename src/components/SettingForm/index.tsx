'use client';

import { Form, FormInstance, Input, Switch, Tag } from 'antd';
import styles from './index.module.css';
import { IHead } from '@/services/home';
import { useEffect } from 'react';

export interface IProps {
  form: FormInstance;
  originData?: IHead;
}

const SettingForm = (props: IProps) => {
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
    form.setFieldsValue(originData);
  }, [form, originData]);

  return (
    <Form
      layout='vertical'
      variant='outlined'
      requiredMark={customizeRequiredMark}
      form={form}
    >
      <Form.Item
        label={renderLabel('logo', '本图片将被用于页面左上角')}
        name='logo'
      >
        <Input />
      </Form.Item>
      <Form.Item label={renderLabel('站点名称', '左上角的名称')} name='name'>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default SettingForm;
