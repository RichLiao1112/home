import HomeService, { ICard, ICategory, IDBData } from '@/services/home';
import { PageContextProvider } from '@/context/page.context';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const Main = dynamicImport(() => import('@/components/Main'), { ssr: false });

const readHomeData = () => {
  const dbData = HomeService.getDBData();
  const env = HomeService.getHHEnv();
  return {
    dbData,
    env,
  };
};

export default async function Home() {
  const res = readHomeData();
  const { dbData, env } = res;

  return (
    <PageContextProvider>
      <Main dbData={dbData} env={env} />
    </PageContextProvider>
  );
}
