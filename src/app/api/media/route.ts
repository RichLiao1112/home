import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'url';
import MediaService from '@/services/media';

export async function GET(req: NextRequest) {
  const { query } = parse(req.url || '', true);
  try {
    const res = MediaService.queryMedia({ q: query.q as string });
    return NextResponse.json({
      data: res,
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
