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
      <section className="border-t border-border pt-12 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Our Story</h2>
            <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/80">
              A Legacy of Language
            </span>
          </div>
          
          <div className="md:col-span-8 md:col-start-6 max-w-2xl border-l border-border pl-6 md:pl-10">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="font-serif italic text-lg text-primary">
                "Language is the soul of a people. Without our written word, our history is a fading echo."
              </p>
              <p>
                Taanga-Taanga Publishers Ltd. was founded with a singular, unwavering mission: to safeguard the Kiikaonde language through high-quality, accessible literature. In an era of global homogenization, we serve as the stewards of regional identity, providing a platform for local authors to capture the nuances of our culture, traditions, and linguistics.
              </p>
              <p>
                From complex grammatical studies to vibrant collections of folklore and modern narratives, our catalog is a testament to the intellectual richness of the Kiikaonde-speaking community. We are more than just a publisher; we are a cultural archive in motion.
              </p>
              <div className="pt-4">
                <Link href="/about" className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors text-muted-foreground">
                  Read our full story <span aria-hidden="true" className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
