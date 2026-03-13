"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm text-muted hover:text-navy transition-colors cursor-pointer mb-6"
    >
      ← Tillbaka
    </button>
  );
}
