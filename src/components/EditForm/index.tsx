'use client';

import { Form, FormInstance, Input, Switch, Tag } from 'antd';
import styles from './index.module.css';
import { ICard } from '@/services/home';
import { useEffect } from 'react';
import SearchIconSelect from '../SearchIconSelect';
import SelcetColor from '../SelectColor';
import { DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { isHttpSource } from '@/common';

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
        <Tag color="error" style={{ fontSize: '.6rem' }}>
          必填
        </Tag>
      ) : (
        <Tag color="warning" style={{ fontSize: '.6rem' }}>
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
      layout="vertical"
      variant="outlined"
      // requiredMark={customizeRequiredMark}
      form={form}
    >
      {originData?.id && (
        <Form.Item label={renderLabel('ID')} required name="id">
          <Input disabled />
        </Form.Item>
      )}
      <Form.Item
        label={renderLabel('应用名称', '用于在面板上显示应用。')}
        required
        name="title"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => (
          <Form.Item
            label={renderLabel(
              '应用图标',
              '关键字搜索应用图片 或 填写http开头的图片地址'
            )}
            name="cover"
          >
            <SearchIconSelect color={form.getFieldValue('coverColor')} />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => {
          if (!isHttpSource(form.getFieldValue('cover'))) {
            return (
              <Form.Item
                label={renderLabel(
                  '图标颜色',
                  '适用于修改搜索出的图片颜色（实验性功能）'
                )}
                name="coverColor"
              >
                <SelcetColor />
              </Form.Item>
            );
          }
        }}
      </Form.Item>
      <Form.Item
        label={
          <>
            <DesktopOutlined style={{ fontSize: '1rem' }} />
            &nbsp;
            {renderLabel('公网地址', '点击应用打开的公网地址')}
          </>
        }
        name="wanLink"
      >
        <Input placeholder="http..." />
      </Form.Item>
      <Form.Item
        label={
          <>
            <GlobalOutlined style={{ fontSize: '1rem' }} />
            &nbsp;
            {renderLabel('内网地址', '点击应用打开的内部IP地址')}
          </>
        }
        name="lanLink"
      >
        <Input placeholder="http..." />
      </Form.Item>
      {/* <Form.Item
        label={renderLabel(
          '自动选择地址跳转',
          '若当前网站host为IP或localhost，则优先跳转内网地址'
        )}
        name='autoSelectLink'
      >
        <Switch />
      </Form.Item> */}
      <Form.Item
        label={renderLabel(
          '在新标签页打开',
          '在新标签中打开应用，而不是当前标签'
        )}
        name="openInNewWindow"
      >
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default EditForm;
