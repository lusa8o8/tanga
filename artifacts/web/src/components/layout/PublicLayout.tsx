import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function PublicLayout({ children, settings }: { children: React.ReactNode, settings?: any }) {
  const contact = settings?.contact || {};
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="w-full border-b border-border py-8 px-6 md:px-12">
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {children}
      </main>

      <footer className="w-full bg-[hsl(var(--surface-footer))] py-20 md:py-32 mt-16 md:mt-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 mb-16">
          <div>
            <h4 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-6 text-primary/80">Sales/Bulk Orders</h4>
            <div className="text-muted-foreground text-sm flex flex-col gap-3">
              <p>{contact.salesEmail || "sales@taanga-taanga.com"}</p>
              <p>{contact.phone || "+260 97 123 4567"}</p>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-6 text-primary/80">Legal</h4>
            <div className="text-muted-foreground text-sm flex flex-col gap-3">
              <Link href="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase mb-6 text-primary/80">General Contact</h4>
            <div className="text-muted-foreground text-sm flex flex-col gap-3">
              <p>{contact.generalEmail || "hello@taanga-taanga.com"}</p>
              <p>{contact.address || "PO Box 31000, Lusaka, Zambia"}</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Taanga-Taanga Publishers Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
