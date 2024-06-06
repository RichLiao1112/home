import { ILayout } from '@/services/home';
import HeadRight from '@/components/HeadRight';
import styles from './index.module.css';
import Iconify from '../Iconify';
import { isHttpSource } from '@/common';
import HomeService from '@/services/home';

export interface IProps {
  layout?: ILayout;
}

const Head = (props: IProps) => {
  const { layout = {} } = props;
  const { head = {} } = layout;

  const renderCover = (source?: string, logoColor?: string) => {
    if (isHttpSource(source)) {
      return <img src={source} alt="" className={styles.logo} />;
    }
    if (source) {
      return (
        <div className={styles.logo} style={{ color: logoColor }}>
          <Iconify icon={source} width="100%" height="100%" />
        </div>
      );
    }
    return <div className={styles.logo} style={{ color: logoColor }}></div>;
  };
  return (
    <div className={styles.head}>
      <div className={styles.left}>
        {renderCover(head.logo, head.logoColor)}
        <div className={styles.name}>{head.name}</div>
      </div>
      <div className={styles.right}>
        <HeadRight layout={layout} />
      </div>
    </div>
  );
};

export default Head;
