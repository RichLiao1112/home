import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import HomeService from '@/services/home';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// type Props = {
//   params: { id: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export function generateMetadata(): Metadata {
  const head = HomeService.homeDBData.layout?.head || {};
  return {
    title: head.name,
    description: head.name,
    icons: {
      icon: head.logo,
      shortcut: head.logo,
      apple: head.logo,
    },
  };
}
export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Also supported by less commonly used
    // interactiveWidget: 'resizes-visual',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
