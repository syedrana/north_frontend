"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import WishlistButton from "../wishlist/WishlistButton";

// const GUEST_STORAGE_KEY = "guest_id";

// const ensureGuestId = () => {
//   if (typeof window === "undefined") return "";
//   const existing = window.localStorage.getItem(GUEST_STORAGE_KEY);
//   if (existing) return existing;

//   const generated = `guest_${crypto.randomUUID()}`;
//   window.localStorage.setItem(GUEST_STORAGE_KEY, generated);
//   return generated;
// };

const normalizeProduct = (item) => item?.product || item?.productId || item;

const getVariantData = (product = {}) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const defaultVariant = variants.find((variant) => variant?.isDefault) || variants[0] || null;

  const variantImage = defaultVariant?.images?.[0]?.url;
  const fallbackImage = product?.images?.[0]?.url || product?.thumbnail || product?.image;
  const image = variantImage || fallbackImage || null;

  const rawPrice = defaultVariant?.discountPrice ?? defaultVariant?.price ?? product?.discountPrice ?? product?.price;
  const price = Number(rawPrice);

  return {
    image,
    price: Number.isFinite(price) ? price : null,
  };
};

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

export default function RecentlyViewedProducts({ title = "Recently Viewed", limit }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRecentlyViewed = async () => {
      try {
        setLoading(true);
        // const guestId = ensureGuestId();
        // const requestConfig = {
        //   headers: guestId
        //     ? {
        //       "x-guest-id": guestId,
        //       }
        //     : undefined,
        const requestConfig = {
          params: Number.isFinite(Number(limit)) && Number(limit) > 0 ? { limit: Number(limit) } : undefined,
        };

        const response = await api.get("/recentlyviewed", requestConfig);

        const data = response?.data?.data || response?.data;
        const items = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.recentlyViewed)
            ? data.recentlyViewed
            : Array.isArray(data?.items)
              ? data.items
              : Array.isArray(data)
                ? data
                : [];
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
          const { image, price } = getVariantData(item);
          const formattedPrice = formatCurrency(price);

          return (
            <article
              key={id}
              className="min-w-[220px] max-w-[220px] flex-shrink-0 rounded-lg border bg-white p-3 shadow-sm"
            >
              <div className="relative">
              <Link href={href}>
                {image ? (
                  <Image
                    src={image}
                    alt={item?.name || "Product"}
                    width={300}
                    height={220}
                    className="h-36 w-full rounded object-cover"
                  />
                  ) : (
                  <div className="flex h-36 w-full items-center justify-center rounded bg-slate-100 text-sm text-slate-400">
                    No image
                  </div>
                )}
              </Link>
              <WishlistButton
                productId={item?._id || item?.id}
                className="rounded-full bg-white/90 p-1.5 text-gray-700"
              />
              </div>

              <Link href={href} className="mt-3 block text-sm font-medium text-gray-900">
                {item?.name || "Product"}
              </Link>

              <p className="mt-1 font-semibold text-emerald-600">{formattedPrice || "—"}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
