import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';
import { defaultDBFile } from '@/common';

export async function GET() {
  try {
    // const customDBFiles = HomeService.customDBFiles;
    const customDBFiles = await HomeService.queryDBFiles(
      HomeService.customDBDir,
      'db'
    );
    return NextResponse.json({
      data: {
        db: HomeService.currentDBFile,
        all: [defaultDBFile, ...customDBFiles],
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
    const filename = `${data.filename}.json`;
    if (
      filename === defaultDBFile.filename ||
      HomeService.customDBFiles.find((file) => file?.filename === filename)
    ) {
      return NextResponse.json({
        success: false,
        data: null,
        message: '文件名重复',
      });
    }
    await HomeService.upsertDBFile(filename);
    return NextResponse.json({
      data: data.filename,
      success: true,
      message: '',
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ success: false, message: err?.message });
  }
}

export type TParams = {
  filename: string;
};

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    const { filename } = data;
    if (!filename) {
      return NextResponse.json({ success: false, message: '文件不存在' });
    }
    await HomeService.deleteDBFile(filename);

    return NextResponse.json({ data: {}, success: true, message: '' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    const { filename, basePath, type } = data;
    await HomeService.selectCustomDBFile(filename, basePath, type);
    return NextResponse.json({ data: {}, success: true, message: '' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}
