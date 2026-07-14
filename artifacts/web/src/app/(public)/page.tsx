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

async function getAuthorsSubset() {
  const snapshot = await adminDb.collection('authors').orderBy('name').limit(4).get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...(doc.data() as any) }));
}

export default async function Home() {
  const [featuredBooks, languages, authors] = await Promise.all([
    getFeaturedBooks(),
    getLanguages(),
    getAuthorsSubset()
  ]);

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-12">
        {/* Experimental Background Texture */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none select-none flex justify-end items-start opacity-[0.03]"
          aria-hidden="true"
        >
          <div className="font-serif text-[12rem] lg:text-[18rem] leading-[0.75] text-primary text-right -mr-12 md:-mr-24 -mt-8 tracking-tighter">
            Heritage<br />
            Language
          </div>
        </div>

        <div className="max-w-2xl relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif text-primary leading-[1.15] mb-8">
            Preserving Heritage, One Page at a Time.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-sm">
            Publishing books in Kiikaonde and Tonga that preserve language, culture, and history for future generations.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-none px-8">
              <Link href="/catalog">Browse the Catalog</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-primary text-primary hover:bg-primary/5 px-8">
              <Link href="/bulk-orders">Inquire About Bulk Orders</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by Language */}
      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-12 text-muted-foreground/80">
          Browse by Language
        </h2>
        <div className="flex flex-wrap gap-6">
          {languages.map((lang: any) => (
            <Link
              key={lang.id}
              href={`/catalog?language=${encodeURIComponent(lang.name)}`}
              className="font-serif text-lg text-primary hover:text-muted-foreground transition-colors duration-200"
            >
              {lang.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-16 text-muted-foreground/80">
          Featured Books
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {featuredBooks?.map((book: any) => (
            <Link key={book.id} href={`/books/${book.slug}`} className="group block">
              <div className="aspect-[2/3] bg-muted mb-8 overflow-hidden">
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
              <h3 className="font-serif text-lg leading-snug mb-2 group-hover:text-muted-foreground transition-colors duration-200">{book.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{book.authorName}</p>
              <span
                className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium text-white rounded-sm"
                style={{ backgroundColor: book.language === 'Kiikaonde' ? 'hsl(var(--tag-kiikaonde))' : book.language?.includes('Tonga') ? 'hsl(var(--tag-tonga))' : 'hsl(var(--tag-language-text))' }}
              >
                {book.language}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="border-t border-border pt-12">
        <h2 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-12 text-muted-foreground/80">
          Our Story
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-5 max-w-2xl">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="font-serif italic text-xl md:text-2xl text-primary leading-snug mb-8">
                "Language is the soul of a people. Without our written word, our history is a fading echo."
              </p>
              <p>
                Taanga-Taanga Publishers Ltd. was founded with a singular, unwavering mission: to safeguard the Kiikaonde language through high-quality, accessible literature. In an era of global homogenization, we serve as the stewards of regional identity, providing a platform for local authors to capture the nuances of our culture, traditions, and linguistics.
              </p>
              <p>
                From complex grammatical studies to vibrant collections of folklore and modern narratives, our catalog is a testament to the intellectual richness of the Kiikaonde-speaking community. We are more than just a publisher; we are a cultural archive in motion.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Meet the Authors */}
      <section className="border-t border-border pt-12 pb-8">
        <h2 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-16 text-muted-foreground/80">
          Meet the Authors
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 w-full">
          {authors.map((author: any) => (
            <Link key={author.id} href={`/authors/${author.slug}`} className="group flex flex-col items-center text-center">
              <div className="aspect-square w-full max-w-[200px] bg-muted overflow-hidden border border-border rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 mb-6 mx-auto">
                {author.photoUrl ? (
                  <img
                    src={author.photoUrl}
                    alt={author.name}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    style={{ objectPosition: author.photoPosition || "center" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 opacity-20" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-xl text-primary mb-2 group-hover:opacity-80 transition-opacity">
                {author.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
