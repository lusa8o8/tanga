"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { auth, onAuthStateChanged, signOut } from "@/lib/firebase";
import { User } from "firebase/auth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(false);
      } else {
        // Clear any stale cookies and redirect to break infinite loops
        fetch("/api/auth/logout", { method: "POST" }).then(() => {
          window.location.href = "/admin/login";
        });
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="w-full border-b border-border py-4 px-6 md:px-12 bg-[hsl(var(--surface-footer))]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
            <span className="font-serif font-medium text-lg">Taanga-Taanga Admin</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin/books" className="hover:text-primary/70 transition-colors">Manage Books</Link>
            <Link href="/admin/authors" className="hover:text-primary/70 transition-colors">Manage Authors</Link>
            <Link href="/admin/inquiries" className="hover:text-primary/70 transition-colors">Manage Inquiries</Link>
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
