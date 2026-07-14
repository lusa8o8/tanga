"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useListAdminBooks, useDeleteBook, getListAdminBooksQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminBooksList() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const queryClient = useQueryClient();
  const params = { status: status || undefined, search: search || undefined };

  const { data: books = [], isLoading } = useListAdminBooks(params);
  const deleteBook = useDeleteBook();

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteBook.mutate({ id: deleteTarget.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminBooksQueryKey(params) });
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif text-primary">Manage Books</h1>
        <Button asChild size="lg" className="rounded-none">
          <Link href="/admin/books/new">+ Add New Book</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div className="flex bg-muted/30 rounded-full p-1 w-fit">
          <button
            onClick={() => setStatus("")}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${!status ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("published")}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${status === "published" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            Published
          </button>
          <button
            onClick={() => setStatus("draft")}
            className={`px-4 py-1 text-sm rounded-full transition-colors ${status === "draft" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
          >
            Drafts
          </button>
        </div>
        <input
          type="text"
          placeholder="Search titles..."
          className="border-b border-border bg-transparent px-2 py-1 text-sm focus:outline-none w-full sm:w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-muted-foreground py-8">Loading books...</div>
        ) : books.length > 0 ? (
          books.map(book => (
            <div key={book.id} className="flex items-center gap-6 p-4 border border-border bg-background" data-testid={`row-book-${book.id}`}>
              <div className="w-16 h-24 bg-muted flex-shrink-0">
                {book.coverImageUrl && (
                  <img src={book.coverImageUrl} className="w-full h-full object-cover" alt={book.title} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg mb-1 truncate">{book.title}</div>
                <div className="text-muted-foreground text-sm truncate">{book.authorName}</div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <span
                  className="text-[10px] uppercase tracking-wider font-bold text-white px-3 py-1 rounded-full"
                  style={{ backgroundColor: book.status === "published" ? "hsl(var(--status-published))" : "hsl(var(--status-draft))" }}
                  data-testid={`status-book-${book.id}`}
                >
                  {book.status}
                </span>
                <Link href={`/admin/books/${book.id}/edit`} className="text-sm font-medium hover:opacity-70 transition-opacity" data-testid={`link-edit-${book.id}`}>
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget({ id: book.id, title: book.title })}
                  className="text-sm text-muted-foreground hover:text-red-700 transition-colors"
                  data-testid={`button-delete-${book.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground py-8">No books found.</div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this book?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.title}</strong> will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-800 text-white"
              disabled={deleteBook.isPending}
            >
              {deleteBook.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
