import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@taanga-taanga.com';
  const password = process.env.ADMIN_PASSWORD || 'taanga2024admin';
  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
      emailVerified: true
    });
    console.log('Successfully created new admin user:', userRecord.uid);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('Admin user already exists.');
    } else {
      console.error('Error creating new user:', error.message);
    }
  }
}

seed();
