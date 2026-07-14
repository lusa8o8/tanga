import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { MockAdminAuth, MockDbImpl, MockAdminStorage } from './mock-db';

const isPlaceholder = 
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'REPLACE_ME' ||
  !(process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL) ||
  (process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL) === 'REPLACE_ME';

let adminAuth: any;
let adminDb: any;
let adminStorage: any;

if (isPlaceholder) {
  adminAuth = new MockAdminAuth();
  adminDb = new MockDbImpl();
  adminStorage = new MockAdminStorage();
} else {
  if (!getApps().length) {
    try {
      let rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
      if (rawKey) {
        // Handle common copy-paste issues: surrounding quotes and literal \n strings
        rawKey = rawKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      }

      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: rawKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      
      adminAuth = getAuth();
      adminDb = getFirestore();
      adminStorage = getStorage();
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      // Fallback to mock so the app doesn't crash the server component render
      adminAuth = new MockAdminAuth();
      adminDb = new MockDbImpl();
      adminStorage = new MockAdminStorage();
    }
  } else {
    adminAuth = getAuth();
    adminDb = getFirestore();
    adminStorage = getStorage();
  }
}

export { adminAuth, adminDb, adminStorage };

