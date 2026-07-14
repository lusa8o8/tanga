"use client";
import * as React from "react";

export function Logo({ className }: { className?: string }) {
  // Using a plain img tag so Tailwind size classes (w-8, h-8, etc.) apply correctly
  return (
    <img
      src="/logo.png"
      alt="Taanga-Taanga Publishers Limited logo"
      className={className}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}
