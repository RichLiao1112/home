import styles from './page.module.css';
import HomeService from '@/services/home';
import Head from '@/components/Head';
import { PageContextProvider } from '@/context/page.context';
import CardList from '@/components/CardList';

export const dynamic = 'force-dynamic';

const readHomeData = () => {
  const configKey = HomeService.getSelectedKey();
  const dbData = HomeService.getDBData();
  return {
    dbData,
    configKey,
  };
};

export default async function Home() {
  const res = readHomeData();
  const { configKey, dbData } = res;
  const { dataSource = [], layout } = dbData?.[configKey] || {};
  const { cardListStyle } = layout || {};

  return (
    <PageContextProvider>
      <main
        className={styles.main}
        style={{
          backgroundImage: `url(${layout?.head?.backgroundImage || ''})`,
        }}
      >
        <Head layout={layout} configKey={configKey} />
        <CardList
          dataSource={dataSource}
          cardListStyle={cardListStyle}
          configKey={configKey}
        />
      </main>
    </PageContextProvider>
  );
}
