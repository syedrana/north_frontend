// "use client";

// import api from "@/lib/api";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import WishlistButton from "../wishlist/WishlistButton";

// // const GUEST_STORAGE_KEY = "guest_id";

// // const ensureGuestId = () => {
// //   if (typeof window === "undefined") return "";
// //   const existing = window.localStorage.getItem(GUEST_STORAGE_KEY);
// //   if (existing) return existing;

// //   const generated = `guest_${crypto.randomUUID()}`;
// //   window.localStorage.setItem(GUEST_STORAGE_KEY, generated);
// //   return generated;
// // };

// const normalizeProduct = (item) => item?.product || item?.productId || item;

// const getVariantData = (product = {}) => {
//   const variants = Array.isArray(product?.variants) ? product.variants : [];
//   const defaultVariant = variants.find((variant) => variant?.isDefault) || variants[0] || null;

//   const variantImage = defaultVariant?.images?.[0]?.url;
//   const fallbackImage = product?.images?.[0]?.url || product?.thumbnail || product?.image;
//   const image = variantImage || fallbackImage || null;

//   const rawPrice = defaultVariant?.discountPrice ?? defaultVariant?.price ?? product?.discountPrice ?? product?.price;
//   const price = Number(rawPrice);

//   return {
//     image,
//     price: Number.isFinite(price) ? price : null,
//   };
// };

// const formatCurrency = (value) => {
//   const amount = Number(value);
//   if (!Number.isFinite(amount)) return null;

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
//   }).format(amount);
// };

// export default function RecentlyViewedProducts({ title = "Recently Viewed", limit }) {

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const loadRecentlyViewed = async () => {
//       try {
//         setLoading(true);
//         // const guestId = ensureGuestId();
//         // const requestConfig = {
//         //   headers: guestId
//         //     ? {
//         //       "x-guest-id": guestId,
//         //       }
//         //     : undefined,
//         const requestConfig = {
//           params: Number.isFinite(Number(limit)) && Number(limit) > 0 ? { limit: Number(limit) } : undefined,
//         };

//         const response = await api.get("/recentlyviewed", requestConfig);

//         const data = response?.data?.data || response?.data;
//         const items = Array.isArray(data?.products)
//           ? data.products
//           : Array.isArray(data?.recentlyViewed)
//             ? data.recentlyViewed
//             : Array.isArray(data?.items)
//               ? data.items
//               : Array.isArray(data)
//                 ? data
//                 : [];
//         const normalized = items
//           .map((entry) => ({
//             viewedAt: entry?.viewedAt,
//             product: normalizeProduct(entry),
//           }))
//           .filter((entry) => entry?.product?._id || entry?.product?.slug);

//         if (isMounted) {
//           setProducts(normalized);
//         }
//       } catch {
//         if (isMounted) {
//           setProducts([]);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadRecentlyViewed();

//     return () => {
//       isMounted = false;
//     };
//   }, [limit]);

//   if (loading || products.length === 0) {
//     return null;
//   }

//   return (
//     <section>
//       <h2 className="mb-4 text-xl font-semibold">{title}</h2>

//       <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
//         {products.map((product, index) => {
//           const item = product?.product || {};
//           const id = item?._id || item?.id || item?.slug || index;
//           const href = item?.href || `/product/${item?.slug || ""}`;
//           const { image, price } = getVariantData(item);
//           const formattedPrice = formatCurrency(price);

//           return (
//             <article
//               key={id}
//               className="min-w-[220px] max-w-[220px] flex-shrink-0 rounded-lg border bg-white p-3 shadow-sm"
//             >
//               <div className="relative">
//               <Link href={href}>
//                 {image ? (
//                   <Image
//                     src={image}
//                     alt={item?.name || "Product"}
//                     width={300}
//                     height={220}
//                     className="h-36 w-full rounded object-cover"
//                   />
//                   ) : (
//                   <div className="flex h-36 w-full items-center justify-center rounded bg-slate-100 text-sm text-slate-400">
//                     No image
//                   </div>
//                 )}
//               </Link>
//               <WishlistButton
//                 productId={item?._id || item?.id}
//                 className="rounded-full bg-white/90 p-1.5 text-gray-700"
//               />
//               </div>

//               <Link href={href} className="mt-3 block text-sm font-medium text-gray-900">
//                 {item?.name || "Product"}
//               </Link>

//               <p className="mt-1 font-semibold text-emerald-600">{formattedPrice || "—"}</p>
//             </article>
//           );
//         })}
//       </div>
//     </section>
//   );
// }





















"use client";

import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import WishlistButton from "../wishlist/WishlistButton";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const normalizeProduct = (item) =>
  item?.product || item?.productId || item || null;

const getDefaultVariant = (variants = []) => {
  if (!Array.isArray(variants)) return null;

  return (
    variants.find((variant) => variant?.isDefault) ||
    variants[0] ||
    null
  );
};

const getProductImage = (product = {}, variant = null) => {
  const variantImage = variant?.images?.[0]?.url;

  const fallbackImage =
    product?.images?.[0]?.url ||
    product?.thumbnail ||
    product?.image ||
    null;

  return variantImage || fallbackImage;
};

const getPricing = (product = {}, variant = null) => {
  const originalPrice =
    Number(
      variant?.price ??
        product?.price ??
        0
    ) || 0;

  const discountedPrice =
    Number(
      variant?.discountPrice ??
        product?.discountPrice ??
        originalPrice
    ) || originalPrice;

  const hasDiscount =
    discountedPrice > 0 &&
    discountedPrice < originalPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      )
    : 0;

  return {
    originalPrice,
    discountedPrice,
    hasDiscount,
    discountPercentage,
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

const isProductAvailable = (product = {}, variant = null) => {
  if (typeof variant?.stock === "number") {
    return variant.stock > 0;
  }

  if (typeof product?.stock === "number") {
    return product.stock > 0;
  }

  return true;
};

/* -------------------------------------------------------------------------- */
/*                             Skeleton Component                             */
/* -------------------------------------------------------------------------- */

function RecentlyViewedSkeleton() {
  return (
    <div className="-mx-1 flex gap-4 overflow-hidden px-1 pb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="min-w-[220px] max-w-[220px] animate-pulse rounded-xl border bg-white p-3"
        >
          <div className="h-40 rounded-lg bg-slate-200" />

          <div className="mt-3 h-4 rounded bg-slate-200" />

          <div className="mt-2 h-4 w-20 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Product Card                                 */
/* -------------------------------------------------------------------------- */

const ProductCard = memo(function ProductCard({ item }) {
  const variant = useMemo(
    () => getDefaultVariant(item?.variants),
    [item]
  );

  const image = useMemo(
    () => getProductImage(item, variant),
    [item, variant]
  );

  const pricing = useMemo(
    () => getPricing(item, variant),
    [item, variant]
  );

  const inStock = useMemo(
    () => isProductAvailable(item, variant),
    [item, variant]
  );

  const href = item?.href || `/product/${item?.slug || ""}`;

  return (
    <article
      className="
        group
        min-w-[220px]
        max-w-[220px]
        flex-shrink-0
        snap-start
        overflow-hidden
        rounded-xl
        border
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link href={href}>
          {image ? (
            <Image
              src={image}
              alt={item?.name || "Product"}
              width={400}
              height={300}
              loading="lazy"
              className="
                h-44
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-400">
              No image
            </div>
          )}
        </Link>

        {/* Wishlist */}
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton
            productId={item?._id || item?.id}
            className="rounded-full bg-white/90 p-2 shadow-sm backdrop-blur"
          />
        </div>

        {/* Discount Badge */}
        {pricing.hasDiscount && (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{pricing.discountPercentage}%
          </div>
        )}

        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute bottom-2 left-2 z-10 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <Link
          href={href}
          className="
            line-clamp-2
            min-h-[42px]
            text-sm
            font-medium
            text-gray-900
            transition-colors
            hover:text-emerald-600
          "
        >
          {item?.name || "Unnamed Product"}
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-emerald-600">
            {formatCurrency(pricing.discountedPrice)}
          </span>

          {pricing.hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(pricing.originalPrice)}
            </span>
          )}
        </div>

        {/* Brand */}
        {item?.brand?.name && (
          <p className="mt-1 text-xs text-gray-500">
            {item.brand.name}
          </p>
        )}
      </div>
    </article>
  );
});

/* -------------------------------------------------------------------------- */
/*                         Recently Viewed Component                          */
/* -------------------------------------------------------------------------- */

export default function RecentlyViewedProducts({
  title = "Recently Viewed",
  limit = 10,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentlyViewed = useCallback(async () => {
    try {
      setLoading(true);

      const requestConfig = {
        params:
          Number.isFinite(Number(limit)) && Number(limit) > 0
            ? { limit: Number(limit) }
            : undefined,
      };

      const response = await api.get(
        "/recentlyviewed",
        requestConfig
      );

      const data =
        response?.data?.data || response?.data;

      const items = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.recentlyViewed)
        ? data.recentlyViewed
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];

      const normalizedProducts = items
        .map((entry) => ({
          viewedAt: entry?.viewedAt,
          product: normalizeProduct(entry),
        }))
        .filter(
          (entry) =>
            entry?.product?._id ||
            entry?.product?.slug
        )
        .sort((a, b) => {
          return (
            new Date(b?.viewedAt || 0).getTime() -
            new Date(a?.viewedAt || 0).getTime()
          );
        });

      setProducts(normalizedProducts);
    } catch (error) {
      console.error(
        "Failed to fetch recently viewed products:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentlyViewed();
  }, [fetchRecentlyViewed]);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>

        {products.length > 0 && (
          <span className="text-sm text-gray-500">
            {products.length} items
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <RecentlyViewedSkeleton />
      ) : (
        <div
          className="
            -mx-1
            flex
            gap-4
            overflow-x-auto
            px-1
            pb-3
            snap-x
            snap-mandatory
            scroll-smooth
            [scrollbar-width:thin]
          "
        >
          {products.map((entry, index) => {
            const item = entry?.product || {};

            return (
              <ProductCard
                key={
                  item?._id ||
                  item?.slug ||
                  index
                }
                item={item}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}