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
}

const Main = (props: IProps) => {
  const { setEditCardMode, editCardMode } = useContext(PageContext);
  const configKey = getSelectedKey();
  const selectedConfig = props.dbData?.[configKey];
  const { layout, categories = [] } = selectedConfig || {};
  const { cardListStyle, head } = layout || {};
  const [showPlaceholder, setShowPlaceholder] = useState(true);

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

  const renderEditCard = (payload: {
    categoryId?: string;
    showCardType: string[];
  }) => {
    const { categoryId, showCardType } = payload;
    return (
      <div className={styles.editMode}>
        {showCardType.includes('add') && (
          <Card
            type='add'
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
            type='addCategory'
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
            style={category.style}
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
    <main
      className={styles.main}
      style={{
        backgroundImage: `url(${head?.backgroundImage || ''})`,
      }}
    >
      <Head layout={layout} configKey={configKey} env={props.env} />
      <DndProvider backend={HTML5Backend}>{renderCards()}</DndProvider>
      {editCardMode === true &&
        renderEditCard({
          categoryId: categories?.[0]?.id,
          showCardType: ['addCategory'],
        })}
    </main>
  );
};

export default Main;

