'use client';

import React from 'react';
import styles from './index.module.css';
import { IDBData } from '@/services/home';
import CardList from '@/components/CardList';
import { getSelectedKey } from '@/common';
import Head from '@/components/Head';

export interface IProps {
  dbData: IDBData;
}

const Main = (props: IProps) => {
  const configKey = getSelectedKey();
  const selectedConfig = props.dbData?.[configKey];
  const { layout, dataSource = [] } = selectedConfig || {};
  const { cardListStyle, head } = layout || {};

  return (
    <main
      className={styles.main}
      style={{
        backgroundImage: `url(${head?.backgroundImage || ''})`,
      }}
    >
      <Head layout={layout} configKey={configKey} />
      <CardList
        dataSource={dataSource}
        cardListStyle={cardListStyle}
        configKey={configKey}
      />
    </main>
  );
};

export default Main;
