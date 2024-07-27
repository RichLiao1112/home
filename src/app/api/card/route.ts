import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICard } from '@/services/home';
import { genUUID } from '@/common';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    if (!data.key) throw new Error('缺少参数key');
    const categories = HomeService.getCategories(data.key);

    // 通过提交的类目id查找对应卡片列表
    const category =
      categories.find((it) => it.id === data.categoryId) || categories[0];
    const cards: ICard[] = JSON.parse(JSON.stringify(category?.cards || []));

    // 从该卡片列表内查找卡片下标
    const cardDTOIndex = cards.findIndex((it) => it.id === data.id);

    let dto: ICard = cards[cardDTOIndex] || {};
    if (!data.id) {
      // 新增
      dto = { ...data, id: genUUID() };
      cards.push(dto);
      category.cards = cards;
    } else {
      dto.id = data.id;
      dto.title = data.title ?? dto.title;
      dto.cover = data.cover ?? dto.cover;
      dto.wanLink = data.wanLink ?? dto.wanLink;
      dto.lanLink = data.lanLink ?? dto.lanLink;
      dto.autoSelectLink = data.autoSelectLink ?? dto.autoSelectLink;
      dto.openInNewWindow = data.openInNewWindow ?? dto.autoSelectLink;
      dto.coverColor = data.coverColor ?? dto.coverColor;

      if (cardDTOIndex === -1) {
        // 目标类目下无该卡片
        // 即卡片的类目需要变更为该类目

        // 从原类目中删除该卡片
        const sourceCategory = categories.find((category) => {
          const cards = category.cards || [];
          return cards.findIndex((it) => it.id === data.id) !== -1;
        });

        if (sourceCategory) {
          sourceCategory.cards = sourceCategory.cards?.filter(
            (it) => it.id !== data.id
          );
        }

        // 修改卡片类目id为新的类目id
        dto.categoryId = data.categoryId;
        cards.push(dto);
        category.cards = cards;
      }
    }

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

