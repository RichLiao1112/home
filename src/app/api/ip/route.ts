import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for');
    const realIp = ip ? ip.split(',')[0].replace(/^.*:/, '') : null; // 处理可能的多个 IP 地址

    return NextResponse.json({
      data: realIp,
      success: true,
      message: '',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = body;
  try {
    if (!data.domain) throw new Error('缺少参数domain');

    // 请求 http://ip-api.com/json 查询真实 IP
    const response = await fetch(`http://ip-api.com/json/${data.domain}`);
    const ipData = await response.json();
    console.log('[ipData]', ipData)
    const realIp = ipData.query; // 提取真实 IP
    return NextResponse.json({
      data: realIp,
      success: true,
      message: '查询成功',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message });
  }
}