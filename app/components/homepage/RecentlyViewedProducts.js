"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const GUEST_STORAGE_KEY = "guest_id";

const ensureGuestId = () => {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(GUEST_STORAGE_KEY);
  if (existing) return existing;

  const generated = `guest_${crypto.randomUUID()}`;
  window.localStorage.setItem(GUEST_STORAGE_KEY, generated);
  return generated;
};

const normalizeProduct = (item) => item?.product || item?.productId || item;

export default function RecentlyViewedProducts({ title = "Recently Viewed", limit }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRecentlyViewed = async () => {
      try {
        setLoading(true);
        const guestId = ensureGuestId();
        const response = await api.get("/recentlyviewed", {
          headers: guestId
            ? {
              "x-guest-id": guestId,
            }
            : undefined,
          params: Number.isFinite(Number(limit)) && Number(limit) > 0 ? { limit: Number(limit) } : undefined,
        });
        const data = response?.data;
        const items = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        const normalized = items
          .map((entry) => ({
            viewedAt: entry?.viewedAt,
            product: normalizeProduct(entry),
          }))
          .filter((entry) => entry?.product?._id || entry?.product?.slug);

        if (isMounted) {
          setProducts(normalized);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecentlyViewed();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {products.map((product, index) => {
          const item = product?.product || {};
          const id = item?._id || item?.id || item?.slug || index;
          const href = item?.href || `/product/${item?.slug || ""}`;

          return (
            <article
              key={id}
              className="min-w-[220px] max-w-[220px] flex-shrink-0 rounded-lg border bg-white p-3 shadow-sm"
            >
              <Link href={href}>
                {item?.image && (
                  <Image
                    src={item.image}
                    alt={item?.name || "Product"}
                    width={300}
                    height={220}
                    className="h-36 w-full rounded object-cover"
                  />
                )}
              </Link>

              <Link href={href} className="mt-3 block text-sm font-medium text-gray-900">
                {item?.name || "Product"}
              </Link>

              <p className="mt-1 font-semibold text-emerald-600">${item?.price ?? ""}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
