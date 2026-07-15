import { adminDb } from "@/lib/firebase-admin";
import CatalogClient from "./CatalogClient";

export const revalidate = 3600; // ISR

async function getPublishedBooks() {
  const snapshot = await adminDb.collection('books').where('status', '==', 'published').get();
  return snapshot.docs.map((doc: any) => {
    const data = doc.data();
    // Remove non-serializable Firestore Timestamps before passing to Client Component
    delete data.createdAt;
    delete data.updatedAt;
    return { id: doc.id, ...data };
  });
}

export default async function CatalogPage() {
  const books = await getPublishedBooks();
  return <CatalogClient initialBooks={books} />;
}
