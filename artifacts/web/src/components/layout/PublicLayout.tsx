"use client";
import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="w-full border-b border-border py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 text-primary hover:opacity-75 transition-opacity duration-200">
            <Logo className="w-10 h-10" />
            <span className="font-serif font-medium text-xl">Taanga-Taanga Publishers Limited</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-muted-foreground">
            <Link href="/catalog" className="hover:text-primary transition-colors duration-200">Catalog</Link>
            <Link href="/authors" className="hover:text-primary transition-colors duration-200">Authors</Link>
            <Link href="/about" className="hover:text-primary transition-colors duration-200">About</Link>
            <Link href="/bulk-orders" className="hover:text-primary transition-colors duration-200">Bulk Orders</Link>
            <Link href="/inquiry" className="hover:text-primary transition-colors duration-200">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        {children}
      </main>

      <footer className="w-full bg-[hsl(var(--surface-footer))] py-16 px-6 md:px-12 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase mb-4 text-primary">Sales/Bulk Orders</h4>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <p>sales@taanga-taanga.com</p>
              <p>+260 97 123 4567</p>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase mb-4 text-primary">Legal</h4>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <Link href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase mb-4 text-primary">General Contact</h4>
            <div className="text-muted-foreground text-sm flex flex-col gap-2">
              <p>hello@taanga-taanga.com</p>
              <p>PO Box 31000, Lusaka, Zambia</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Taanga-Taanga Publishers Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
