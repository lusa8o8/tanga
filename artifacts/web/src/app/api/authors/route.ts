import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('authors').get();
    // In a more complex app, we might filter authors to only those with published books.
    // For now, we return all authors as per original API.
    const authors = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching public authors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
