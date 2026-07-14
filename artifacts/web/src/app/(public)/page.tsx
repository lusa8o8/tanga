import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // ISR: 1 hour

async function getFeaturedBooks() {
  const snapshot = await adminDb.collection('books')
    .where('status', '==', 'published')
    .where('featured', '==', true)
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...(doc.data() as any) }));
}

async function getLanguages() {
  const snapshot = await adminDb.collection('languages').get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...(doc.data() as any) }));
}

export default async function Home() {
  const [featuredBooks, languages] = await Promise.all([
    getFeaturedBooks(),
    getLanguages()
  ]);

  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-serif text-primary leading-tight mb-8">
          Preserving Heritage, One Page at a Time.
        </h1>
        <div className="flex items-center gap-4">
          <Button asChild size="lg" className="rounded-none">
            <Link href="/catalog">Browse the Catalog</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-none border-primary text-primary hover:bg-primary/5">
            <Link href="/bulk-orders">Inquire About Bulk Orders</Link>
          </Button>
        </div>
      </section>

      {/* Browse by Language */}
      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-xs font-semibold tracking-widest uppercase mb-8 text-muted-foreground">
          Browse by Language
        </h2>
        <div className="flex flex-wrap gap-4">
          {languages.map((lang: any) => (
            <Link 
              key={lang.id} 
              href={`/catalog?language=${encodeURIComponent(lang.name)}`} 
              className="px-6 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90" 
              style={{ 
                backgroundColor: lang.name === 'Kiikaonde' ? 'hsl(var(--tag-kiikaonde))' 
                               : lang.name.includes('Tonga') ? 'hsl(var(--tag-tonga))' 
                               : '#78716c' // stone-500 default for new languages
              }}
            >
              {lang.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-xs font-semibold tracking-widest uppercase mb-12 text-muted-foreground">
          Featured Books
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {featuredBooks?.map((book: any) => (
            <Link key={book.id} href={`/books/${book.slug}`} className="group block">
              <div className="aspect-[2/3] bg-muted mb-6 overflow-hidden">
                {book.coverImageUrl ? (
                  <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif p-4 text-center">No Cover</div>
                )}
              </div>
              <h3 className="font-serif text-lg leading-snug mb-1 group-hover:text-muted-foreground transition-colors">{book.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{book.authorName}</p>
              <span 
                className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold text-white" 
                style={{ backgroundColor: book.language === 'Kiikaonde' ? 'hsl(var(--tag-kiikaonde))' : 'hsl(var(--tag-tonga))' }}
              >
                {book.language}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
