import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, onAuthStateChanged as realOnAuthStateChanged, signOut as realSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const isPlaceholder = 
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'REPLACE_ME' ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'REPLACE_ME';

let app: any = {};
let auth: any = {};
let db: any = {};

if (!isPlaceholder) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence);
  }
  db = getFirestore(app);
}



export { app, auth, db };

export async function signInWithEmailAndPassword(firebaseAuth: any, email: string, password: string) {
  const expectedEmail = 'admin@taanga-taanga.com';
  const expectedPassword = 'taanga2024admin';

  if (isPlaceholder) {
    if (email === expectedEmail && password === expectedPassword) {
      return {
        user: {
          uid: 'mock-admin-uid',
          email,
          getIdToken: async () => 'mock-id-token',
        },
      };
    }
    const err: any = new Error('Invalid credentials');
    err.code = 'auth/invalid-credential';
    throw err;
  }
  const { signInWithEmailAndPassword: realSignIn } = await import('firebase/auth');
  return realSignIn(firebaseAuth, email, password);
}



export function onAuthStateChanged(firebaseAuth: any, callback: (user: any) => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const isMockSession = document.cookie.includes('mock-session-cookie');
  if (isPlaceholder || isMockSession) {
    const isLoggedIn = document.cookie.includes('tt_session');
    if (isLoggedIn) {
      callback({
        uid: 'mock-admin-uid',
        email: 'admin@taanga-taanga.com',
      } as any);
    } else {
      callback(null);
    }
    return () => {};
  }
  return realOnAuthStateChanged(firebaseAuth, callback);
}

export async function signOut(firebaseAuth: any) {
  if (isPlaceholder || typeof window === 'undefined') {
    return Promise.resolve();
  }
  return realSignOut(firebaseAuth);
}



