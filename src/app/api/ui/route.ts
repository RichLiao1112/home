import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = body;
  try {
    if (!data.key) throw new Error('缺少参数key');
    const layout = HomeService.getLayout();
    const cardListStyle = JSON.parse(
      JSON.stringify(layout.cardListStyle || {})
    );
    const head = JSON.parse(JSON.stringify(layout.head || {}));
    if (data.cardListStyle) {
      cardListStyle.justifyContent =
        data.cardListStyle.justifyContent ?? cardListStyle.justifyContent;
      cardListStyle.alignItems =
        data.cardListStyle.alignItems ?? cardListStyle.alignItems;
      cardListStyle.alignContent =
        data.cardListStyle.alignContent ?? cardListStyle.alignContent;
    }
    HomeService.updateLayout(data.key, {
      ...layout,
      cardListStyle,
      head: { ...head, ...(data.head || {}) },
    });

    const dbData = HomeService.getDBData();
    const saveResult = HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      dbData
    );

    return NextResponse.json({
      data: dbData,
      success: saveResult.success,
      message: saveResult.message,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
