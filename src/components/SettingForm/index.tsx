'use client';

import { Form, FormInstance, Input, Select, Tag } from 'antd';
import styles from './index.module.css';
import { ILayout } from '@/services/home';
import { useEffect } from 'react';
import SearchIconSelect from '../SearchIconSelect';
import SelcetColor from '../SelectColor';
import { isHttpSource } from '@/common';

export interface IProps {
  form: FormInstance;
  originData?: ILayout;
}

export type TRemoteIcon = {
  id: string;
};

const SettingForm = (props: IProps) => {
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
    form.setFieldsValue({
      ...originData,
      head: {
        ...(originData?.head || {}),
        logo: originData?.head?.logo || '',
        name: originData?.head?.name || '',
        backgroundImage: originData?.head?.backgroundImage || '',
        logoColor: originData?.head?.logoColor || '',
      },
      cardListStyle: originData?.cardListStyle
        ? JSON.stringify(originData?.cardListStyle)
        : '',
    });
  }, [form, originData]);

  return (
    <Form layout='vertical' variant='outlined' form={form}>
      <Form.Item shouldUpdate noStyle>
        {() => (
          <Form.Item
            label={renderLabel(
              'logo',
              '关键字搜索应用图片 或 填写http开头的图片地址'
            )}
            name={['head', 'logo']}
          >
            <SearchIconSelect
              color={form.getFieldValue(['head', 'logoColor'])}
            />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => {
          if (!isHttpSource(form.getFieldValue(['head', 'logo']))) {
            return (
              <Form.Item
                label={renderLabel(
                  '图标颜色',
                  '适用于修改搜索出的图片颜色（实验性功能）'
                )}
                name={['head', 'logoColor']}
              >
                <SelcetColor />
              </Form.Item>
            );
          }
        }}
      </Form.Item>
      <Form.Item
        label={renderLabel('站点名称', '左上角的名称')}
        name={['head', 'name']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('背景图', '页面的背景图')}
        name={['head', 'backgroundImage']}
      >
        <Input placeholder='背景图地址' />
      </Form.Item>
      <Form.Item
        label={renderLabel('应用卡片排版', '应用的整体排列')}
        name='cardListStyle'
      >
        <Select
          options={[
            {
              label: '左=>右',
              value: JSON.stringify({
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignContent: 'flex-start',
              }),
            },
            {
              label: '居中',
              value: JSON.stringify({
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }),
            },
            {
              label: '右=>左',
              value: JSON.stringify({
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                alignContent: 'flex-start',
              }),
            },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default SettingForm;
