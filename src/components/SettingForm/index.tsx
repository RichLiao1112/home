'use client';

import { Form, FormInstance, Input, Select, Tag } from 'antd';
import styles from './index.module.css';
import { ILayout } from '@/services/home';
import { useEffect } from 'react';
const { Option } = Select;

export interface IProps {
  form: FormInstance;
  originData?: ILayout;
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
    form.setFieldsValue({
      ...originData,
      cardListStyle: JSON.stringify(originData?.cardListStyle),
    });
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
        name={['head', 'logo']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('站点名称', '左上角的名称')}
        name={['head', 'name']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('应用卡片排版', '应用的整体排列')}
        name='cardListStyle'
      >
        <Select
          options={[
            {
              label: '左上=>右下',
              value: JSON.stringify({
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }),
            },
            {
              label: '居中',
              value: JSON.stringify({
                justifyContent: 'center',
                alignItems: 'center',
              }),
            },
            {
              label: '右上=>左下',
              value: JSON.stringify({
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }),
            },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default SettingForm;
