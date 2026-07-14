import * as React from "react";
import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // ISR: 1 hour

async function getAuthors() {
  const snapshot = await adminDb.collection('authors').orderBy('name').get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...(doc.data() as any) }));
}

export default async function AuthorsIndex() {
  const authors = await getAuthors();

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col items-center text-center mt-8 mb-8">
        <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">Meet the Authors</h1>
        <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/80 block max-w-xl">
          The Architects of Our Heritage
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
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
            {author.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {author.bio}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
