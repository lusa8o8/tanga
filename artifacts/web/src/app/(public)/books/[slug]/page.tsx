import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // ISR

interface Book {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  authorName?: string;
  coverImageUrl?: string;
  language: string;
  category: string;
  synopsis?: string;
  contextBlurb?: string;
  isbn?: string;
  pageCount?: number;
  publicationDate?: string;
  format?: string;
  series?: string;
  seriesNumber?: number;
}

export default async function BookDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  
  const snapshot = await adminDb.collection('books')
    .where('slug', '==', slug)
    .where('status', '==', 'published')
    .limit(1)
    .get();
    
  if (snapshot.empty) {
    notFound();
  }
  
  const book = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Book;

  // Fetch Author to get authorSlug for the link
  let authorSlug = "";
  if (book.authorId) {
    const authorDoc = await adminDb.collection('authors').doc(book.authorId).get();
    if (authorDoc.exists) {
      authorSlug = authorDoc.data()?.slug || "";
    }
  }

  // Related Books Logic: same language (+1), same category (+2), same series (+3)
  const allBooksSnapshot = await adminDb.collection('books').where('status', '==', 'published').get();
  const allBooks = allBooksSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as Book[];
  
  const relatedBooks = allBooks
    .filter(b => b.id !== book.id)
    .map(b => {
      let score = 0;
      if (b.language === book.language) score += 1;
      if (b.category === book.category) score += 2;
      if (b.series && b.series === book.series) score += 3;
      return { ...b, _score: score };
    })
    .filter(b => b._score > 0) // Only show books with at least some relation
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Cover */}
        <div className="aspect-[2/3] bg-muted w-full max-w-md">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif">No Cover</div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-2">{book.title}</h1>
            {authorSlug ? (
              <Link href={`/authors/${authorSlug}`} className="text-xl text-muted-foreground hover:text-primary transition-colors">
                {book.authorName}
              </Link>
            ) : (
              <span className="text-xl text-muted-foreground">{book.authorName}</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span
              className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium text-white rounded-sm"
              style={{ backgroundColor: book.language === 'Kiikaonde' ? 'hsl(var(--tag-kiikaonde))' : book.language?.includes('Tonga') ? 'hsl(var(--tag-tonga))' : 'hsl(var(--tag-language-text))' }}
            >
              {book.language}
            </span>
            <span className="text-muted-foreground" aria-hidden="true">&middot;</span>
            <span className="text-sm text-muted-foreground">{book.category}</span>
          </div>

          {book.synopsis && (
            <div className="text-lg leading-relaxed mb-8 whitespace-pre-wrap">
              {book.synopsis}
            </div>
          )}

          {book.contextBlurb && (
            <div className="text-sm text-muted-foreground italic mb-12 border-l-2 border-border pl-4">
              {book.contextBlurb}
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-4 text-sm mb-12 py-6 border-y border-border">
            {book.isbn && <><div className="text-muted-foreground">ISBN</div><div>{book.isbn}</div></>}
            {book.pageCount && <><div className="text-muted-foreground">Page Count</div><div>{book.pageCount}</div></>}
            {book.publicationDate && <><div className="text-muted-foreground">Published</div><div>{book.publicationDate}</div></>}
            <div className="text-muted-foreground">Format</div><div>{book.format}</div>
            {book.series && <><div className="text-muted-foreground">Series</div><div>{book.series} {book.seriesNumber && `#${book.seriesNumber}`}</div></>}
          </div>

          <Button asChild size="lg" className="w-fit rounded-none">
            <Link href={`/inquiry?title=${encodeURIComponent(book.title)}`}>Inquire About This Title</Link>
          </Button>
        </div>
      </div>

      {relatedBooks.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="font-sans text-xs font-semibold tracking-widest uppercase mb-12 text-muted-foreground">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {relatedBooks.map((rBook) => (
              <Link key={rBook.id} href={`/books/${rBook.slug}`} className="group block">
                <div className="aspect-[2/3] bg-muted mb-6 overflow-hidden">
                  {rBook.coverImageUrl ? (
                    <img src={rBook.coverImageUrl} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-85" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 opacity-20" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-lg leading-snug mb-1 group-hover:text-muted-foreground transition-colors duration-200">{rBook.title}</h3>
                <p className="text-muted-foreground text-sm">{rBook.authorName}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
