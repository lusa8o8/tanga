import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('languages').get();
    const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || typeof data.name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const docRef = await adminDb.collection('languages').add({ name: data.name });
    const doc = await docRef.get();
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 201 });
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
