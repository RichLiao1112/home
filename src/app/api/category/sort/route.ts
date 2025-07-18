import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICategory } from '@/services/home';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    const { mapping } = data; // { [key: string]: number }
    if (!data.key) throw new Error('缺少参数key');
    if (!data.mapping) throw new Error('缺少参数mapping');

    
    const categories: ICategory[] = JSON.parse(
      JSON.stringify(HomeService.getCategories(data.key) || [])
    );

    Object.entries(mapping).forEach(([id, position]) => {
      const category = categories.find((it) => it.id === id);
      if (category && (position || position === 0)) {
        category.position = position as number;
      }
    })
    

    HomeService.updateCategories(data.key, categories);
    const saveResult = HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      HomeService.getDBData()
    );

    const result = HomeService.getCategories(data.key).map(it => ({ id: it.id, position: it.position }))

    return NextResponse.json({
      data: result,
      success: saveResult.success,
      message: saveResult.message,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}