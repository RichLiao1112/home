import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICard } from '@/services/home';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    const dto = await HomeService.upsertCard(data);
    return NextResponse.json({ data: dto, success: true, message: '' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}
