"use client";

import { useHomepage } from "@/hooks/useHomepage";
import SectionRenderer from "./components/homepage/SectionRenderer";

export default function Home() {
  const { loading, error, sections } = useHomepage();

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <p className="text-sm text-gray-500">Loading homepage...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <SectionRenderer sections={sections} />
    </main>
  );
}