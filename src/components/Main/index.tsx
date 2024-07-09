'use client';

import React, { useCallback, useContext, useEffect } from 'react';
import styles from './index.module.css';
import { IDBData } from '@/services/home';
import CardList from '@/components/CardList';
import { getSelectedKey } from '@/common';
import Head from '@/components/Head';
import { PageContext } from '@/context/page.context';

export interface IProps {
  dbData: IDBData;
}

const Main = (props: IProps) => {
  const { setEditCardMode } = useContext(PageContext);
  const configKey = getSelectedKey();
  const selectedConfig = props.dbData?.[configKey];
  const { layout, dataSource = [] } = selectedConfig || {};
  const { cardListStyle, head } = layout || {};

  const onKeydown = useCallback((e: any) => {
    if (e && e.keyCode === 27) {
      // Esc button
      setEditCardMode?.(false);
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener('keydown', onKeydown);
    return () => {
      document.body.removeEventListener('keydown', onKeydown);
    };
  }, [onKeydown]);

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
function setEditCardMode(arg0: boolean) {
  throw new Error('Function not implemented.');
}
