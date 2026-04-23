"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatCurrency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function formatTimeParts(timeLeftMs) {
  if (timeLeftMs <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const days = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
  const hours = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return { days, hours, minutes, seconds };
}

function resolveDiscountLabel(product, sale) {
  if (sale?.discountType === "percentage" && Number.isFinite(Number(sale?.discountValue))) {
    return `${Number(sale.discountValue)}% OFF`;
  }

  if (sale?.discountType === "fixed" && Number.isFinite(Number(sale?.discountValue))) {
    return `${formatCurrency(sale.discountValue)} OFF`;
  }

  if (product?.price && product?.flashSalePrice) {
    const price = Number(product.price);
    const flashSalePrice = Number(product.flashSalePrice);

    if (price > 0 && flashSalePrice < price) {
      return `${Math.round(((price - flashSalePrice) / price) * 100)}% OFF`;
    }
  }

  return null;
}

export default function FlashSale({ title = "Flash Sale", sale, endsAt, startsAt, products = [] }) {
  const countdownTarget = useMemo(() => {
    
    const targetValue = sale?.timing?.isUpcoming ? startsAt || sale?.startTime : endsAt || sale?.endTime;
    if (!targetValue) return null;

    const targetMs = new Date(targetValue).getTime();
    return Number.isNaN(targetMs) ? null : targetMs;
  }, [endsAt, sale?.endTime, sale?.startTime, sale?.timing?.isUpcoming, startsAt]);

  const [timeLeftMs, setTimeLeftMs] = useState(0);

  useEffect(() => {
    if (!countdownTarget) return undefined;

    const updateTimeLeft = () => {
      setTimeLeftMs(Math.max(countdownTarget - Date.now(), 0));
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [countdownTarget]);

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  const { days, hours, minutes, seconds } = formatTimeParts(timeLeftMs);
  const countdownLabel = sale?.timing?.isUpcoming ? "Starts in" : "Ends in";

  return (
    <section className="overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-sm">
      <div className="flex flex-col gap-6 p-5 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-600 text-white hover:bg-red-600">Flash Sale</Badge>
              {sale?.status && (
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  {sale.status}
                </Badge>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                {sale?.timing?.isUpcoming
                  ? "Get ready — this campaign will unlock soon."
                  : sale?.timing?.isLive
                    ? "Limited-time pricing on selected products while the clock is running."
                    : "Catch the next campaign from the admin flash sale module."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-orange-200">{countdownLabel}</div>
            <div className="flex gap-2">
              {[
                { label: "Days", value: days },
                { label: "Hours", value: hours },
                { label: "Minutes", value: minutes },
                { label: "Seconds", value: seconds },
              ].map((item) => (
                <div key={item.label} className="min-w-[60px] rounded-xl bg-white/10 px-3 py-2 text-center">
                  <div className="text-xl font-semibold md:text-2xl">{item.value}</div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => {
            const id = product?._id || product?.id || product?.slug || index;
            const href = product?.href || `/product/${product?.slug || ""}`;
            const regularPrice = formatCurrency(product?.price);
            const currentPrice = formatCurrency(product?.flashSalePrice ?? product?.discountPrice ?? product?.price);
            const discountLabel = resolveDiscountLabel(product, sale);
            const soldOut = Number(product?.stock) <= 0 && Number.isFinite(Number(product?.stock));

            return (
              <article key={id} className="group rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="relative overflow-hidden rounded-xl bg-slate-100">
                  <Link href={href}>
                    {product?.image ? (
                      <Image
                        src={product.image}
                        alt={product?.name || "Product"}
                        width={480}
                        height={320}
                        className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-slate-400">No image</div>
                    )}
                  </Link>
                  {discountLabel && (
                    <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      {discountLabel}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <Link href={href} className="line-clamp-2 font-medium text-slate-900 transition hover:text-orange-700">
                      {product?.name || "Product"}
                    </Link>
                    {/* {product?.categoryId && (
                      <p className="mt-1 text-xs text-slate-400">Category ID: {String(product.categoryId)}</p>
                    )} */}
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-emerald-600">{currentPrice || "—"}</div>
                      {regularPrice && currentPrice !== regularPrice && (
                        <div className="text-sm text-slate-400 line-through">{regularPrice}</div>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      {/* <div>Stock</div>
                      <div className={soldOut ? "font-semibold text-red-600" : "font-semibold text-slate-700"}>
                        {Number.isFinite(Number(product?.stock)) ? product.stock : "—"}
                      </div> */}
                    </div>
                  </div>

                  {/* <Link
                    href={href}
                    className="block rounded-xl bg-slate-950 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-orange-600"
                  >
                    {soldOut ? "View Details" : "Shop Now"}
                  </Link> */}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
