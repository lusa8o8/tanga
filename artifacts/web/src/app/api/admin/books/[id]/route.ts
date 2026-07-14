import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Denormalize author name if authorId is being updated
    if (data.authorId) {
      const authorDoc = await adminDb.collection('authors').doc(data.authorId.toString()).get();
      if (authorDoc.exists) {
        data.authorName = authorDoc.data()?.name || '';
      }
    }

    await adminDb.collection('books').doc(id).update({ ...data, updatedAt: new Date().toISOString() });
    
    const doc = await adminDb.collection('books').doc(id).get();
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await adminDb.collection('books').doc(id).delete();
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
