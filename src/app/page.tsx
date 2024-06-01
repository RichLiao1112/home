import styles from './page.module.css';
import HomeService from '@/services/home';
import Head from '@/components/Head';
import { PageContextProvider } from '@/context/page.context';
import CardList from '@/components/CardList';

export const dynamic = 'force-dynamic';

const readHomeData = () => {
  return HomeService.getHomeDBData;
};

export default async function Home() {
  const homeData = readHomeData();
  const { dataSource = [], layout } = homeData;
  const { cardListStyle } = layout || {};

  return (
    <PageContextProvider>
      <main
        className={styles.main}
        style={{
          backgroundImage: `url(${layout?.head?.backgroundImage || ''})`,
        }}
      >
        <Head layout={layout} />
        <CardList dataSource={dataSource} cardListStyle={cardListStyle} />
      </main>
    </PageContextProvider>
  );
}
