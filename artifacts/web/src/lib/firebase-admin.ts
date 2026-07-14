import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const isPlaceholder = 
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'REPLACE_ME' ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  process.env.FIREBASE_CLIENT_EMAIL === 'REPLACE_ME';

let adminAuth: any;
let adminDb: any;
let adminStorage: any;

if (isPlaceholder) {
  const { MockAdminAuth, MockDbImpl, MockAdminStorage } = require('./mock-db');
  adminAuth = new MockAdminAuth();
  adminDb = new MockDbImpl();
  adminStorage = new MockAdminStorage();
} else {
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
    }
  }
  adminAuth = getAuth();
  adminDb = getFirestore();
  adminStorage = getStorage();
}

export { adminAuth, adminDb, adminStorage };

