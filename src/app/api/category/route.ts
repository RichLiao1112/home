import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICategory } from '@/services/home';
import { genUUID } from '@/common';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    if (!data.key) throw new Error('缺少参数key');
    const categories: ICategory[] = JSON.parse(
      JSON.stringify(HomeService.getCategories(data.key) || [])
    );
    const index = categories.findIndex((it) => it.id === data.id);
    let dto: ICategory;
    if (data.id && index >= 0) {
      dto = categories[index];
      dto.title = data.title ?? dto.title;
      dto.id = data.id ?? dto.id;
      dto.style = data.style ?? dto.style;
    } else {
      dto = { ...data, id: genUUID() };
      categories.push(dto);
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

export async function GET(req: NextRequest) {
  try {
    const dbData = HomeService.getDBData();
    const categories: Record<string, Array<Omit<ICategory, 'cards'>>> = {};
    Object.entries(dbData).forEach(([k, v]) => {
      categories[k] = v.categories.map((it) => {
        const { cards, ...info } = it;
        return info;
      });
    });
    return NextResponse.json({
      data: categories,
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}

