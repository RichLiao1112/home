import { NextResponse } from 'next/server';

export async function GET() {
  const selfSetENV: Record<string, any> = {};
  Object.entries(process.env).forEach(([k, v]) => {
    if (k.startsWith('HH_')) {
      selfSetENV[k] = v;
    }
  });
  return NextResponse.json({
    message: '',
    success: true,
    data: selfSetENV,
  });
}
