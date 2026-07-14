import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    await adminDb.collection('authors').doc(id).update({ ...data, updatedAt: new Date().toISOString() });
    
    // Also denormalize author name on all their books if name changed
    if (data.name) {
      const booksSnapshot = await adminDb.collection('books').where('authorId', '==', id).get();
      const batch = adminDb.batch();
      booksSnapshot.forEach(doc => {
        batch.update(doc.ref, { authorName: data.name });
      });
      await batch.commit();
    }
    
    const doc = await adminDb.collection('authors').doc(id).get();
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Check if author has books
    const booksSnapshot = await adminDb.collection('books').where('authorId', '==', id).get();
    if (!booksSnapshot.empty) {
      return NextResponse.json({ error: 'Cannot delete author with associated books' }, { status: 400 });
    }
    
    await adminDb.collection('authors').doc(id).delete();
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
