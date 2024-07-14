import { ILayout } from '@/services/home';
import HeadRight from '@/components/HeadRight';
import styles from './index.module.css';
import Iconify from '../Iconify';
import { isHttpSource } from '@/common';

export const dynamic = 'force-dynamic';

export interface IProps {
  layout?: ILayout;
  configKey?: string;
  env?: IEnv;
}

const Head = (props: IProps) => {
  const { layout = {}, configKey, env } = props;
  const { head = {} } = layout;

  const renderCover = (source?: string, logoColor?: string) => {
    if (isHttpSource(source)) {
      return <img src={source} alt='' className={styles.logo} />;
    }
    if (source) {
      return (
        <div className={styles.logo} style={{ color: logoColor }}>
          <Iconify icon={source} width='100%' height='100%' />
        </div>
      );
    }
    return null;
  };
  return (
    <div className={styles.head}>
      <div className={styles.left}>
        {renderCover(head.logo, head.logoColor)}
        <div className={styles.name}>{head.name}</div>
      </div>
      <div className={styles.right}>
        <HeadRight layout={layout} configKey={configKey} env={env} />
      </div>
    </div>
  );
};

export default Head;
