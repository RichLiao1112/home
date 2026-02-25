import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

// 简单的 token 验证
function verifyToken(token: string, password: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [pwd] = decoded.split(':');
    return pwd === password;
  } catch {
    return false;
  }
}

// 认证检查函数
export function checkAuth(request: NextRequest): { authorized: boolean; error?: NextResponse } {
  const authConfig = HomeService.getAuthConfig();

  // 如果未开启认证，直接通过
  if (!authConfig.enabled) {
    return { authorized: true };
  }

  // 获取 token
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return {
      authorized: false,
      error: NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      ),
    };
  }

  // 验证 token
  if (!verifyToken(token, authConfig.password)) {
    return {
      authorized: false,
      error: NextResponse.json(
        { success: false, message: '登录已过期，请重新登录' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}
