import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const booksCountSnapshot = await adminDb.collection('books').count().get();
    const authorsCountSnapshot = await adminDb.collection('authors').count().get();

    return NextResponse.json({
      totalBooks: booksCountSnapshot.data().count,
      totalAuthors: authorsCountSnapshot.data().count
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
