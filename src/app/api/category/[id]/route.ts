import { NextRequest, NextResponse } from 'next/server';
import HomeService, { ICategory } from '@/services/home';
import { checkAuth } from '@/common/auth';

type TParams = {
  id: string;
};

export async function DELETE(req: NextRequest, context: { params: TParams }) {
  // 认证检查
  const auth = checkAuth(req);
  if (!auth.authorized) {
    return auth.error!;
  }
  try {
    const { id } = context.params;
    const query = new URLSearchParams(req.url.split('?')[1] || '');
    const key = query.get('key');
    if (!key) throw new Error('缺少key');
    if (!id) throw new Error('缺少id');
    const categories: ICategory[] = HomeService.getCategories(key) || [];
    const category = categories.find((it) => it.id === id);
    if (!category) throw new Error('类目不存在或已删除');
    if (category.cards && category.cards.length > 0) {
      throw new Error('类目下存在应用，须先清空应用');
    }
    const result = categories.filter((it) => String(it.id) !== String(id));

    HomeService.updateCategories(key, result);
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
