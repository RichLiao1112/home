import { NextRequest, NextResponse } from 'next/server';
import UnsplashService from '@/services/unsplash';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = body;
  const unsplashInstance = UnsplashService.unsplashInstance;
  console.log('[body.collectionId]', data.collectionId);
  const photos = await unsplashInstance.collections.getPhotos({
    collectionId: data.collectionId,
    page: 1,
    perPage: 100,
  });
  return NextResponse.json(photos);
}

export async function GET() {
  const unsplashInstance = UnsplashService.unsplashInstance;
  const collections = await unsplashInstance.collections.list({
    page: 1,
    perPage: 10,
  });
  return NextResponse.json(collections);
}
