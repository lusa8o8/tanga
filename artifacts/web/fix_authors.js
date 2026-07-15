const admin = require('firebase-admin');
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

admin.initializeApp({ projectId: 'demo-tanga' });
const db = admin.firestore();

async function fixAuthors() {
  const snapshot = await db.collection('authors').limit(4).get();
  for (const doc of snapshot.docs) {
    await doc.ref.update({ featured: true });
    console.log(Updated author  to featured);
  }
}

fixAuthors().then(() => console.log('Done')).catch(console.error);
