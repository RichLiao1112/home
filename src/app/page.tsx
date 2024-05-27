import styles from './page.module.css';
import HomeService from '@/services/home';
import Card from '@/components/Card';
import Head from '@/components/Head';
import { PageContextProvider } from '@/context/page.context';

export const dynamic = 'force-dynamic';

const readHomeData = () => {
  const { homeDBData } = HomeService;
  return homeDBData;
};

export default async function Home() {
  const homeData = readHomeData();
  const { dataSource, layout } = homeData;
  const { cardListStyle } = layout || {};

  return (
    <PageContextProvider>
      <main className={styles.main}>
        <Head layout={layout} />
        <div className={styles.flex} style={cardListStyle}>
          {dataSource?.map((item, index) => {
            return <Card payload={item} key={index} />;
          })}
        </div>
      </main>
    </PageContextProvider>
  );
}
