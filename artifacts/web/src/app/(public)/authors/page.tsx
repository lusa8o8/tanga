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
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Authors</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The voices preserving and enriching the literature of Zambia's indigenous languages.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
        {authors.map((author: any) => (
          <Link key={author.id} href={`/authors/${author.slug}`} className="group flex flex-col items-center text-center">
            <div className="aspect-square w-full max-w-[200px] bg-muted overflow-hidden border border-border rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 mb-6 mx-auto">
              {author.photoUrl ? (
                <img
                  src={author.photoUrl}
                  alt={author.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: author.photoPosition || "center" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                  No Photo
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
