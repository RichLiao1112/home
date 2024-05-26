import { IHead } from '@/services/home';
import HeadRight from '@/components/HeadRight';
import styles from './index.module.css';

export interface IProps {
  payload?: IHead;
}

const Head = (props: IProps) => {
  const { payload = {} } = props;
  return (
    <div className={styles.head}>
      <div className={styles.left}>
        <img alt='' src={payload.logo} className={styles.logo} />
        <div className={styles.name}>{payload.name}</div>
      </div>
      <div className={styles.right}>
        <HeadRight />
      </div>
    </div>
  );
};

export default Head;
