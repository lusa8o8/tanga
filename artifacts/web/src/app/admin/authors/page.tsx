"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useListAdminAuthors, useDeleteAuthor, getListAdminAuthorsQueryKey } from "@/lib/api";
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

export default function AdminAuthorsList() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const queryClient = useQueryClient();
  const { data: authors = [], isLoading } = useListAdminAuthors();
  const deleteAuthor = useDeleteAuthor();

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteAuthor.mutate({ id: deleteTarget.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminAuthorsQueryKey() });
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif text-primary">Manage Authors</h1>
        <Button asChild size="lg" className="rounded-none">
          <Link href="/admin/authors/new">+ Add New Author</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="text-muted-foreground py-8">Loading authors...</div>
        ) : authors.length > 0 ? (
          authors.map(author => (
            <div key={author.id} className="flex items-center gap-6 p-4 border border-border bg-background" data-testid={`row-author-${author.id}`}>
              <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0 overflow-hidden grayscale">
                {author.photoUrl && (
                  <img
                    src={author.photoUrl}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: author.photoPosition || "center" }}
                    alt={author.name}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg mb-1 flex items-center gap-3">
                  <span className="truncate">{author.name}</span>
                  {author.featured && (
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-medium rounded-sm">Featured</span>
                  )}
                </div>
                <div className="text-muted-foreground text-sm">{author.bookCount ?? 0} {author.bookCount === 1 ? "book" : "books"}</div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <Link href={`/admin/authors/${author.id}/edit`} className="text-sm font-medium hover:opacity-70 transition-opacity" data-testid={`link-edit-author-${author.id}`}>
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget({ id: author.id, name: author.name })}
                  className="text-sm text-muted-foreground hover:text-red-700 transition-colors"
                  data-testid={`button-delete-author-${author.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground py-8">No authors found.</div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this author?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> will be permanently removed. Any books assigned to them will need to be reassigned. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-800 text-white"
              disabled={deleteAuthor.isPending}
            >
              {deleteAuthor.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
