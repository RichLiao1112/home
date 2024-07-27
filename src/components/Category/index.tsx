'use client';

import React, { useContext } from 'react';
import styles from './index.module.css';
import Iconify from '../Iconify';
import { PageContext } from '@/context/page.context';
import { ICategory } from '@/services/home';

export interface IProps extends ICategory {}

const Category = (props: IProps) => {
  const { title, style, id } = props;
  const { setEditCategory } = useContext(PageContext);

  return (
    <div className={styles.category}>
      <div style={style}>
        <span className={styles.title}>{title}</span>
        <Iconify
          icon='uil:edit-alt'
          width='1rem'
          height='1rem'
          className={styles.edit}
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
      </div>
    </div>
  );
};

export default Category;

