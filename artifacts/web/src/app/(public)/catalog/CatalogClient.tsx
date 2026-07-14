"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  slug: string;
  authorName?: string;
  coverImageUrl?: string;
  language: string;
  category: string;
  series?: string;
}

export default function CatalogClient({ initialBooks }: { initialBooks: Book[] }) {
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [series, setSeries] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title-asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Extract unique series for the filter
  const uniqueSeries = useMemo(() => {
    const s = new Set<string>();
    initialBooks.forEach(b => { if (b.series) s.add(b.series); });
    return Array.from(s).sort();
  }, [initialBooks]);

  const filteredBooks = useMemo(() => {
    let result = initialBooks;

    if (language) result = result.filter(b => b.language === language);
    if (category) result = result.filter(b => b.category === category);
    if (series) result = result.filter(b => b.series === series);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.authorName?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      return 0; // fallback
    });

    return result;
  }, [initialBooks, language, category, series, search, sort]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => { setPage(1); }, [language, category, series, search, sort]);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-4xl font-serif text-primary mb-4">Catalog</h1>
        <p className="text-muted-foreground text-lg">Browse our complete collection of titles.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 flex-wrap">
        <select 
          className="border-b border-border bg-transparent py-2 text-sm focus:outline-none"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="Kiikaonde">Kiikaonde</option>
          <option value="Tonga/Chitonga">Tonga / Chitonga</option>
        </select>

        <select 
          className="border-b border-border bg-transparent py-2 text-sm focus:outline-none"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Grammar & Language Reference">Grammar & Language Reference</option>
          <option value="Folktales & Oral Tradition">Folktales & Oral Tradition</option>
          <option value="Readers & Learning Series">Readers & Learning Series</option>
          <option value="Cultural & Historical Nonfiction">Cultural & Historical Nonfiction</option>
          <option value="Children's Illustrated">Children's Illustrated</option>
        </select>

        {uniqueSeries.length > 0 && (
          <select 
            className="border-b border-border bg-transparent py-2 text-sm focus:outline-none"
            value={series}
            onChange={e => setSeries(e.target.value)}
          >
            <option value="">All Series</option>
            {uniqueSeries.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        <select 
          className="border-b border-border bg-transparent py-2 text-sm focus:outline-none"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>

        <input 
          type="text" 
          placeholder="Search titles or authors..." 
          className="border-b border-border bg-transparent py-2 text-sm focus:outline-none w-full md:flex-1 min-w-[200px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {paginatedBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {paginatedBooks.map((book) => (
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
                <p className="text-muted-foreground text-sm mb-2">{book.authorName}</p>
                <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: 'hsl(var(--tag-language-text))' }}>
                  {book.language}
                </span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button 
                className="px-4 py-2 border border-border text-sm disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
              <button 
                className="px-4 py-2 border border-border text-sm disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-muted-foreground py-12 font-serif text-lg">No titles found. Try adjusting your filters.</div>
      )}
    </div>
  );
}
