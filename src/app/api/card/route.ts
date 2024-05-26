import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';
import { message } from 'antd';

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { data } = body;
  try {
    const dto = await HomeService.upsertCard({
      title: data.title,
      cover: data.cover,
      wanLink: data.wanLink,
      lanLink: data.lanLink,
      autoSelectLink: data.autoSelectLink,
      openInNewWindow: data.openInNewWindow,
      id: data.id,
    });
    return NextResponse.json({ data: dto, success: true, message: '' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}
