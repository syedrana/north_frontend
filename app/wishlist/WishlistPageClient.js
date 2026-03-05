"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";

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
  const [removingIds, setRemovingIds] = useState([]);
  const removeTimersRef = useRef({});

  const isEmpty = useMemo(() => items.length === 0, [items]);

  const removeItem = (productId) => {

    const previousItems = items;
    const previousTotal = totalItems;

    setRemovingIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));

    removeTimersRef.current[productId] = setTimeout(() => {
      setItems((prev) => prev.filter((item) => item._id !== productId));
      setTotalItems((prev) => {
        const nextCount = Math.max(prev - 1, 0);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("wishlist-count-changed", { detail: { count: nextCount } }));
        }
        return nextCount;
      });
      delete removeTimersRef.current[productId];
    }, 220);

    startTransition(async () => {
      const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        clearTimeout(removeTimersRef.current[productId]);
        delete removeTimersRef.current[productId];
        setRemovingIds((prev) => prev.filter((id) => id !== productId));
        setItems(previousItems);
        setTotalItems(previousTotal);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("wishlist-count-changed", { detail: { count: previousTotal } }));
        }
        return;
      }

      const json = await response.json();

      if (json?.success) {
        if (typeof json.totalItems === "number") {
          setTotalItems(json.totalItems);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("wishlist-count-changed", { detail: { count: json.totalItems } }));
          }
        }
        setRemovingIds((prev) => prev.filter((id) => id !== productId));
        return;
      }

      clearTimeout(removeTimersRef.current[productId]);
      delete removeTimersRef.current[productId];
      setRemovingIds((prev) => prev.filter((id) => id !== productId));
      setItems(previousItems);
      setTotalItems(previousTotal);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("wishlist-count-changed", { detail: { count: previousTotal } }));
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
            <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.article
              key={item._id}
              layout
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={
                removingIds.includes(item._id)
                  ? { opacity: 0, y: -8, scale: 0.98 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
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
                  disabled={isPending || removingIds.includes(item._id)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove from wishlist
                </button>
                <Link
                  href={`/product/${item.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                >
                  Product details
                </Link>
              </div>
            </motion.article>
          ))}
          </AnimatePresence>
        </section>
      )}
    </main>
  );
}
