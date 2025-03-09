'use client';

import {
  apiQueryPngSvgMedia,
  apiSearchIcon,
  apiUnsplashCollectionPhotos,
} from '@/requests';
import { Button, Select, Spin, Tooltip } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useRef, useState } from 'react';
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
  unsplashCollectionId?: string;
}

const SearchIconSelect = (props: IProps) => {
  const { onChange, value, color, unsplashCollectionId } = props;
  const [remoteIconList, setRemoteIconList] = useState<Array<TRemoteIcon>>([]);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);

  const searchUnsplashPhotos = async (collectionId: string) => {
    if (!collectionId || loadingRef.current) return;
    try {
      loadingRef.current = true;
      setLoading(true);
      const { response } = await apiUnsplashCollectionPhotos({
        collectionId: collectionId,
      });
      const { results } = response;
      console.log('[apiUnsplashCollection] resp', response);
      setRemoteIconList(
        results.map((item: any) => ({
          id: item.urls.full,
          type: 'unsplashMedia',
        }))
      );
    } catch (err) {
      console.log('[apiUnsplashCollection] err', err);
    }
    loadingRef.current = false;
    setLoading(false);
  };

  const onIconSearch = debounce(async (value) => {
    if (isHttpSource(value)) {
      return setRemoteIconList([{ id: value }]);
    }
    if (value) {
      setLoading(true);
      loadingRef.current = true;
      const matchImg = await handleMatchImage(value);
      setRemoteIconList(matchImg);
      const icons = await handleSearchFromAPI(value);
      setRemoteIconList((prev) => {
        return [...prev, ...icons];
      });
      setLoading(false);
      loadingRef.current = false;
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
    return apiQueryPngSvgMedia({ q: value })
      .then((res) => {
        return res.data.map((item: IMediaSource) => ({
          id: item.path,
          type: 'selfMedia',
        }));
      })
      .catch(() => []);
  };

  const renderSelectOption = (payload: TRemoteIcon) => {
    const isImg = isHttpSource(payload.id);
    return {
      label: (
        <div className={styles.option} style={{ color: color ?? '#000000' }}>
          {isImg ? (
            <img alt="" src={payload.id} className={styles.img} />
          ) : (
            <Iconify width="1.5rem" height="1.5rem" icon={payload.id} />
          )}
          &nbsp;
          <span style={{ color: '#000000' }}>{payload.id}</span>
        </div>
      ),
      value: payload.id,
    };
  };

  // useEffect(() => {
  //   if (value) {
  //     setRemoteIconList([{ id: value }]);
  //   }
  // }, [value]);

  return (
    <div>
      <div className={styles.row}>
        <Select
          allowClear
          showSearch
          filterOption={false}
          onSearch={onIconSearch}
          placeholder="关键字搜索应用图片 或 填写http开头的图片地址"
          options={remoteIconList.map((icon) => renderSelectOption(icon))}
          onChange={(value) => onChange?.(value || '')}
          value={value}
          loading={loading}
          notFoundContent={loading ? <Spin size="small" /> : null}
          style={unsplashCollectionId ? { width: 500, marginRight: 6 } : {}}
        />

        {unsplashCollectionId ? (
          <Tooltip title="刷新unsplash收藏夹中的资源">
            <Button
              icon={
                <Iconify icon="tabler:refresh" width="1rem" height="1rem" />
              }
              type="default"
              onClick={() => searchUnsplashPhotos(unsplashCollectionId || '')}
            />
          </Tooltip>
        ) : null}
      </div>

      {unsplashCollectionId && remoteIconList?.length > 0 ? (
        <div className={styles.row}>
          <div className={styles.scroll}>
            {remoteIconList.map((it) => (
              <div
                className={styles.prev}
                key={it.id}
                style={{
                  backgroundImage: `url(${it.id})`,
                  borderColor: value === it.id ? '#059669' : 'rgba(0,0,0,0.1)',
                }}
                onClick={() => onChange?.(it.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchIconSelect;
