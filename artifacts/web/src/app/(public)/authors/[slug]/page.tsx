import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // ISR

export default async function AuthorDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  
  const snapshot = await adminDb.collection('authors')
    .where('slug', '==', slug)
    .limit(1)
    .get();
    
  if (snapshot.empty) {
    notFound();
  }
  
  const authorDoc = snapshot.docs[0];
  const author = { id: authorDoc.id, ...authorDoc.data() } as any;

  // Fetch Author's Books
  const booksSnapshot = await adminDb.collection('books')
    .where('authorId', '==', author.id)
    .where('status', '==', 'published')
    .get();
    
  const authorBooks = booksSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any[];

  return (
    <div className="flex flex-col gap-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="aspect-square bg-muted w-full md:col-span-1 grayscale opacity-90">
          {author.photoUrl ? (
            <img
              src={author.photoUrl}
              alt={author.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: author.photoPosition || "center" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 opacity-20" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">{author.name}</h1>
          {author.bio && (
            <div className="text-lg leading-relaxed text-muted-foreground max-w-2xl whitespace-pre-wrap">
              {author.bio}
            </div>
          )}
        </div>
      </div>

      {authorBooks.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="font-sans text-xs font-semibold tracking-widest uppercase mb-12 text-muted-foreground">
            Books by {author.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {authorBooks.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="group block">
                <div className="aspect-[2/3] bg-muted mb-6 overflow-hidden">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-85" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 opacity-20" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-lg leading-snug mb-1 group-hover:text-muted-foreground transition-colors duration-200">{book.title}</h3>
                <span className="text-[10px] uppercase tracking-widest font-medium mt-2 block" style={{ color: 'hsl(var(--tag-language-text))' }}>
                  {book.language}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
