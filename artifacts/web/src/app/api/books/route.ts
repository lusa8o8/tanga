import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Only return published books (fixes draft leakage)
    const snapshot = await adminDb.collection('books').where('status', '==', 'published').get();
    const books = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching public books:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
