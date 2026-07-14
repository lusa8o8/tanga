import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

async function configureCors() {
  const bucket = getStorage().bucket();

  const corsConfiguration = [
    {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.43.94:3000'],
      method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      responseHeader: ['Content-Type', 'Authorization', 'x-goog-meta-*', 'x-firebase-storage-version'],
      maxAgeSeconds: 3600,
    },
  ];

  try {
    console.log(`Setting CORS for bucket: ${bucket.name}`);
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('✅ CORS configuration successfully updated!');
  } catch (error) {
    console.error('❌ Failed to update CORS configuration:', error);
  }
}

configureCors();
