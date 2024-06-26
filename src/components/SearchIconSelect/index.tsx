'use client';

import { apiQueryPngSvgMedia, apiSearchIcon } from '@/requests';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import Iconify from '@/components/Iconify';
import { isHttpSource } from '@/common';
import { IMediaSource } from '@/services/media';

export type TRemoteIcon = {
  id: string;
};

export interface IProps {
  onChange?: (value: string) => void;
  value?: string;
  color?: string;
}

const SearchIconSelect = (props: IProps) => {
  const { onChange, value, color } = props;
  const [remoteIconList, setRemoteIconList] = useState<Array<TRemoteIcon>>([]);
  const [loading, setLoading] = useState(false);

  const onIconSearch = debounce(async (value) => {
    if (isHttpSource(value)) {
      return setRemoteIconList([{ id: value }]);
    }
    if (value) {
      setLoading(true);
      const matchImg = await handleMatchImage(value);
      setRemoteIconList(matchImg);
      const icons = await handleSearchFromAPI(value);
      setRemoteIconList((prev) => {
        return [...prev, ...icons];
      });
      setLoading(false);
      // Promise.all([handleMatchImage(value), handleSearchFromAPI(value)])
      //   .then(([matchImages, iconify]) => {
      //     setRemoteIconList([...matchImages, ...iconify]);
      //   })
      //   .catch((err) => console.log('[onIconSearch]', err))
      //   .finally(() => setLoading(false));
    }
  }, 300);

  const handleSearchFromAPI = (
    value: string
  ): Promise<{ id: string; type: 'iconify' }[]> => {
    return apiSearchIcon({ q: value })
      .then((res) => {
        const icons = (res.data?.icons || []).map((icon: TRemoteIcon) => ({
          id: icon.id,
          type: 'iconify',
        }));
        return icons;
      })
      .catch(() => []);
  };

  const handleMatchImage = (value: string) => {
    return apiQueryPngSvgMedia({ q: value }).then((res) => {
      return res.data.map((item: IMediaSource) => ({
        id: item.path,
        type: 'selfMedia',
      }));
    });
  };

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
      allowClear
      showSearch
      filterOption={false}
      onSearch={onIconSearch}
      placeholder='关键字搜索应用图片 或 填写http开头的图片地址'
      options={remoteIconList.map((icon) => renderSelectOption(icon))}
      onChange={(value) => onChange?.(value || '')}
      value={value}
      loading={loading}
      notFoundContent={loading ? <Spin size='small' /> : null}
    />
  );
};

export default SearchIconSelect;
