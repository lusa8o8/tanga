import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('authors').get();
    const authors = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Fetch all books once and count per author (cheaper than N queries)
    const booksSnapshot = await adminDb.collection('books').get();
    const bookCountMap: Record<string, number> = {};
    booksSnapshot.docs.forEach((doc: any) => {
      const authorId = doc.data().authorId;
      if (authorId) {
        bookCountMap[authorId] = (bookCountMap[authorId] ?? 0) + 1;
      }
    });

    const authorsWithCount = authors.map((author: any) => ({
      ...author,
      bookCount: bookCountMap[author.id] ?? 0,
    }));

    return NextResponse.json(authorsWithCount);
  } catch (error) {
    console.error('Error fetching admin authors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Auto-generate slug from name
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const docRef = await adminDb.collection('authors').add({ ...data, slug, createdAt: new Date().toISOString() });
    const doc = await docRef.get();
    
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
