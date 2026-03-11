"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatTimeParts(timeLeftMs) {
  if (timeLeftMs <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return { hours, minutes, seconds };
}

function resolveDiscountLabel(product) {
  if (product?.discount) {
    return product.discount;
  }

  if (product?.price && product?.discountPrice) {
    const price = Number(product.price);
    const discountPrice = Number(product.discountPrice);

    if (price > 0 && discountPrice < price) {
      const percentage = Math.round(((price - discountPrice) / price) * 100);
      return `${percentage}% OFF`;
    }
  }

  return null;
}

export default function FlashSale({ title = "Flash Sale", endsAt, products = [] }) {
  const countdownTarget = useMemo(() => {
    if (!endsAt) {
      return null;
    }

    const targetMs = new Date(endsAt).getTime();
    return Number.isNaN(targetMs) ? null : targetMs;
  }, [endsAt]);

  const [timeLeftMs, setTimeLeftMs] = useState(0);

  useEffect(() => {
    if (!countdownTarget) {
      return undefined;
    }

    const updateTimeLeft = () => {
      setTimeLeftMs(Math.max(countdownTarget - Date.now(), 0));
    };

    const initialTimeout = setTimeout(updateTimeLeft, 0);
    const timer = setInterval(updateTimeLeft, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(timer);
    };
  }, [countdownTarget]);

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  const { hours, minutes, seconds } = formatTimeParts(timeLeftMs);

  return (
    <section className="rounded-xl border border-orange-100 bg-orange-50/40 p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:mb-5 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span>Ends in:</span>
          <div className="flex items-center gap-1">
            {[hours, minutes, seconds].map((part, index) => (
              <div key={`${part}-${index}`} className="rounded-md bg-gray-900 px-2 py-1 text-white">
                {part}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {products.map((product, index) => {
          const id = product?._id || product?.id || product?.slug || index;
          const href = product?.href || `/product/${product?.slug || ""}`;
          const discountLabel = resolveDiscountLabel(product);

          return (
            <article
              key={id}
              className="min-w-[220px] snap-start rounded-lg border bg-white p-3 shadow-sm md:min-w-[250px]"
            >
              <Link href={href}>
                {product?.image && (
                  <Image
                    src={product.image}
                    alt={product?.name || "Product"}
                    width={400}
                    height={300}
                    className="h-40 w-full rounded object-cover"
                  />
                )}
              </Link>

              <Link href={href} className="mt-3 block font-medium text-gray-900">
                {product?.name || "Product"}
              </Link>

              <div className="mt-1 flex items-center gap-2">
                {product?.discountPrice ? (
                  <>
                    <span className="font-semibold text-emerald-600">${product.discountPrice}</span>
                    <span className="text-sm text-gray-500 line-through">${product?.price ?? ""}</span>
                  </>
                ) : (
                  <span className="font-semibold text-emerald-600">${product?.price ?? ""}</span>
                )}
              </div>

              {discountLabel && (
                <p className="mt-1 text-xs font-semibold text-red-500">{discountLabel}</p>
              )}

              <button
                type="button"
                className="mt-3 w-full rounded bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
