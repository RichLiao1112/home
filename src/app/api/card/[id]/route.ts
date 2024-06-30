import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICard } from '@/services/home';

type TParams = {
  id: string;
};

export async function DELETE(req: NextRequest, context: { params: TParams }) {
  try {
    const { id } = context.params;
    const query = new URLSearchParams(req.url.split('?')[1] || '');
    const key = query.get('key');
    if (!key) throw new Error('缺少key');
    if (!id) throw new Error('缺少id');
    const cards: ICard[] = JSON.parse(
      JSON.stringify(HomeService.getCards(key) || [])
    );
    const result = cards.filter((it) => String(it.id) !== String(id));

    HomeService.updateCards(key, result);
    const saveResult = HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      HomeService.getDBData()
    );
    return NextResponse.json({
      data: {},
      success: saveResult.success,
      message: saveResult.message,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ success: false, message: err?.message });
  }
}

export async function PUT(req: NextRequest, context: { params: TParams }) {
  try {
    const { id } = context.params;
    const query = new URLSearchParams(req.url.split('?')[1] || '');
    const key = query.get('key');
    const targetIndex = query.get('index');
    if (!targetIndex) throw new Error('缺少index');
    if (Number(targetIndex) < 0) throw Error('index需大于等于0');
    if (!key) throw new Error('缺少key');
    if (!id) throw new Error('缺少id');
    const cards: ICard[] = JSON.parse(
      JSON.stringify(HomeService.getCards(key) || [])
    );
    const currentIndex = cards.findIndex((it) => it.id === id);
    const card = cards[currentIndex];

    // 新位子插入数据
    cards.splice(Number(targetIndex), 0, card);
    // 删除原位子数据
    const result = cards.filter((it, i) => {
      if (i === Number(targetIndex)) {
        return true;
      }
      return it.id !== id;
    });
    HomeService.updateCards(key, result);
    const saveResult = HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      HomeService.getDBData()
    );
    return NextResponse.json({
      data: {},
      success: saveResult.success,
      message: saveResult.message,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ success: false, message: err?.message });
  }
}
