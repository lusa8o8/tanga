import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

    let query: any = adminDb.collection('books');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    let books = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Apply client-side title search (Firestore doesn't support full-text search natively)
    if (search) {
      books = books.filter((b: any) => b.title?.toLowerCase().includes(search));
    }

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
