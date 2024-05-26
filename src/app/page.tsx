import styles from './page.module.css';
import { HomeService } from '@/services/home';
import Card from '@/components/Card';
import Head from '@/components/Head';
import { PageContextProvider } from '@/context/page.context';

const readHomeData = () => {
  return new HomeService().readDBFile();
};

export default async function Home() {
  const homeData = await readHomeData();
  const { data } = homeData;
  const { dataSource, head } = data || {};

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
