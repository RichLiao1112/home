import { ICard, ICardListStyle } from '@/services/home';
import Card from '@/components/Card';
import styles from './index.module.css';

export interface IProps {
  dataSource: ICard[];
  cardListStyle: ICardListStyle | undefined;
}

const CardList = (props: IProps) => {
  const { dataSource, cardListStyle } = props;
  return (
    <div className={styles.flex} style={cardListStyle}>
      {dataSource.map((item, index) => {
        return <Card payload={item} key={index} />;
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
  );
};
export default CardList;
