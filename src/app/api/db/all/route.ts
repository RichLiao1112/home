import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      data: HomeService.getDBData(),
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
