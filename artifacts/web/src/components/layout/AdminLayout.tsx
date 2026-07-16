"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="w-full border-b border-border py-4 px-6 md:px-12 bg-[hsl(var(--surface-footer))]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity shrink-0">
            <Logo className="w-8 h-8" />
            <span className="font-serif font-medium text-lg">Taanga-Taanga Admin</span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium overflow-x-auto w-full md:w-auto whitespace-nowrap pb-2 md:pb-0">
            <Link href="/admin/books" className="hover:text-primary/70 transition-colors">Manage Books</Link>
            <Link href="/admin/authors" className="hover:text-primary/70 transition-colors">Manage Authors</Link>
            <Link href="/admin/inquiries" className="hover:text-primary/70 transition-colors">Manage Inquiries</Link>
            <Link href="/admin/tools/cover-cropper" className="hover:text-primary/70 transition-colors text-amber-700">Cover Cropper</Link>
            <Link href="/admin/settings" className="hover:text-primary/70 transition-colors">Site Settings</Link>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">Sign Out</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        {children}
      </main>
    </div>
  );
}
