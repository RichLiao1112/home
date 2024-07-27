'use client';

import React, { useContext } from 'react';
import styles from './index.module.css';
import Iconify from '../Iconify';
import { PageContext } from '@/context/page.context';
import { ICategory } from '@/services/home';
import { apiDeleteCategory } from '@/requests';
import { message, Modal } from 'antd';
import { useRouter } from 'next/navigation';

export interface IProps extends ICategory {
  configKey?: string;
}

const Category = (props: IProps) => {
  const router = useRouter();
  const { title, style, id, configKey } = props;
  const { setEditCategory } = useContext(PageContext);

  const deleteSelf = () => {
    Modal.confirm({
      title: `删除类目：${title}`,
      content: '删除前，须先清空该类目下的卡片。',
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
      <div style={style}>
        <span className={styles.title}>{title}</span>
        <div className={styles.icons}>
          <Iconify
            icon='uil:edit-alt'
            width='1rem'
            height='1rem'
            className={styles.icon}
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
          <Iconify
            icon='mono-icons:delete'
            width='1rem'
            height='1rem'
            className={styles.icon}
            onClick={deleteSelf}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;

