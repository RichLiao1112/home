import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { data } = body;
  try {
    const dto = await HomeService.updateHead({
      name: data.name,
      logo: data.logo,
    });
    return NextResponse.json({ data: dto, success: true, message: '' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}
