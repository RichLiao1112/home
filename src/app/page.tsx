import styles from './page.module.css';
import HomeService from '@/services/home';
import Card from '@/components/Card';
import Head from '@/components/Head';
import { PageContextProvider } from '@/context/page.context';

const readHomeData = () => {
  const { homeDBData } = HomeService;
  return homeDBData;
};

export default async function Home() {
  const homeData = readHomeData();
  const { dataSource, head } = homeData;

  return (
    <PageContextProvider>
      <main className={styles.main}>
        <Head payload={head} />
        <div className={styles.flex}>
          {dataSource?.map((item, index) => {
            return <Card payload={item} index={index} key={index} />;
          })}
        </div>
      </main>
    </PageContextProvider>
  );
}
