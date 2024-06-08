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
    if (!key) throw new Error('缺少参数key');
    if (id) {
      const cards: ICard[] = JSON.parse(
        JSON.stringify(HomeService.getCards() || [])
      );
      const result = cards.filter((it) => String(it.id) !== String(id));

      result.forEach((item, index) => {
        item.id = `${index}`;
        return item;
      });
      HomeService.updateCards(key, result);

      const dbData = HomeService.getDBData();
      console.log(dbData);
      await HomeService.writeDBFile(HomeService.getDefaultDBPath(), dbData);
    }
    return NextResponse.json({ data: {}, success: true, message: '' });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ success: false, message: err?.message });
  }
}
