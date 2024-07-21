import { ICard, ICardListStyle } from '@/services/home';
import Card from '@/components/Card';
import styles from './index.module.css';
import Drag, { IProps as IDrag } from '../Drag';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiMoveCard } from '@/requests';
import { useRouter } from 'next/navigation';

export interface IProps {
  dataSource: ICard[];
  cardListStyle: ICardListStyle | undefined;
  configKey?: string;
  categoryId?: string;
  moveToCategoryId: string;
  onMoveCategoryChange: (categoryId: string) => void;
}

const CardList = (props: IProps) => {
  const router = useRouter();
  const {
    dataSource,
    cardListStyle,
    configKey,
    // categoryId,
    // moveToCategoryId,
    // onMoveCategoryChange,
  } = props;
  const [vIndex, setVIndex] = useState<number>(-1);

  const moveItem: IDrag['moveItem'] = (current, target) => {
    // console.log(target.item.categoryId, moveToCategoryId);
    // onMoveCategoryChange(target.item.categoryId);

    if (vIndex !== target.index) {
      setVIndex(target.index);
    }
  };

  const onEnd = (card: ICard & { index: number }) => {
    setVIndex(-1);
    // onMoveCategoryChange('');
    const sourceCardIndex = dataSource.findIndex((item) => item.id === card.id);
    if (sourceCardIndex !== card.index) {
      apiMoveCard({
        id: card.id,
        index: card.index,
        categoryId: card.categoryId,
        key: configKey ?? '',
      }).then(() => router.refresh());
    }
  };

  return (
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
    </div>
  );
};
export default CardList;
