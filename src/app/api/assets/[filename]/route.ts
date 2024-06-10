import { NextRequest } from 'next/server';
import { Readable } from 'stream';
import MediaService from '@/services/media';
import { createReadStream, existsSync, statSync } from 'fs';
import mime from 'mime-types'; // 使用 mime-types 库来自动检测文件的 MIME 类型
import path from 'path';

export interface TParams {
  filename: string;
}

// 将 Node.js 的 ReadStream 转换为 Web 标准的 ReadableStream
function streamToWebReadable(stream: Readable) {
  // 使用 ReadableStream 构造函数手动转换
  return new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      stream.on('end', () => {
        controller.close();
      });
      stream.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      stream.destroy();
    },
  });
}

export async function GET(req: NextRequest, context: { params: TParams }) {
  const { filename } = context.params;

  const filePath = path.join(MediaService.mediaCustomPath, filename);
  if (existsSync(filePath)) {
    const fileStream = createReadStream(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    const stat = statSync(filePath);
    // 将文件流转换为 Web ReadableStream
    const webReadableStream = streamToWebReadable(fileStream);
    const response = new Response(webReadableStream, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stat.size.toString(),
      },
    });
    return response;
  } else {
    return new Response(
      JSON.stringify({ message: 'File not found', success: false }),
      { status: 404 }
    );
  }
}
