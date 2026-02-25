import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';
import { checkAuth } from '@/common/auth';

export async function GET(req: NextRequest) {
  // 认证检查
  const auth = checkAuth(req);
  if (!auth.authorized) {
    return auth.error!;
  }

  try {
    const dbData = HomeService.getDBData();
    return NextResponse.json({
      data: dbData,
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
