import { ILayout } from '@/services/home';
import HeadRight from '@/components/HeadRight';
import styles from './index.module.css';

export interface IProps {
  layout?: ILayout;
}

const Head = (props: IProps) => {
  const { layout = {} } = props;
  const { head = {} } = layout;
  return (
    <div className={styles.head}>
      <div className={styles.left}>
        <img alt='' src={head.logo || '/home.png'} className={styles.logo} />
        <div className={styles.name}>{head.name}</div>
      </div>
      <div className={styles.right}>
        <HeadRight layout={layout} />
      </div>
    </div>
  );
};

export default Head;
