import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

export async function GET() {
  try {
    return NextResponse.json({
      data: {
        all: HomeService.queryConfigKeys(),
      },
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    const { key } = data;

    const allConfigKeys = HomeService.queryConfigKeys();
    if (!key) throw new Error('请命名');
    if (allConfigKeys.find((it) => it === key)) {
      throw new Error('命名重复');
    }
    HomeService.updateDBData(key, { dataSource: [], layout: {} });

    const saveResult = HomeService.writeDBFile(
      HomeService.getDefaultDBPath(),
      HomeService.getDBData()
    );
    return NextResponse.json({
      data: key,
      success: saveResult.success,
      message: saveResult.message,
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ success: false, message: err?.message });
  }
}

export type TParams = {
  key: string;
};

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    const { key } = data;
    if (!key) {
      return NextResponse.json({ success: false, message: '配置不存在' });
    }
    HomeService.updateDBData(key, null);
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
    return NextResponse.json({ success: false, message: err?.message });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { data } = body;
//     const { key } = data;
//     HomeService.setSelectedKey(key);
//     return NextResponse.json({ data: key, success: true, message: '' });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err?.message });
//   }
// }
