import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = body;
  try {
    if (data.cardListStyle) {
      HomeService.updateCardListStyle(data.cardListStyle);
    }
    if (data.head) {
      HomeService.updateHead(data.head);
    }

    HomeService.save();

    return NextResponse.json({
      data: HomeService.homeDBData,
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
