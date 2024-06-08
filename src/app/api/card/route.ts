import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICard } from '@/services/home';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    if (!data.key) throw new Error('缺少参数key');
    const cards: ICard[] = JSON.parse(
      JSON.stringify(HomeService.getCards() || [])
    );
    const cardDTOIndex = cards.findIndex((it) => it.id === data.id);
    let dto: ICard;
    if (data.id && cardDTOIndex >= 0) {
      dto = cards[cardDTOIndex];
      dto.title = data.title ?? dto.title;
      dto.cover = data.cover ?? dto.cover;
      dto.wanLink = data.wanLink ?? dto.wanLink;
      dto.lanLink = data.lanLink ?? dto.lanLink;
      dto.autoSelectLink = data.autoSelectLink ?? dto.autoSelectLink;
      dto.openInNewWindow = data.openInNewWindow ?? dto.autoSelectLink;
      dto.coverColor = data.coverColor ?? dto.coverColor;
    } else {
      dto = { ...data, id: `${cards.length}` };
      cards.push(dto);
    }

    HomeService.updateCards(data.key, cards);
    await HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      HomeService.getDBData()
    );

    return NextResponse.json({ data: dto, success: true, message: '' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
