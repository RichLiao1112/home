import { NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function GET() {
  const authConfig = HomeService.getAuthConfig();

  // 返回认证是否开启
  return NextResponse.json({
    success: true,
    data: {
      enabled: authConfig.enabled,
    },
  });
}
