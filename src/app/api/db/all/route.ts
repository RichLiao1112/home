import { NextRequest, NextResponse } from 'next/server';
import HomeService, { IDBData } from '@/services/home';
import { readFileSync } from 'fs';

export async function GET(req: NextRequest) {
  try {
    const data = readFileSync(HomeService.getDefaultDBPath(), {
      encoding: 'utf-8',
    });
    const parseData: IDBData = JSON.parse(data || '{}');
    return NextResponse.json({
      data: parseData,
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
