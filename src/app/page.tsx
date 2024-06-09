import HomeService from '@/services/home';
import { PageContextProvider } from '@/context/page.context';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const Main = dynamicImport(() => import('@/components/Main'), { ssr: false });

const readHomeData = () => {
  const dbData = HomeService.getDBData();
  return {
    dbData,
  };
};

export default async function Home() {
  const res = readHomeData();
  const { dbData } = res;

  return (
    <PageContextProvider>
      <Main dbData={dbData} />
    </PageContextProvider>
  );
}
