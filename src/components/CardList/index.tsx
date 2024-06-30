import { ICard, ICardListStyle } from '@/services/home';
import Card from '@/components/Card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './index.module.css';
import Drag from '../Drag';
import { useEffect, useRef, useState } from 'react';
import { apiMoveCard } from '@/requests';
import { useRouter } from 'next/navigation';

export interface IProps {
  dataSource: ICard[];
  cardListStyle: ICardListStyle | undefined;
  configKey?: string;
}

const CardList = (props: IProps) => {
  const router = useRouter();
  const { dataSource, cardListStyle, configKey } = props;
  const [vIndex, setVIndex] = useState<number>(-1);

  const moveItem = (currentIndex: number, targetIndex: number) => {
    if (vIndex !== targetIndex) {
      setVIndex(targetIndex);
    }
  };

  const onEnd = (card: ICard & { index: number }) => {
    setVIndex(-1);
    const sourceCardIndex = dataSource.findIndex((item) => item.id === card.id);
    if (sourceCardIndex !== card.index) {
      apiMoveCard({
        id: card.id,
        index: card.index,
        key: configKey ?? '',
      }).then(() => router.refresh());
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.flex} style={cardListStyle}>
        {dataSource.map((item, index) => {
          return (
            <Drag
              item={item}
              index={index}
              key={item.id}
              moveItem={moveItem}
              onEnd={onEnd}
            >
              <div className={styles.move}>
                {vIndex === index ? (
                  <div className={styles.placeholder}>+</div>
                ) : null}
                <Card payload={item} configKey={configKey} />
              </div>
            </Drag>
          );
        })}
        <Card
          type='add'
          payload={{
            title: '新增',
            cover: 'material-symbols:add',
            coverColor: '#eab308',
          }}
        />
      </div>
    </DndProvider>
  );
};
export default CardList;
