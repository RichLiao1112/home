'use client';

import { useEffect } from 'react';
import { Form, FormInstance, Input } from 'antd';
import styles from './index.module.css';
import { ICategory } from '@/services/home';
import SelcetColor from '../SelectColor';

export interface IProps {
  form: FormInstance;
  originData?: Partial<ICategory>;
}

const CategoryEditForm = (props: IProps) => {
  const { form, originData } = props;

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
      // requiredMark={customizeRequiredMark}
      form={form}
    >
      {originData?.id && (
        <Form.Item label={renderLabel('ID')} required name='id'>
          <Input disabled />
        </Form.Item>
      )}
      <Form.Item
        label={renderLabel('类目名称')}
        required
        name='title'
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('名称颜色')}
        required
        name={['style', 'color']}
        rules={[{ required: true, message: '' }]}
      >
        <SelcetColor />
      </Form.Item>
    </Form>
  );
};

export default CategoryEditForm;

