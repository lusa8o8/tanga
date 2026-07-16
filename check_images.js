const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function checkImages() {
  const booksSnapshot = await db.collection('books').get();
  booksSnapshot.forEach(doc => {
    console.log(doc.id, doc.data().title, doc.data().coverImageUrl);
  });
}

checkImages();
