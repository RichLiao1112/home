import { NextRequest, NextResponse } from 'next/server';
import MediaService from '@/services/media';
import { writeFile } from 'fs/promises';
import path from 'path';
import { allowedMimeTypes, maxFileSize, maxFileSizeMB } from '@/common';

const HH_ALLOW_UPLOAD_IMAGE = process.env.HH_ALLOW_UPLOAD_IMAGE;

export async function POST(req: NextRequest) {
  // if (HH_ALLOW_UPLOAD_IMAGE !== 'yes') {
  //   return NextResponse.json(
  //     {
  //       message: `不支持的请求`,
  //       success: false,
  //       data: {},
  //     },
  //     { status: 400 }
  //   );
  // }
  const formData = await req.formData();
  const file: any = formData.get('file');
  if (!file) {
    return NextResponse.json(
      { message: '请重新选择图片', success: false, data: {} },
      { status: 400 }
    );
  }
  if (!allowedMimeTypes.includes(file.type)) {
    return NextResponse.json(
      {
        message: `仅支持${allowedMimeTypes.join('、')}格式`,
        success: false,
        data: {},
      },
      { status: 400 }
    );
  }
  if (file.size > maxFileSize) {
    return NextResponse.json(
      {
        message: `图片太大了，需要小于${maxFileSizeMB}MB`,
        success: false,
        data: {},
      },
      { status: 400 }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + '_' + file.name.replaceAll(' ', '_');
  try {
    const assetPath = path.join(MediaService.mediaAssetsPath, filename);
    await writeFile(assetPath, buffer);
    MediaService.scanAssetsMedia();
    return NextResponse.json({
      message: '',
      success: true,
      data: {
        filename,
        link: `${MediaService.mediaAssetsPathRead}${filename}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message, success: false });
  }
}