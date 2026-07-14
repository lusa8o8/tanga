"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  useGetBook, 
  useCreateBook, 
  useUpdateBook, 
  useListAdminBooks, 
  getListAdminBooksQueryKey, 
  useListAdminAuthors,
  useListAdminLanguages,
  useCreateLanguage,
  useListAdminCategories,
  useCreateCategory,
  getListAdminLanguagesQueryKey,
  getListAdminCategoriesQueryKey
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminBooksForm() {
  const params = useParams();
  const id = params.id ? params.id as string : null;
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: authorsData } = useListAdminAuthors();
  const { data: booksData } = useListAdminBooks({}, { query: { enabled: !!id } });
  const { data: languagesData } = useListAdminLanguages();
  const { data: categoriesData } = useListAdminCategories();
  
  const existingBook = id ? (booksData as any[])?.find(b => b.id === id.toString() || b.id === id) : null;

  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const createLanguage = useCreateLanguage();
  const createCategory = useCreateCategory();

  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const { uploadImage } = await import("@/lib/storage");
        const url = await uploadImage(e.target.files[0], 'covers');
        setCoverUrl(url);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverUrl(e.target.value);
  };

  useEffect(() => {
    if (existingBook) {
      setCoverUrl(existingBook.coverImageUrl || "");
      setStatus(existingBook.status);
      setFeatured(existingBook.featured || false);
    }
  }, [existingBook]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title") as string,
      authorId: fd.get("authorId") as string,
      language: fd.get("language") as string,
      category: fd.get("category") as string,
      series: (fd.get("series") as string) || undefined,
      seriesNumber: fd.get("seriesNumber") ? parseInt(fd.get("seriesNumber") as string, 10) : undefined,
      pageCount: fd.get("pageCount") ? parseInt(fd.get("pageCount") as string, 10) : undefined,
      publicationDate: (fd.get("publicationDate") as string) || undefined,
      format: "Hardcover",
      isbn: (fd.get("isbn") as string) || undefined,
      synopsis: (fd.get("synopsis") as string) || undefined,
      contextBlurb: (fd.get("contextBlurb") as string) || undefined,
      coverImageUrl: coverUrl || undefined,
      status,
      featured
    };

    if (id) {
      updateBook.mutate({ id, data: payload }, {
        onSuccess: () => router.push("/admin/books")
      });
    } else {
      createBook.mutate(payload as any, {
        onSuccess: () => router.push("/admin/books")
      });
    }
  };

  const isPending = createBook.isPending || updateBook.isPending;

  if (id && !existingBook) return <div className="py-12">Loading...</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif text-primary">{id ? "Edit Book" : "Add New Book"}</h1>
        <Link href="/admin/books" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Cover */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[2/3] w-full bg-muted flex items-center justify-center overflow-hidden border border-border">
            {coverUrl ? (
              <img src={coverUrl} className="w-full h-full object-cover" alt="Cover preview" />
            ) : (
              <span className="text-muted-foreground font-serif text-sm">Cover Preview</span>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Cover Image</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
            {isUploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
            <p className="text-xs text-muted-foreground">Or paste a URL directly:</p>
            <Input
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={coverUrl}
              onChange={handleCoverUrlChange}
            />
          </div>
        </div>

        {/* Right Column: Fields */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Title *</label>
            <Input name="title" defaultValue={existingBook?.title} required />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Author *</label>
              <Link href="/admin/authors/new" className="text-xs text-primary underline">Add new author first</Link>
            </div>
            <select name="authorId" defaultValue={existingBook?.authorId} required className="w-full border-b border-border bg-transparent py-2 text-base focus:outline-none">
              <option value="">Select Author...</option>
              {authorsData?.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Language *</label>
                <button
                  type="button"
                  onClick={async () => {
                    const name = window.prompt("Enter new language name:");
                    if (name && name.trim()) {
                      try {
                        await createLanguage.mutateAsync({ name: name.trim() });
                        queryClient.invalidateQueries({ queryKey: getListAdminLanguagesQueryKey() });
                      } catch (err) {
                        alert("Failed to create language");
                      }
                    }
                  }}
                  className="text-xs text-primary underline"
                >
                  Add new
                </button>
              </div>
              <select name="language" defaultValue={existingBook?.language || "Kiikaonde"} required className="w-full border-b border-border bg-transparent py-2 text-base focus:outline-none">
                <option value="">Select Language...</option>
                {languagesData?.map((l: any) => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Category *</label>
                <button
                  type="button"
                  onClick={async () => {
                    const name = window.prompt("Enter new category name:");
                    if (name && name.trim()) {
                      try {
                        await createCategory.mutateAsync({ name: name.trim() });
                        queryClient.invalidateQueries({ queryKey: getListAdminCategoriesQueryKey() });
                      } catch (err) {
                        alert("Failed to create category");
                      }
                    }
                  }}
                  className="text-xs text-primary underline"
                >
                  Add new
                </button>
              </div>
              <select name="category" defaultValue={existingBook?.category || "Folktales & Oral Tradition"} required className="w-full border-b border-border bg-transparent py-2 text-base focus:outline-none">
                <option value="">Select Category...</option>
                {categoriesData?.map((c: any) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Series Name</label>
              <Input name="series" defaultValue={existingBook?.series || ""} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Series Number</label>
              <Input name="seriesNumber" type="number" defaultValue={existingBook?.seriesNumber || ""} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">ISBN</label>
              <Input name="isbn" defaultValue={existingBook?.isbn || ""} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Publication Date</label>
              <input
                type="date"
                name="publicationDate"
                defaultValue={existingBook?.publicationDate || ""}
                className="w-full border-b border-border bg-transparent py-2 text-base focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Page Count</label>
              <Input name="pageCount" type="number" defaultValue={existingBook?.pageCount || ""} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Format</label>
              <Input name="format" value="Hardcover" disabled />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Synopsis</label>
            <Textarea name="synopsis" defaultValue={existingBook?.synopsis || ""} className="min-h-[120px]" placeholder="What is this book about? Write 2–4 sentences describing the story, topic, or content — as if explaining it to a curious reader." />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Context Blurb</label>
            <Textarea name="contextBlurb" defaultValue={existingBook?.contextBlurb || ""} className="min-h-[80px]" placeholder="Why does this book matter? e.g. 'This is one of the few books written entirely in Kiikaonde, helping to preserve the language for younger generations.'" />
          </div>

          <div className="p-8 bg-muted/20 border border-border mt-4 flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <label className="text-sm font-medium">Publishing Status</label>
              <div className="flex bg-muted/50 rounded-full p-1 w-fit">
                <button type="button" onClick={() => setStatus("draft")} className={`px-4 py-1 text-sm rounded-full ${status === 'draft' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Draft</button>
                <button type="button" onClick={() => setStatus("published")} className={`px-4 py-1 text-sm rounded-full ${status === 'published' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Published</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="text-sm font-medium">Feature on Homepage?</label>
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5" />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border mt-4">
            <Button type="submit" size="lg" className="rounded-none" disabled={isPending}>
              {isPending ? "Saving..." : "Save Book"}
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none" disabled={isPending}>
              <Link href="/admin/books">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
