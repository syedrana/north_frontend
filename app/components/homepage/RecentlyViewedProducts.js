"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecentlyViewedProducts({ title = "Recently Viewed" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRecentlyViewed = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/recently-viewed", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recently viewed products");
        }

        const data = await response.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : Array.isArray(data?.data)
              ? data.data
              : [];

        if (isMounted) {
          setProducts(items);
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
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {products.map((product, index) => {
          const id = product?._id || product?.id || product?.slug || index;
          const href = product?.href || `/product/${product?.slug || ""}`;

          return (
            <article
              key={id}
              className="min-w-[220px] max-w-[220px] flex-shrink-0 rounded-lg border bg-white p-3 shadow-sm"
            >
              <Link href={href}>
                {product?.image && (
                  <Image
                    src={product.image}
                    alt={product?.name || "Product"}
                    width={300}
                    height={220}
                    className="h-36 w-full rounded object-cover"
                  />
                )}
              </Link>

              <Link href={href} className="mt-3 block text-sm font-medium text-gray-900">
                {product?.name || "Product"}
              </Link>

              <p className="mt-1 font-semibold text-emerald-600">${product?.price ?? ""}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
