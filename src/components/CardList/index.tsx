import { ICard, ICardListStyle } from '@/services/home';
import Card from '@/components/Card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './index.module.css';
import Drag from '../Drag';
import { useEffect, useRef, useState } from 'react';

export interface IProps {
  dataSource: ICard[];
  cardListStyle: ICardListStyle | undefined;
  configKey?: string;
}

const CardList = (props: IProps) => {
  const { dataSource, cardListStyle, configKey } = props;

  const [list, setList] = useState(dataSource);
  const listRef = useRef(dataSource);

  const moveItem = (currentIndex: number, targetIndex: number) => {
    console.log(currentIndex, targetIndex);
    // setList((prev) => {});
    listRef.current?.splice(targetIndex, 0, dataSource[currentIndex]);
    setList(listRef.current);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.flex} style={cardListStyle}>
        {list.map((item, index) => {
          return (
            <Drag item={item} index={index} key={item.id} moveItem={moveItem}>
              <Card payload={item} configKey={configKey} />
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
