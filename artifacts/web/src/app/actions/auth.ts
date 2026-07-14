"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

const isPlaceholder = 
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'REPLACE_ME' ||
  !(process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL) ||
  (process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL) === 'REPLACE_ME';

export async function loginWithEmailAndPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    if (isPlaceholder) {
      if (email === "admin@taanga-taanga.com" && password === "taanga2024admin") {
        const cookieStore = await cookies();
        cookieStore.set("tt_session", "mock-session-cookie", {
          maxAge: expiresIn / 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        return { success: true };
      } else {
        return { error: "Invalid credentials" };
      }
    }

    // Call Firebase Auth REST API directly
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Firebase REST Auth Error:", data);
      return { error: "Invalid credentials" };
    }

    const idToken = data.idToken;

    // Use Firebase Admin SDK to create the secure HttpOnly cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set("tt_session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login Server Action Error:", error);
    return { error: "An unexpected error occurred" };
  }
}
