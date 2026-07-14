"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithEmailAndPassword } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        fd.get("email") as string,
        fd.get("password") as string
      );
      const idToken = await userCredential.user.getIdToken();
      
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      
      if (!res.ok) throw new Error("Failed to create session");
      
      router.push("/admin");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6">
        <div className="flex flex-col items-center mb-12">
          <Logo className="w-12 h-12 text-primary mb-6" />
          <h1 className="text-3xl font-serif text-primary">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Email</label>
            <Input type="email" name="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Password</label>
            <Input type="password" name="password" required />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" size="lg" className="rounded-none w-full mt-4" disabled={isPending}>
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
