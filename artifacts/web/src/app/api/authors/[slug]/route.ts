import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const snapshot = await adminDb.collection('authors')
      .where('slug', '==', slug)
      .limit(1)
      .get();
      
    if (snapshot.empty) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    
    const doc = snapshot.docs[0];
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
