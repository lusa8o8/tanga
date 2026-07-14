import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

const auth = getAuth();
const db = getFirestore();

async function seed() {
  console.log('Starting Firebase Seeding...');

  // 1. Seed Admin User
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@taanga-taanga.com';
  const password = process.env.ADMIN_SEED_PASSWORD || 'taanga2024admin';
  let adminUid = '';

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true
    });
    adminUid = userRecord.uid;
    console.log('Successfully created new admin user:', adminUid);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      const userRecord = await auth.getUserByEmail(email);
      adminUid = userRecord.uid;
      console.log('Admin user already exists with UID:', adminUid);
    } else {
      console.error('Error creating admin user:', error.message);
    }
  }

  // 2. Seed Authors
  console.log('Checking authors collection...');
  const authorsSnapshot = await db.collection('authors').get();
  let author1Id = 'author-1';
  let author2Id = 'author-2';

  if (authorsSnapshot.empty) {
    console.log('Seeding default authors...');
    const author1Ref = db.collection('authors').doc(author1Id);
    await author1Ref.set({
      name: 'Collen Mululu',
      slug: 'collen-mululu',
      bio: 'A prominent Zambian local-language writer focusing on Tonga oral traditions.',
      photoUrl: '',
      createdAt: new Date().toISOString()
    });

    const author2Ref = db.collection('authors').doc(author2Id);
    await author2Ref.set({
      name: 'Gaston Kaji',
      slug: 'gaston-kaji',
      bio: 'Expert linguist and writer of Kiikaonde grammar references.',
      photoUrl: '',
      createdAt: new Date().toISOString()
    });
    console.log('Authors seeded successfully.');
  } else {
    console.log('Authors already exist.');
    author1Id = authorsSnapshot.docs.find(d => d.data().slug === 'collen-mululu')?.id || author1Id;
    author2Id = authorsSnapshot.docs.find(d => d.data().slug === 'gaston-kaji')?.id || author2Id;
  }

  // 3. Seed Books
  console.log('Checking books collection...');
  const booksSnapshot = await db.collection('books').get();
  if (booksSnapshot.empty) {
    console.log('Seeding default books...');
    await db.collection('books').doc('book-1').set({
      title: 'Tonga Folktales',
      slug: 'tonga-folktales',
      authorId: author1Id,
      authorName: 'Collen Mululu',
      language: 'Tonga / Chitonga',
      category: 'Folktales & Oral Tradition',
      synopsis: 'A collection of traditional Tonga stories passed down through generations.',
      contextBlurb: 'Oral storytelling preserved in Zambian print.',
      series: '',
      seriesNumber: '',
      format: 'Paperback',
      pageCount: 120,
      publicationDate: '2024-03-15',
      isbn: '978-9982-123-45-6',
      status: 'published',
      featured: true,
      coverImageUrl: '',
      createdAt: new Date().toISOString()
    });

    await db.collection('books').doc('book-2').set({
      title: 'Kiikaonde Grammar Guide',
      slug: 'kiikaonde-grammar-guide',
      authorId: author2Id,
      authorName: 'Gaston Kaji',
      language: 'Kiikaonde',
      category: 'Grammar & Language Reference',
      synopsis: 'The complete reference manual for learning and writing in Kiikaonde.',
      contextBlurb: 'Supporting Kaonde language literacy and preservation.',
      series: '',
      seriesNumber: '',
      format: 'Paperback',
      pageCount: 180,
      publicationDate: '2024-05-20',
      isbn: '978-9982-654-32-1',
      status: 'published',
      featured: true,
      coverImageUrl: '',
      createdAt: new Date().toISOString()
    });
    console.log('Books seeded successfully.');
  } else {
    console.log('Books already exist.');
  }

  // 4. Seed Languages
  console.log('Checking languages collection...');
  const languagesSnapshot = await db.collection('languages').get();
  if (languagesSnapshot.empty) {
    console.log('Seeding default languages...');
    await db.collection('languages').doc('lang-1').set({ name: 'Kiikaonde' });
    await db.collection('languages').doc('lang-2').set({ name: 'Tonga / Chitonga' });
    console.log('Languages seeded successfully.');
  } else {
    console.log('Languages already exist.');
  }

  // 5. Seed Categories
  console.log('Checking categories collection...');
  const categoriesSnapshot = await db.collection('categories').get();
  if (categoriesSnapshot.empty) {
    console.log('Seeding default categories...');
    await db.collection('categories').doc('cat-1').set({ name: 'Grammar & Language Reference' });
    await db.collection('categories').doc('cat-2').set({ name: 'Folktales & Oral Tradition' });
    await db.collection('categories').doc('cat-3').set({ name: 'Readers & Learning Series' });
    await db.collection('categories').doc('cat-4').set({ name: 'Cultural & Historical Nonfiction' });
    await db.collection('categories').doc('cat-5').set({ name: "Children's Illustrated" });
    console.log('Categories seeded successfully.');
  } else {
    console.log('Categories already exist.');
  }

  console.log('Firebase Seeding Completed.');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
