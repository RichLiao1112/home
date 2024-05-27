import { NextRequest, NextResponse } from 'next/server';
import HomeService from '@/services/home';

type TParams = {
  id: string;
};

export async function DELETE(req: NextRequest, context: { params: TParams }) {
  try {
    const { id } = context.params;
    if (id) {
      HomeService.deleteCard(context.params.id);
      HomeService.save();
    }
    return NextResponse.json({ data: {}, success: true, message: '' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err });
  }
}
