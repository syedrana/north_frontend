"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7000";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);

export default function WishlistPageClient({ initialItems, initialTotalItems }) {
  const [items, setItems] = useState(initialItems);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [isPending, startTransition] = useTransition();

  const isEmpty = useMemo(() => items.length === 0, [items]);

  const removeItem = (productId) => {
    startTransition(async () => {
      const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) return;

      const json = await response.json();

      if (json.success && json.removed) {
        setItems((prev) => prev.filter((item) => item._id !== productId));
        setTotalItems(json.totalItems);
      }
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My Wishlist</h1>
          <p className="mt-1 text-sm text-zinc-500">Saved items: {totalItems}</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
          <p className="text-base font-medium text-zinc-700">Your wishlist is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item._id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <div className="relative aspect-[4/3] bg-zinc-100">
                {item.preview?.image ? (
                  <Image
                    src={item.preview.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-semibold text-zinc-900">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500">{item.brand ?? "No Brand"}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-zinc-900">
                    {formatCurrency(item.preview?.effectivePrice ?? 0)}
                  </span>
                  {item.preview?.discountPrice ? (
                    <span className="text-xs text-zinc-400 line-through">
                      {formatCurrency(item.preview.price)}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item._id)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove from wishlist
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
