'use client';

import { Form, FormInstance, Input, Select, Tag } from 'antd';
import styles from './index.module.css';
import { ILayout } from '@/services/home';
import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { apiSearchIcon } from '@/requests';
import Iconify from '@/components/Iconify';

export interface IProps {
  form: FormInstance;
  originData?: ILayout;
}

export type TRemoteIcon = {
  id: string;
};

const SettingForm = (props: IProps) => {
  const { form, originData } = props;
  const [remoteIconList, setRemoteIconList] = useState<Array<TRemoteIcon>>([]);

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

  const onIconSearch = debounce((value) => {
    if (value) {
      apiSearchIcon({ q: value })
        .then((res) => {
          const icons = (res.data?.icons || []).map((icon: TRemoteIcon) => ({
            id: icon.id,
          }));
          setRemoteIconList(icons);
        })
        .catch((err) => console.log('[onIconSearch]', err));
    }
  }, 300);

  const renderSelectOption = (payload: TRemoteIcon) => {
    return {
      label: (
        <div className={styles.option}>
          <Iconify width="2rem" height="2rem" icon={payload.id} />
          &nbsp;
          <span>{payload.id}</span>
        </div>
      ),
      value: payload.id,
    };
  };

  useEffect(() => {
    form.setFieldsValue({
      ...originData,
      cardListStyle: JSON.stringify(originData?.cardListStyle),
    });
  }, [form, originData]);

  return (
    <Form
      layout="vertical"
      variant="outlined"
      requiredMark={customizeRequiredMark}
      form={form}
    >
      <Form.Item
        label={renderLabel('logo', '本图片将被用于页面左上角')}
        name={['head', 'logo']}
      >
        <Select
          showSearch
          onSearch={onIconSearch}
          placeholder="输入关键字搜索图片"
          options={remoteIconList.map((icon) => renderSelectOption(icon))}
        />
      </Form.Item>
      <Form.Item
        label={renderLabel('站点名称', '左上角的名称')}
        name={['head', 'name']}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={renderLabel('应用卡片排版', '应用的整体排列')}
        name="cardListStyle"
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
