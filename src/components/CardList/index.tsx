import { ICard, ICardListStyle } from '@/services/home';
import Card from '@/components/Card';
import styles from './index.module.css';
import Drag, { IProps as IDrag } from '../Drag';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { apiMoveCard } from '@/requests';
import { useRouter } from 'next/navigation';

export interface IProps {
  dataSource: ICard[];
  cardListStyle: ICardListStyle | undefined;
  configKey?: string;
  categoryId?: string;
  showPlaceholder: boolean;
  setShowPlaceholder: (bool: boolean) => void;
  renderSuffix?: ReactNode;
}

const CardList = (props: IProps) => {
  const router = useRouter();
  const {
    dataSource,
    cardListStyle,
    configKey,
    categoryId,
    showPlaceholder,
    setShowPlaceholder,
    renderSuffix,
  } = props;
  const [vIndex, setVIndex] = useState<number>(-1);

  const moveItem: IDrag['moveItem'] = (current, target) => {
    if (showPlaceholder !== true) setShowPlaceholder(true);
    if (showPlaceholder === false) setShowPlaceholder(true);
    if (vIndex !== target.index) setVIndex(target.index);
  };

  const onEnd = (card: ICard & { index: number }) => {
    setVIndex(-1);
    setShowPlaceholder(false);
    const sourceCardIndex = dataSource.findIndex((item) => item.id === card.id);
    if (
      sourceCardIndex !== card.index ||
      dataSource[sourceCardIndex].categoryId !== card.categoryId
    ) {
      apiMoveCard({
        id: card.id,
        index: card.index,
        categoryId: card.categoryId,
        key: configKey ?? '',
      }).finally(() => router.refresh());
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
              {vIndex === index && showPlaceholder ? (
                <div className={styles.placeholder}>+</div>
              ) : null}
              <Card payload={item} configKey={configKey} />
            </div>
          </Drag>
        );
      })}
      {renderSuffix}
    </div>
  );
};
export default CardList;

