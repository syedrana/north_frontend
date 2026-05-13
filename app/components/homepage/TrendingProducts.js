// "use client";

// import { useTrendingProducts } from "@/hooks/useTrendingProducts";
// import Image from "next/image";
// import Link from "next/link";
// import WishlistButton from "../wishlist/WishlistButton";

// function formatCurrency(value) {
//   const amount = Number(value);

//   if (!Number.isFinite(amount)) {
//     return null;
//   }

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
//   }).format(amount);
// }

// export default function TrendingProducts({
//   title = "Trending Products",
//   products: initialProducts = [],
//   useApiFallback = false,
//   query = {},
// }) {
//   const shouldLoadFromApi = Boolean(useApiFallback);
//   const { products: apiProducts, source, loading, error } = useTrendingProducts(query, shouldLoadFromApi);

//   const products = shouldLoadFromApi ? apiProducts : initialProducts;

//   if (shouldLoadFromApi && loading) {
//     return (
//       <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
//         <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
//         <p className="mt-2 text-sm text-slate-500">Loading trending products...</p>
//       </section>
//     );
//   }

//   if (!Array.isArray(products) || products.length === 0) {
//     return null;
//   }

//   return (
//     <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
//       <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
//         <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
//         {shouldLoadFromApi && source && (
//           <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
//             {source.replaceAll("_", " ")}
//           </span>
//         )}
//       </div>

//       {shouldLoadFromApi && error && <p className="mb-4 text-sm text-amber-600">{error}</p>}

//       <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product, index) => {
//           const id = product?._id || product?.id || product?.slug || index;
//           const href = product?.href || `/product/${product?.slug || ""}`;
//           const currentPrice = formatCurrency(product?.discountPrice ?? product?.price);
//           const regularPrice = formatCurrency(product?.price);

//           return (
//             <article key={id} className="mx-auto w-full max-w-[220px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              
//               <div className="relative">
//               <Link href={href} className="block overflow-hidden rounded bg-slate-100">
//                 {product?.image ? (
//                   <Image
//                     src={product.image}
//                     alt={product?.name || "Product"}
//                     width={300}
//                     height={220}
//                     className="h-36 w-full object-cover transition duration-300 hover:scale-105"
//                   />
//                 ) : (
//                   <div className="flex h-40 items-center justify-center text-sm text-slate-400">No image</div>
//                 )}
//               </Link>
//               <WishlistButton
//                 productId={product?._id || product?.id}
//                 className="rounded-full bg-white/90 p-1.5 text-gray-700"
//               />
//               </div>
//               <Link href={href} className="mt-3 line-clamp-2 block text-sm font-medium text-slate-900 hover:text-slate-700">
//                 {product?.name || "Product"}
//               </Link>
//               <div className="mt-2 flex items-center gap-2">
//                 <span className="font-semibold text-emerald-600">{currentPrice || "—"}</span>
//                 {regularPrice && currentPrice !== regularPrice && (
//                   <span className="text-sm text-slate-400 line-through">{regularPrice}</span>
//                 )}
//               </div>{shouldLoadFromApi && (
//                 <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[11px] text-slate-500">
//                   <div className="rounded bg-slate-50 px-1 py-1">Sold: {product?.salesCount ?? 0}</div>
//                   <div className="rounded bg-slate-50 px-1 py-1">Wish: {product?.wishlistCount ?? 0}</div>
//                   <div className="rounded bg-slate-50 px-1 py-1">Views: {product?.viewCount ?? 0}</div>
//                 </div>
//               )}
//             </article>
//           );
//         })}
//       </div>
//     </section>
//   );
// }














"use client";

import {
  ArrowRight,
  Flame,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

import { useTrendingProducts } from "@/hooks/useTrendingProducts";
import WishlistButton from "../wishlist/WishlistButton";

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = memo(function ProductCard({
  product,
  shouldShowStats,
}) {
  const href =
    product?.href || `/product/${product?.slug || ""}`;

  const currentPrice = formatCurrency(
    product?.discountPrice ?? product?.price
  );

  const regularPrice = formatCurrency(product?.price);

  const hasDiscount =
    regularPrice && currentPrice !== regularPrice;

  const discountPercent =
    hasDiscount &&
    Number(product?.price) > 0 &&
    Number(product?.discountPrice) > 0
      ? Math.round(
          ((product.price - product.discountPrice) /
            product.price) *
            100
        )
      : null;

  return (
    <article
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200/80 bg-white
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-slate-100">
        <Link
          href={href}
          className="block"
          aria-label={product?.name || "Product"}
        >
          {product?.image ? (
            <Image
              src={product.image}
              alt={product?.name || "Product"}
              width={500}
              height={500}
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                20vw
              "
              className="
                h-44 w-full object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
        </Link>

        {/* DISCOUNT BADGE */}
        {discountPercent ? (
          <div
            className="
              absolute left-2 top-2 z-10
              rounded-full bg-rose-500
              px-2 py-1 text-[11px]
              font-semibold text-white
              shadow-sm
            "
          >
            -{discountPercent}%
          </div>
        ) : null}

        {/* WISHLIST */}
        <div className="absolute right-2 top-2 z-20">
          <WishlistButton
            productId={product?._id || product?.id}
            className="
              rounded-full bg-white/90
              p-1.5 text-gray-700
              backdrop-blur transition
              hover:bg-white
            "
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <Link
          href={href}
          className="
            line-clamp-2 block min-h-[42px]
            text-sm font-medium text-slate-900
            transition hover:text-black
          "
        >
          {product?.name || "Product"}
        </Link>

        {/* PRICE */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-emerald-600">
            {currentPrice || "—"}
          </span>

          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {regularPrice}
            </span>
          )}
        </div>

        {/* STATS */}
        {shouldShowStats && (
          <div
            className="
              mt-3 grid grid-cols-3 gap-2
              text-center text-[11px]
            "
          >
            <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-slate-600">
              <p className="font-semibold text-slate-900">
                {product?.salesCount ?? 0}
              </p>
              <p>Sold</p>
            </div>

            <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-slate-600">
              <p className="font-semibold text-slate-900">
                {product?.wishlistCount ?? 0}
              </p>
              <p>Wish</p>
            </div>

            <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-slate-600">
              <p className="font-semibold text-slate-900">
                {product?.viewCount ?? 0}
              </p>
              <p>Views</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={href}
          className="
            mt-4 inline-flex items-center gap-1
            text-xs font-semibold text-slate-700
            transition hover:gap-2 hover:text-black
          "
        >
          View Product
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
});

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TrendingProducts({
  title = "Trending Products",
  products: initialProducts = [],
  useApiFallback = false,
  query = {},
}) {
  const shouldLoadFromApi = Boolean(useApiFallback);

  const {
    products: apiProducts,
    source,
    loading,
    error,
  } = useTrendingProducts(query, shouldLoadFromApi);

  const products = useMemo(() => {
    return shouldLoadFromApi
      ? apiProducts
      : initialProducts;
  }, [shouldLoadFromApi, apiProducts, initialProducts]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (shouldLoadFromApi && loading) {
    return (
      <section
        className="
          rounded-3xl border border-slate-200
          bg-white p-5 shadow-sm md:p-6
        "
      >
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={24} />

          <h2 className="text-2xl font-bold text-slate-900">
            {title}
          </h2>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Loading trending products...
        </p>
      </section>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className="
        rounded-3xl border border-slate-200/80
        bg-white p-5 shadow-sm md:p-6
      "
    >
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl bg-orange-100 text-orange-600
            "
          >
            <TrendingUp size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              Most popular products right now
            </p>
          </div>
        </div>

        {shouldLoadFromApi && source && (
          <span
            className="
              rounded-full bg-slate-100
              px-3 py-1 text-xs font-semibold
              uppercase tracking-wide text-slate-600
            "
          >
            {source.replaceAll("_", " ")}
          </span>
        )}
      </div>

      {/* ERROR */}
      {shouldLoadFromApi && error ? (
        <div
          className="
            mb-5 rounded-2xl border border-amber-200
            bg-amber-50 px-4 py-3 text-sm text-amber-700
          "
        >
          {error}
        </div>
      ) : null}

      {/* GRID */}
      <div
        className="
          grid grid-cols-2 gap-3
          sm:grid-cols-3
          lg:grid-cols-5
          xl:grid-cols-6
        "
      >
        {products.map((product, index) => {
          const id =
            product?._id ||
            product?.id ||
            product?.slug ||
            index;

          return (
            <ProductCard
              key={id}
              product={product}
              shouldShowStats={shouldLoadFromApi}
            />
          );
        })}
      </div>
    </section>
  );
}