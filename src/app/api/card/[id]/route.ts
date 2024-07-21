import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICard, ICategory } from '@/services/home';

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

    const category = HomeService.getCategoryFromCardId(id, key);
    if (!category) {
      throw new Error('无法找到该卡片所在类目');
    }

    const cards: ICard[] = JSON.parse(JSON.stringify(category?.cards || []));
    const result = cards.filter((it) => String(it.id) !== String(id));

    category.cards = result;
    const categories = HomeService.getCategories(key);
    categories.some((it) => {
      if (it.id === category.id) {
        it = category;
        return true;
      }
      return false;
    });

    HomeService.updateCategories(key, categories);

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
    const categoryId = query.get('categoryId');
    if (!targetIndex) throw new Error('缺少index');
    if (Number(targetIndex) < 0) throw Error('index需大于等于0');
    if (!key) throw new Error('缺少key');
    if (!id) throw new Error('缺少id');
    // 当前key下的卡片的信息
    const categories = HomeService.getCategories(key);
    let currentCard: ICard | undefined;
    let currentIndex = -1;
    let currentCategory: ICategory | undefined;
    categories.some((category) => {
      const cards = category.cards || [];
      currentIndex = cards.findIndex((it) => it.id === id);
      if (currentIndex !== -1) {
        currentCard = cards[currentIndex];
        currentCategory = category;
        return true;
      }
      return false;
    });
    if (!currentCard) {
      throw new Error('待移动的卡片不存在');
    }
    if (!currentCategory) {
      throw new Error('卡片原类目不存在');
    }

    // 所有key下的类目中的卡片
    // const configCards = HomeService.getCategoryCards(key, );
    // const categoryCards: Array<ICategory & { cards?: ICard[] }> = JSON.parse(
    //   JSON.stringify(configCards || [])
    // );

    const targetCategory = categories.find((it) => it.id === categoryId);
    // 目标类目的卡片列表
    const targetCards = targetCategory?.cards || [];
    if (!targetCategory) {
      throw new Error('目标分类已被删除');
    }

    // currentIndex = targetCards.findIndex((it) => it.id === currentCard?.id);
    // const card = targetCards[currentIndex];
    // 新位子插入数据
    targetCards.splice(Number(targetIndex), 0, currentCard);

    // 当前卡片和移动目的位子是同一个类目
    if (currentCard.categoryId === categoryId) {
      // 删除原位子数据
      const result = targetCards.filter((it, i) => {
        if (i === Number(targetIndex)) {
          return true;
        }
        return it.id !== id;
      });
      targetCategory.cards = result;
    } else {
      // 当前卡片和移动目的位子不在同一个类目
      // 修改卡片类目
      currentCard.categoryId = targetCategory.id;
      const sourceCategoryCards = targetCategory.cards || [];
      // 删除原位子数据
      const result = sourceCategoryCards.filter((it, i) => {
        if (i === Number(currentIndex)) {
          return true;
        }
        return it.id !== id;
      });
      targetCategory.cards = result;
    }

    HomeService.updateCategories(key, categories);
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
