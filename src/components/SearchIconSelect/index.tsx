'use client';

import { apiSearchIcon } from '@/requests';
import { Select } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Iconify from '@/components/Iconify';
import { isHttpSource } from '@/common';

export type TRemoteIcon = {
  id: string;
};

export interface IProps {
  onChange?: (value: string) => void;
  value?: string;
  color?: string;
}

export default function SearchIconSelect(props: IProps) {
  const { onChange, value, color } = props;
  const [remoteIconList, setRemoteIconList] = useState<Array<TRemoteIcon>>([]);
  const [loading, setLoading] = useState(false);

  const onIconSearch = debounce((value) => {
    if (isHttpSource(value)) {
      return setRemoteIconList([{ id: value }]);
    }
    if (value) {
      setLoading(true);
      apiSearchIcon({ q: value })
        .then((res) => {
          const icons = (res.data?.icons || []).map((icon: TRemoteIcon) => ({
            id: icon.id,
          }));
          setRemoteIconList(icons);
        })
        .catch((err) => console.log('[onIconSearch]', err))
        .finally(() => setLoading(false));
    }
  }, 500);

  const renderSelectOption = (payload: TRemoteIcon) => {
    const isImg = isHttpSource(payload.id);
    return {
      label: (
        <div className={styles.option} style={{ color: color ?? '#000000' }}>
          {isImg ? (
            <img alt='' src={payload.id} className={styles.img} />
          ) : (
            <Iconify width='1.5rem' height='1.5rem' icon={payload.id} />
          )}
          &nbsp;
          <span style={{ color: '#000000' }}>{payload.id}</span>
        </div>
      ),
      value: payload.id,
    };
  };

  useEffect(() => {
    if (value) {
      setRemoteIconList([{ id: value }]);
    }
  }, [value]);

  return (
    <Select
      showSearch
      onSearch={onIconSearch}
      placeholder='输入关键字搜索图片'
      options={remoteIconList.map((icon) => renderSelectOption(icon))}
      onChange={(value) => onChange?.(value)}
      value={value}
      loading={loading}
    />
  );
}
