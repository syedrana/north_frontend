"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const AUTO_SLIDE_MS = 5000;

function normalizeBanners(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.banners)) {
    return data.banners;
  }

  if (data && typeof data === "object") {
    return [data];
  }

  return [];
}

export default function HeroBanner({ data }) {
  const banners = useMemo(() => normalizeBanners(data), [data]);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  const activeBanner = banners[activeIndex] || banners[0] || {};

  return (
    <section className="relative overflow-hidden rounded-lg">
      {activeBanner?.image && (
        <Image
          src={activeBanner.image}
          alt={activeBanner?.title || "Hero banner"}
          width={1600}
          height={600}
          className="h-auto w-full object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6 text-white md:p-10">
        {activeBanner?.title && <h2 className="text-2xl font-bold md:text-4xl">{activeBanner.title}</h2>}
        {activeBanner?.subtitle && <p className="mt-2 max-w-2xl text-sm md:text-base">{activeBanner.subtitle}</p>}

        {activeBanner?.buttonText && activeBanner?.link && (
          <Link
            href={activeBanner.link}
            className="mt-4 inline-flex w-fit rounded bg-white px-5 py-2 font-medium text-black transition hover:bg-gray-200"
          >
            {activeBanner.buttonText}
          </Link>
        )}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner?._id || banner?.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full ${
                index === activeIndex ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
