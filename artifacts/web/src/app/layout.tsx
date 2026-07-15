import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://taanga-taanga.com"),
  title: "Taanga-Taanga Publishers Limited | Zambian Language Books",
  description: "Discover and explore books written in Zambia's local languages — Kiikaonde, Tonga, and more. Preserving culture through literature.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Taanga-Taanga Publishers Limited | Zambian Language Books",
    description: "Discover and explore books written in Zambia's local languages — Kiikaonde, Tonga, and more.",
    images: [{ url: "/logo.png" }],
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
