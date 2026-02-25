import { NextResponse } from 'next/server';
import HomeService from '@/services/home';

// 生成简单的会话 token
function generateToken(password: string): string {
  const timestamp = Date.now();
  const payload = `${password}:${timestamp}`;
  // 使用 base64 编码作为简单 token
  return Buffer.from(payload).toString('base64');
}

// 验证 token
function verifyToken(token: string, password: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [pwd] = decoded.split(':');
    return pwd === password;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const authConfig = HomeService.getAuthConfig();

  // 如果未开启认证，直接返回失败
  if (!authConfig.enabled) {
    return NextResponse.json({
      success: false,
      message: '登录功能未开启',
    }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({
        success: false,
        message: '请输入密码',
      }, { status: 400 });
    }

    // 验证密码
    if (password !== authConfig.password) {
      return NextResponse.json({
        success: false,
        message: '密码错误',
      }, { status: 401 });
    }

    // 生成 token
    const token = generateToken(authConfig.password);

    const response = NextResponse.json({
      success: true,
      message: '登录成功',
    });

    // 将 token 存入 cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '登录失败',
    }, { status: 500 });
  }
}
