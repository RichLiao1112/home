'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './index.module.css';
import { ICard, ICategory, IDBData } from '@/services/home';
import CardList from '@/components/CardList';
import { getSelectedKey } from '@/common';
import Head from '@/components/Head';
import { PageContext } from '@/context/page.context';
import Category from '../Category';
import Card from '../Card';

export interface IProps {
  dbData: IDBData;
  env: IEnv;
  // categoryCards: Record<keyof IDBData, Array<ICategory & { cards?: ICard[] }>>;
}

const Main = (props: IProps) => {
  const { setEditCardMode, editCardMode } = useContext(PageContext);
  const configKey = getSelectedKey();
  const selectedConfig = props.dbData?.[configKey];
  const { layout, categories = [] } = selectedConfig || {};
  const { cardListStyle, head } = layout || {};

  const [moveToCategoryId, setMoveToCategoryId] = useState('');

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

  // const cardSortResult = useMemo(() => {
  //   const resultFromCategory: Array<ICategory & { cards?: ICard[] }> = [];
  //   const categoryId2Index: Record<any, number> = {};
  //   categories.forEach((v, i) => {
  //     if (v.id) {
  //       resultFromCategory.push({
  //         ...v,
  //         cards: [],
  //       });
  //       categoryId2Index[v.id] = resultFromCategory.length - 1;
  //     }
  //   });
  //   dataSource.forEach((card) => {
  //     if (card.categoryId) {
  //       const categoryIndex = categoryId2Index[card.categoryId];
  //       resultFromCategory[categoryIndex].cards?.push(card);
  //     }
  //   });
  //   return resultFromCategory;
  // }, [JSON.stringify(categories || []), JSON.stringify(dataSource || [])]);

  const handleChangeMovePlaceholder = useCallback((categoryId: string) => {
    setMoveToCategoryId(categoryId);
  }, []);

  const renderEditCard = () => {
    return (
      <div className={styles.editMode}>
        <Card
          type='add'
          payload={{
            title: '新增应用',
            cover: 'material-symbols:add',
            coverColor: '#eab308',
          }}
        />
        <Card
          type='addCategory'
          payload={{
            title: '新增分类',
            cover: 'material-symbols:add',
            coverColor: '#ea580c',
          }}
        />
      </div>
    );
  };

  const renderCards = () => {
    return categories.map((item) => {
      const { cards, ...category } = item;
      return (
        <div key={category.id} className={styles.category}>
          <Category
            id={category.id}
            title={category.title}
            key={category.id}
            style={category.style}
          />

          <CardList
            dataSource={cards || []}
            cardListStyle={cardListStyle}
            configKey={configKey}
            categoryId={category.id}
            moveToCategoryId={moveToCategoryId}
            onMoveCategoryChange={(categoryId) =>
              handleChangeMovePlaceholder(categoryId)
            }
          />
        </div>
      );
    });
  };

  return (
    <main
      className={styles.main}
      style={{
        backgroundImage: `url(${head?.backgroundImage || ''})`,
      }}
    >
      <Head layout={layout} configKey={configKey} env={props.env} />
      {/* {categories.map((it) => (
        <Category title={it.title} key={it.id} style={it.style} />
      ))}
      <CardList
        dataSource={dataSource}
        cardListStyle={cardListStyle}
        configKey={configKey}
      /> */}

      {/* {dataSource.length === 0 || editCardMode === true ? (
        <div className={styles.editMode}>
          <Card
            type='add'
            payload={{
              title: '新增应用',
              cover: 'material-symbols:add',
              coverColor: '#eab308',
            }}
          />
          <Card
            type='addCategory'
            payload={{
              title: '新增分类',
              cover: 'material-symbols:add',
              coverColor: '#ea580c',
            }}
          />
        </div>
      ) : null} */}
      {editCardMode === true && renderEditCard()}
      <DndProvider backend={HTML5Backend}>{renderCards()}</DndProvider>
    </main>
  );
};

export default Main;
