import { NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function GET() {
  const selfSetENV: Record<string, any> = HomeService.getHHEnv();
  const authConfig = HomeService.getAuthConfig();
  console.log('[env] HH_AUTH_ENABLED env:', process.env.HH_AUTH_ENABLED);
  console.log('[env] selfSetENV:', selfSetENV);
  console.log('[env] authConfig:', authConfig);
  // 将认证配置添加到返回数据中，但不返回明文密码
  return NextResponse.json({
    message: '',
    success: true,
    data: {
      ...selfSetENV,
      HH_AUTH_ENABLED: authConfig.enabled,
    },
  });
}
