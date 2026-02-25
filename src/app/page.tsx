import HomeService, { ICard, ICategory, IDBData } from '@/services/home';
import { PageContextProvider } from '@/context/page.context';
import { AuthContextProvider } from '@/context/AuthContext';
import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const Main = dynamicImport(() => import('@/components/Main'), { ssr: false });

const readHomeData = () => {
  const dbData = HomeService.getDBData();
  const env = HomeService.getHHEnv();
  const authConfig = HomeService.getAuthConfig();
  return {
    dbData,
    env,
    authConfig,
  };
};

export default async function Home() {
  const res = readHomeData();
  const { dbData, authConfig } = res;

  return (
    <AuthContextProvider>
      <PageContextProvider>
        <Main dbData={dbData} />
      </PageContextProvider>
    </AuthContextProvider>
  );
}
