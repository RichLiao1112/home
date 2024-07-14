import { NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function GET() {
  const selfSetENV: Record<string, any> = HomeService.getHHEnv();
  return NextResponse.json({
    message: '',
    success: true,
    data: selfSetENV,
  });
}
