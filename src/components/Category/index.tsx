'use client';

import React, { useContext } from 'react';
import styles from './index.module.css';
import Iconify from '../Iconify';
import { PageContext } from '@/context/page.context';
import { ICategory } from '@/services/home';
import { apiDeleteCategory } from '@/requests';
import { message, Modal, Tooltip, Button } from 'antd';
import { useRouter } from 'next/navigation';

export interface IProps extends ICategory {
  configKey?: string;
  handleOpenSortModal?: () => void;
}

const Category = (props: IProps) => {
  const router = useRouter();
  const { title, style, id, configKey } = props;
  const { setEditCategory } = useContext(PageContext);

  const deleteSelf = () => {
    Modal.confirm({
      title: `删除类目：${title}`,
      content: '删除前，需要先清空该类目下的应用卡片。',
      onOk() {
        apiDeleteCategory({
          id,
          key: configKey,
        })
          .then((res) => {
            console.log(res);
            if (res.success !== true) {
              message.error(res.message);
            }
          })
          .catch((err) => {
            message.error(err.message);
          })
          .finally(() => router.refresh());
      },
    });
  };

  return (
    <div className={styles.category}>
      <div style={{ ...(style || {}), direction: style?.textAlign === 'right' ? 'rtl' : 'ltr' }}>
        <span className={styles.title}>{title}</span>
        <div className={styles.icons}>
          <Tooltip title="删除">
            <Button
              icon={
                <Iconify
                  icon="mono-icons:delete"
                  width="1rem"
                  height="1rem"
                />
              }
              type="text"
              onClick={deleteSelf}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              icon={
                <Iconify
                  icon="uil:edit-alt"
                  width="1rem"
                  height="1rem"
                />
              }
              type="text"
              onClick={() => {
                setEditCategory?.({
                  open: true,
                  title: '编辑',
                  data: {
                    title: title,
                    style: style,
                    id: id,
                  },
                });
              }}
            />
          </Tooltip>
          <Tooltip title="排序">
            <Button
              icon={
                <Iconify
                  icon="line-md:menu"
                  width="1rem"
                  height="1rem"
                />
              }
              type="text"
              onClick={() => {
                props.handleOpenSortModal?.();
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Category;
