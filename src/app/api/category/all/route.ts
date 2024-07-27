import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICategory } from '@/services/home';

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
