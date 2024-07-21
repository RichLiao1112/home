import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICard } from '@/services/home';
import { genUUID } from '@/common';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    if (!data.key) throw new Error('缺少参数key');
    const categories = HomeService.getCategories(data.key);
    const category =
      categories.find((it) => it.id === data.categoryId) || categories[0];
    const cards: ICard[] = JSON.parse(JSON.stringify(category?.cards || []));
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
      dto.categoryId = data.categoryId ?? dto.categoryId;
    } else {
      dto = { ...data, id: genUUID() };
      cards.push(dto);
    }
    category.cards = cards;

    HomeService.updateCategories(data.key, categories);
    const saveResult = HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      HomeService.getDBData()
    );

    return NextResponse.json({
      data: dto,
      success: saveResult.success,
      message: saveResult.message,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}
