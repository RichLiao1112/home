'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './index.module.css';
import { ICard, ICategory, IDBData } from '@/services/home';
import CardList from '@/components/CardList';
import {
  extractHost,
  getDomainIP,
  getPublicIP,
  getSelectedKey,
  isPrivateIP,
  jumpMode,
  setLinkJumpMode,
} from '@/common';
import Head from '@/components/Head';
import { PageContext } from '@/context/page.context';
import Category from '../Category';
import Card from '../Card';
import { message } from 'antd';

export interface IProps {
  dbData: IDBData;
  env: IEnv;
}

const Main = (props: IProps) => {
  const { setEditCardMode, editCardMode, setLinkMode } =
    useContext(PageContext);
  const configKey = getSelectedKey();
  const selectedConfig = props.dbData?.[configKey];
  const { layout, categories = [] } = selectedConfig || {};
  const { cardListStyle, head } = layout || {};
  const categoryOptions = categories.map((it) => ({
    label: it.title || '',
    value: it.id,
  }));
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const categoryNameStyle = JSON.parse(head?.categoryNameStyle || '{}');

  const [isLocalNet, setIsLocalNet] = useState(false);
  const lanChangeRef = useRef(false);

  const changeLanMode = (isLocal = true) => {
    const mode = isLocal ? jumpMode.lan : jumpMode.wan;
    setIsLocalNet(isLocal);
    setLinkMode?.(mode);
    setLinkJumpMode(mode);
    if (lanChangeRef.current === false) {
      lanChangeRef.current = true;
      if (isLocal) {
        message.warning('「内网」IP访问优先');
      } else {
        message.success('「公网」IP访问优先');
      }
    }
  }

  useEffect(() => {
    const isCurrentHostPrivate = isPrivateIP(extractHost(location.href));
    if (isCurrentHostPrivate) {
      console.log(`当前为内网IP访问: `, location.href);
      // setIsLocalNet(true);
      // setLinkMode?.(jumpMode.lan);
      // setLinkJumpMode(jumpMode.lan);
      // if (lanChangeRef.current === false) {
      //   lanChangeRef.current = true;
      //   message.warning('已自动切换至「内网」IP访问优先');
      // }
      changeLanMode(true)
    } else {
      Promise.all([getPublicIP(), getDomainIP(location.href)])
        .then(([res1, res2]) => {
          console.log('当前公网IP: ', res1, '。', '当前域名IP:', res2);
          if (res1 === res2 || isPrivateIP(res2) || isPrivateIP(res1)) {
            console.log(`是内网：`, res1, res2);
            changeLanMode(true)
          } else {
            changeLanMode(false)
          }
        })
        .catch(() => setIsLocalNet(false));
    }
  }, []);

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

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--backgorund-blur',
      `${head?.backgroundBlur || 0}px`
    );
  }, [head?.backgroundBlur]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--background-image',
      `url(${head?.backgroundImage || ''})`
    );
  }, [head?.backgroundImage]);

  const renderEditCard = (payload: {
    categoryId?: string;
    showCardType: string[];
  }) => {
    const { categoryId, showCardType } = payload;
    return (
      <div className={styles.editMode}>
        {showCardType.includes('add') && (
          <Card
            type="add"
            payload={{
              title: '新增应用',
              cover: 'material-symbols:add',
              coverColor: '#eab308',
            }}
            addCardNormalCategoryId={categoryId}
          />
        )}

        {showCardType.includes('addCategory') && (
          <Card
            type="addCategory"
            payload={{
              title: '新增分类',
              cover: 'material-symbols:add',
              coverColor: '#ea580c',
            }}
          />
        )}
      </div>
    );
  };

  const renderCards = () => {
    return categories.map((item) => {
      const { cards, ...category } = item;
      const dataSource = cards || [];
      return (
        <div key={category.id} className={styles.category}>
          <Category
            id={category.id}
            title={category.title}
            key={category.id}
            configKey={configKey}
            style={{
              ...category.style,
              ...(categoryNameStyle || {}),
            }}
          />

          <CardList
            key={`${category.id}-card-list`}
            dataSource={dataSource}
            cardListStyle={cardListStyle}
            configKey={configKey}
            categoryId={category.id}
            showPlaceholder={showPlaceholder}
            setShowPlaceholder={setShowPlaceholder}
            renderSuffix={
              dataSource.length === 0 || editCardMode === true
                ? renderEditCard({
                    categoryId: category?.id,
                    showCardType: ['add'],
                  })
                : null
            }
          />
        </div>
      );
    });
  };

  return (
    <main className={styles.main}>
      <Head
        layout={layout}
        configKey={configKey}
        env={props.env}
        categoryOptions={categoryOptions}
      />
      <DndProvider backend={HTML5Backend}>{renderCards()}</DndProvider>
      {editCardMode === true &&
        renderEditCard({
          categoryId: categories?.[0]?.id,
          showCardType: ['addCategory'],
        })}
      <div className={styles.interface}>
        <div
          className={styles.blur}
          style={{
            backgroundImage: `url(${head?.backgroundImage || ''})`,
            filter: `blur(var(--backgorund-blur))`,
          }}
        />
      </div>
    </main>
  );
};

export default Main;
