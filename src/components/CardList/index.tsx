import { ICard, ICardListStyle } from '@/services/home';
import Card from '@/components/Card';
import styles from './index.module.css';

export interface IProps {
  dataSource: ICard[];
  cardListStyle: ICardListStyle | undefined;
  configKey?: string;
}

const CardList = (props: IProps) => {
  const { dataSource, cardListStyle, configKey } = props;
  return (
    <div className={styles.flex} style={cardListStyle}>
      {dataSource.map((item, index) => {
        return <Card payload={item} key={index} configKey={configKey} />;
      })}
      <Card
        type="add"
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
