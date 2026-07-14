import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const bucket = adminStorage.bucket(bucketName);
    
    const corsConfiguration = [
      {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.43.94:3000'],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        responseHeader: ['Content-Type', 'Authorization', 'x-goog-meta-*', 'x-firebase-storage-version'],
        maxAgeSeconds: 3600,
      },
    ];

    await bucket.setCorsConfiguration(corsConfiguration);
    return NextResponse.json({ success: true, message: 'CORS configured' });
  } catch (error: any) {
    console.error('Failed to update CORS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
