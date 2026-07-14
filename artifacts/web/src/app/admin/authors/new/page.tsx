"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useGetAuthor, useCreateAuthor, useUpdateAuthor, useListAdminAuthors, getListAdminAuthorsQueryKey } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function parsePhotoPosition(pos?: string): { x: number; y: number } {
  if (!pos || pos === "center") return { x: 50, y: 50 };
  if (pos === "top") return { x: 50, y: 20 };
  if (pos === "bottom") return { x: 50, y: 80 };
  const m = pos.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  return { x: 50, y: 50 };
}

export default function AdminAuthorsForm() {
  const params = useParams();
  const id = params.id ? params.id as string : null;
  const router = useRouter();

  const { data: authorsData } = useListAdminAuthors({ query: { enabled: !!id } });
  const existingAuthor = id ? authorsData?.find(a => a.id === id) : null;

  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();

  const [photoUrl, setPhotoUrl] = useState("");
  const [photoX, setPhotoX] = useState(50);
  const [photoY, setPhotoY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const { uploadImage } = await import("@/lib/storage");
        const url = await uploadImage(e.target.files[0], 'authors');
        setPhotoUrl(url);
        setPhotoX(50);
        setPhotoY(50);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (existingAuthor) {
      setPhotoUrl(existingAuthor.photoUrl || "");
      const { x, y } = parsePhotoPosition(existingAuthor.photoPosition);
      setPhotoX(x);
      setPhotoY(y);
    }
  }, [existingAuthor]);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));
    setPhotoX(x);
    setPhotoY(y);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => updatePosition(e.clientX, e.clientY);
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, updatePosition]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name") as string,
      bio: (fd.get("bio") as string) || undefined,
      photoUrl: photoUrl || undefined,
      photoPosition: `${photoX}% ${photoY}%`,
      featured: fd.get("featured") === "on"
    };

    if (id) {
      updateAuthor.mutate({ id, data: payload }, {
        onSuccess: () => router.push("/admin/authors")
      });
    } else {
      createAuthor.mutate(payload, {
        onSuccess: () => router.push("/admin/authors")
      });
    }
  };

  const isPending = createAuthor.isPending || updateAuthor.isPending;

  if (id && !existingAuthor) return <div className="py-12">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif text-primary">{id ? "Edit Author" : "Add New Author"}</h1>
        <Link href="/admin/authors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Photo */}
        <div className="flex flex-col gap-4">
          {/* Draggable preview circle */}
          <div
            ref={previewRef}
            className="aspect-square w-full bg-muted flex items-center justify-center overflow-hidden border border-border rounded-full grayscale relative select-none"
            style={{ cursor: photoUrl ? (isDragging ? "grabbing" : "grab") : "default" }}
            onMouseDown={photoUrl ? (e) => { e.preventDefault(); setIsDragging(true); updatePosition(e.clientX, e.clientY); } : undefined}
          >
            {photoUrl ? (
              <>
                <img
                  src={photoUrl}
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ objectPosition: `${photoX}% ${photoY}%` }}
                  alt="Author preview"
                  draggable={false}
                />
                {/* Crosshair focal point indicator */}
                <div
                  className="absolute pointer-events-none"
                  style={{ left: `${photoX}%`, top: `${photoY}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div className="relative w-7 h-7">
                    <div className="absolute inset-0 rounded-full border-2 border-white" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.4)" }} />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" style={{ transform: "translateX(-50%)", boxShadow: "0 0 2px rgba(0,0,0,0.6)" }} />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white" style={{ transform: "translateY(-50%)", boxShadow: "0 0 2px rgba(0,0,0,0.6)" }} />
                  </div>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground text-xs uppercase tracking-widest">No Photo</span>
            )}
          </div>

          {photoUrl && (
            <p className="text-xs text-muted-foreground text-center">
              {isDragging ? "Dragging..." : "Drag the image to reposition"} · {photoX}%, {photoY}%
            </p>
          )}

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Photo</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
            {isUploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
            <input type="hidden" name="photoUrl" value={photoUrl} />
          </div>
        </div>

        {/* Right Column: Fields */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Name *</label>
            <Input name="name" defaultValue={existingAuthor?.name} required />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Biography</label>
            <Textarea name="bio" defaultValue={existingAuthor?.bio || ""} className="min-h-[200px]" />
          </div>

          <div className="flex items-center gap-3 py-4 border-y border-border">
            <input 
              type="checkbox" 
              name="featured" 
              id="featured"
              defaultChecked={existingAuthor?.featured || false}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
              Feature this author on the homepage
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border mt-4">
            <Button type="submit" size="lg" className="rounded-none" disabled={isPending}>
              {isPending ? "Saving..." : "Save Author"}
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none" disabled={isPending}>
              <Link href="/admin/authors">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
