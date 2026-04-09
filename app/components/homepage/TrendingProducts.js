"use client";

import { useTrendingProducts } from "@/hooks/useTrendingProducts";
import Image from "next/image";
import Link from "next/link";

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

export default function TrendingProducts({
  title = "Trending Products",
  products: initialProducts = [],
  useApiFallback = false,
  query = {},
}) {
  const shouldLoadFromApi = useApiFallback && (!Array.isArray(initialProducts) || initialProducts.length === 0);
  const { products: apiProducts, source, loading, error } = useTrendingProducts(query, shouldLoadFromApi);

  const products = shouldLoadFromApi ? apiProducts : initialProducts;

  if (shouldLoadFromApi && loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">Loading trending products...</p>
      </section>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {shouldLoadFromApi && source && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
            {source.replaceAll("_", " ")}
          </span>
        )}
      </div>

      {shouldLoadFromApi && error && <p className="mb-4 text-sm text-amber-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => {
          const id = product?._id || product?.id || product?.slug || index;
          const href = product?.href || `/product/${product?.slug || ""}`;
          const currentPrice = formatCurrency(product?.discountPrice ?? product?.price);
          const regularPrice = formatCurrency(product?.price);

          return (
            <article key={id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <Link href={href} className="block overflow-hidden rounded-xl bg-slate-100">
                {product?.image ? (
                  <Image
                    src={product.image}
                    alt={product?.name || "Product"}
                    width={420}
                    height={320}
                    className="h-40 w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-slate-400">No image</div>
                )}
              </Link>
              <Link href={href} className="mt-3 line-clamp-2 block font-medium text-slate-900 hover:text-slate-700">
                {product?.name || "Product"}
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-emerald-600">{currentPrice || "—"}</span>
                {regularPrice && currentPrice !== regularPrice && (
                  <span className="text-sm text-slate-400 line-through">{regularPrice}</span>
                )}
              </div>{shouldLoadFromApi && (
                <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[11px] text-slate-500">
                  <div className="rounded bg-slate-50 px-1 py-1">Sold: {product?.salesCount ?? 0}</div>
                  <div className="rounded bg-slate-50 px-1 py-1">Wish: {product?.wishlistCount ?? 0}</div>
                  <div className="rounded bg-slate-50 px-1 py-1">Views: {product?.viewCount ?? 0}</div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}