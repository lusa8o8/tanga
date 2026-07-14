import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('books').get();
    const books = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching admin books:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.title || typeof data.title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Auto-generate slug from title
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Denormalize author name if possible
    let authorName = '';
    if (data.authorId) {
      const authorDoc = await adminDb.collection('authors').doc(data.authorId.toString()).get();
      if (authorDoc.exists) {
        authorName = authorDoc.data()?.name || '';
      }
    }

    const payload = { ...data, slug, authorName, createdAt: new Date().toISOString() };
    const docRef = await adminDb.collection('books').add(payload);
    const doc = await docRef.get();
    
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
